import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5005/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('[API Network Error] Server unreachable or CORS issue');
      error.message = 'Server is unreachable. Please check if the backend is running.';
    } else {
      console.error(`[API Error Response] ${error.response.status}:`, error.response.data);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
