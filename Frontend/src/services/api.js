import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✓ ${response.config.method.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`[API] ✗ ${error.response?.status || 'Network'} Error:`, error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);

export default api;
