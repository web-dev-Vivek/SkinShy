import { api } from './api';

// Sync user with backend after Clerk authentication
export const syncUserWithBackend = async (clerkId, email, name, profileImage = null) => {
  try {
    const response = await api.post('/auth/sync', {
      clerkId,
      email,
      name,
      profileImage
    });
    return response.data.user;
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
};

// Get the current user from backend
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};
