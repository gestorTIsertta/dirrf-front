import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { auth } from 'src/config-firebase';
import { authBackoffice } from 'src/config-firebase-backoffice';

const baseURL = import.meta.env.VITE_BASE_URL_API || '';

const api: AxiosInstance = axios.create({
  baseURL,
});

function isBackofficeRoute(url?: string): boolean {
  if (!url) return false;
  const path = url.replace(baseURL, '').split('?')[0];
  return path.startsWith('/clients');
}

function hasCpfInQuery(url?: string): boolean {
  if (!url) return false;
  const queryString = url.split('?')[1];
  if (!queryString) return false;
  const params = new URLSearchParams(queryString);
  return params.has('cpf') || params.has('clientCpf');
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const isBackoffice = isBackofficeRoute(config.url);
      const hasCpf = hasCpfInQuery(config.url);
      
      if (isBackoffice) {
        // Rotas de backoffice sempre usam Firebase Backoffice
        await authBackoffice.authStateReady();
        const user = authBackoffice.currentUser;

        if (user) {
          try {
            const token = await user.getIdToken();
            if (config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (tokenError) {
            // Não adiciona token se houver erro, deixa a requisição falhar
          }
        }
      } else if (hasCpf) {
        // Rotas IRPF com CPF na query → Contador acessando declaração do cliente
        // Usar token do Firebase Backoffice (contador está logado lá)
        await authBackoffice.authStateReady();
        const user = authBackoffice.currentUser;

        if (user) {
          const token = await user.getIdToken();
          if (config.headers) config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Fallback: tentar usar token normal se backoffice não estiver logado
          await auth.authStateReady();
          const userNormal = auth.currentUser;
          if (userNormal) {
            const token = await userNormal.getIdToken();
            if (config.headers) config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } else {
        // Rotas IRPF sem CPF na query → Cliente normal acessando
        // Usar Firebase normal
        await auth.authStateReady();
        const user = auth.currentUser;

        if (user) {
          const token = await user.getIdToken();
          if (config.headers) config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Fallback: tentar usar token do backoffice se normal não estiver logado
          await authBackoffice.authStateReady();
          const userBackoffice = authBackoffice.currentUser;
          if (userBackoffice) {
            const token = await userBackoffice.getIdToken();
            if (config.headers) config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
    } catch (error: unknown) {
      // Erro silencioso - a requisição pode falhar normalmente
    }

    if (config.headers && !(config.data instanceof FormData)) {
      if (!config.headers['Content-Type'] && !config.headers['content-type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error: unknown) => {
    throw error;
  }
);

const retryCountMap = new Map<string, number>();
const MAX_RETRY_ATTEMPTS = 1;

function getRequestKey(config: InternalAxiosRequestConfig): string {
  const url = config.url || '';
  const method = config.method?.toUpperCase() || 'GET';
  return `${method}:${url}`;
}

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config) {
      const key = getRequestKey(response.config);
      retryCountMap.delete(key);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401 && error.config) {
      const requestKey = getRequestKey(error.config);
      const retryCount = retryCountMap.get(requestKey) || 0;

      // Evita loop infinito: só tenta renovar token uma vez
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        retryCountMap.delete(requestKey);
        return Promise.reject(error);
      }

      // Incrementa contador ANTES de tentar renovar
      retryCountMap.set(requestKey, retryCount + 1);

      try {
        const requestUrl = error.config.url || '';
        const isBackoffice = isBackofficeRoute(requestUrl);
        const hasCpf = hasCpfInQuery(requestUrl);
        
        if (isBackoffice || hasCpf) {
          // Usar Firebase Backoffice para rotas de backoffice ou IRPF com CPF
          await authBackoffice.authStateReady();
          const user = authBackoffice.currentUser;
          
          if (!user) {
            retryCountMap.delete(requestKey);
            return Promise.reject(error);
          }

          try {
            const newToken = await user.getIdToken(true);

            // Atualiza o header com o novo token
            if (error.config.headers) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
            }

            // Faz nova requisição (NÃO remove o contador aqui - só remove em caso de sucesso)
            return api.request(error.config);
          } catch (tokenError) {
            retryCountMap.delete(requestKey);
            return Promise.reject(error);
          }
        } else {
          // Usar Firebase normal para rotas de cliente
          await auth.authStateReady();
          const user = auth.currentUser;
          
          if (!user) {
            retryCountMap.delete(requestKey);
            return Promise.reject(error);
          }

          try {
            const newToken = await user.getIdToken(true);

            // Atualiza o header com o novo token
            if (error.config.headers) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
            }

            // Faz nova requisição (NÃO remove o contador aqui - só remove em caso de sucesso)
            return api.request(error.config);
          } catch (tokenError) {
            retryCountMap.delete(requestKey);
            return Promise.reject(error);
          }
        }
      } catch (retryError) {
        retryCountMap.delete(requestKey);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
