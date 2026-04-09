import { api } from './api';

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data.user;
};

export const updateUserProfile = async (name, email) => {
  const response = await api.put('/users/profile', { name, email });
  return response.data.user;
};

export const getUserPreferences = async () => {
  const response = await api.get('/users/preferences');
  return response.data.preferences;
};

export const updateUserPreferences = async (preferences) => {
  const response = await api.put('/users/preferences', preferences);
  return response.data.preferences;
};

export const completeOnboarding = async (skinType, highSensitivity, knownAllergies, productChangeRate) => {
  const response = await api.post('/users/complete-onboarding', {
    skinType,
    highSensitivity,
    knownAllergies,
    productChangeRate
  });
  return response.data.preferences;
};
