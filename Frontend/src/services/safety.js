import api from './api';

export const calculateSafetyScore = async (productId) => {
  const response = await api.post('/safety/calculate', { productId });
  return response.data;
};

export const getSafetyScoreByProductId = async (productId) => {
  const response = await api.get(`/safety/product/${productId}`);
  return response.data;
};

export const getBatchSafetyScores = async (productIds) => {
  const response = await api.post('/safety/batch', { productIds });
  return response.data.data;
};
