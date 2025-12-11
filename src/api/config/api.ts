import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { auth } from 'src/config-firebase';

const baseURL = import.meta.env.VITE_BASE_URL_API || '';

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();

        if (config.headers) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error: unknown) {
      console.warn('Erro ao obter token do Firebase:', error);
    }

    return config;
  },
  (error: unknown) => {
    throw error;
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const user = auth.currentUser;
      if (user) {
        try {
          const newToken = await user.getIdToken(true);

          if (error.config?.headers) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
          }

          if (error.config) {
            return api.request(error.config);
          }
        } catch {
          throw error;
        }
      }
    }

    throw error;
  }
);

export default api;
