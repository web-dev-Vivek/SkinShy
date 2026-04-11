import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store setToken function to be called from App
let clerkGetToken = null;

export const setClerkTokenGetter = (getTokenFn) => {
  clerkGetToken = getTokenFn;
};

// Add request interceptor to attach Clerk token
api.interceptors.request.use(
  async (config) => {
    try {
      if (clerkGetToken) {
        const token = await clerkGetToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Failed to get Clerk token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✓ ${response.config.method.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`[API] ✗ ${error.response?.status || 'Network'} Error:`, error.response?.data?.error || error.message);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('clerk_user');
    }
    
    return Promise.reject(error);
  }
);

export default api;
