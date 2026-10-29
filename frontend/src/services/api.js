import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and parse error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login?expired=true';
        }
      }
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        (typeof error.response.data === 'string' ? error.response.data : null) ||
        'An unexpected server error occurred.';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(
        new Error('Unable to connect to the hospital server. Please check your network or try again.')
      );
    }
    return Promise.reject(error);
  }
);

export default api;
