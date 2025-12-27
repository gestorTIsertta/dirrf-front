import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { auth } from 'src/config-firebase';
import { authBackoffice } from 'src/config-firebase-backoffice';
import { paths } from 'src/routes/paths';

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

function handle401Redirect(url?: string): void {
  if (window.location.pathname === paths.contador.login || window.location.pathname === paths.auth.login) {
    return;
  }

  const isBackoffice = isBackofficeRoute(url);
  const hasCpf = hasCpfInQuery(url);

  if (isBackoffice || hasCpf) {
    window.location.href = paths.contador.login;
  } else {
    window.location.href = paths.auth.login;
  }
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const isBackoffice = isBackofficeRoute(config.url);
      const hasCpf = hasCpfInQuery(config.url);
      
      if (isBackoffice) {
        await authBackoffice.authStateReady();
        const user = authBackoffice.currentUser;

        if (user) {
          try {
            const token = await user.getIdToken();
            if (config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (tokenError) {
            // Error getting token - ignore
          }
        }
      } else if (hasCpf) {
        await authBackoffice.authStateReady();
        const user = authBackoffice.currentUser;

        if (user) {
          const token = await user.getIdToken();
          if (config.headers) config.headers.Authorization = `Bearer ${token}`;
        } else {
          await auth.authStateReady();
          const userNormal = auth.currentUser;
          if (userNormal) {
            const token = await userNormal.getIdToken();
            if (config.headers) config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } else {
        await auth.authStateReady();
        const user = auth.currentUser;

        if (user) {
          const token = await user.getIdToken();
          if (config.headers) config.headers.Authorization = `Bearer ${token}`;
        } else {
          await authBackoffice.authStateReady();
          const userBackoffice = authBackoffice.currentUser;
          if (userBackoffice) {
            const token = await userBackoffice.getIdToken();
            if (config.headers) config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
    } catch (error: unknown) {
      // Error in auth interceptor - ignore
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

      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        retryCountMap.delete(requestKey);
        handle401Redirect(error.config?.url);
        throw error;
      }

      retryCountMap.set(requestKey, retryCount + 1);

      try {
        const requestUrl = error.config.url || '';
        const isBackoffice = isBackofficeRoute(requestUrl);
        const hasCpf = hasCpfInQuery(requestUrl);
        
        if (isBackoffice || hasCpf) {
          await authBackoffice.authStateReady();
          const user = authBackoffice.currentUser;

          if (!user) {
            retryCountMap.delete(requestKey);
            handle401Redirect(requestUrl);
            throw error;
          }

          try {
            const newToken = await user.getIdToken(true);

            if (error.config.headers) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
            }

            return api.request(error.config);
          } catch (tokenError) {
            retryCountMap.delete(requestKey);
            handle401Redirect(requestUrl);
            throw error;
          }
        } else {
          await auth.authStateReady();
          const user = auth.currentUser;

          if (!user) {
            retryCountMap.delete(requestKey);
            handle401Redirect(requestUrl);
            throw error;
          }

          try {
            const newToken = await user.getIdToken(true);

            if (error.config.headers) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
            }

            return api.request(error.config);
          } catch (tokenError) {
            retryCountMap.delete(requestKey);
            handle401Redirect(requestUrl);
            throw error;
          }
        }
      } catch (retryError) {
        retryCountMap.delete(requestKey);
        handle401Redirect(error.config?.url);
        throw error;
      }
    }

    throw error;
  }
);

export default api;
