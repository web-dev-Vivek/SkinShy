import api from './api';

export const completeOnboarding = async (skinDetails) => {
  try {
    const response = await api.post('/users/complete-onboarding', skinDetails);
    return response.data;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error.response?.data || error;
  }
};

export const getUserPreferences = async () => {
  try {
    const response = await api.get('/users/preferences');
    return response.data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error.response?.data || error;
  }
};

export const syncUser = async (userData) => {
  try {
    const response = await api.post('/auth/sync', userData);
    return response.data;
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error.response?.data || error;
  }
};
