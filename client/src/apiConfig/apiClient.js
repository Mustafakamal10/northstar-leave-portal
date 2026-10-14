/**
 * Axios API Client Configuration
 * Pre-configured Axios instance with base URL, authentication bearer interceptor, and 401 auto-logout handling.
 */

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const defaultBaseUrl = import.meta.env.PROD
  ? 'https://stirring-bavarois-aa22c4.netlify.app/api'
  : 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
