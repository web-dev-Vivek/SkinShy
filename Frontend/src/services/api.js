import axios from 'axios';
import { getAuth } from '@clerk/clerk-react';

const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach Clerk token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the Clerk session and token
      const { getToken } = getAuth();
      if (getToken) {
        const token = await getToken();
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
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('clerk_user');
      // Window reload will trigger Clerk to handle auth state
    }
    
    return Promise.reject(error);
  }
);

export default api;
