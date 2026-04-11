import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to set the auth token (will be called from App.jsx)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('[API] ✓ Authorization header set');
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('[API] Authorization header removed');
  }
};

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✓ ${response.config.method.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('[API] ✗ Unauthorized (401) - redirecting to login');
      window.location.href = '/login';
    } else {
      console.error(`[API] ✗ ${error.response?.status || 'Network'} Error:`, error.response?.data?.error || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
