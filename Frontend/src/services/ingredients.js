import { api } from './api';

export const searchIngredients = async (query) => {
  try {
    console.log('Searching for ingredients:', query);
    const response = await api.get('/safety/glossary/search', {
      params: { q: query }
    });
    console.log('Search response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error searching ingredients:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.error || error.message || 'Failed to search ingredients',
      status: error.response?.status,
      details: error.response?.data
    };
  }
};

export const getIngredientDetails = async (ingredientName) => {
  try {
    console.log('Fetching details for:', ingredientName);
    const response = await api.get(`/safety/glossary/ingredient/${encodeURIComponent(ingredientName)}`);
    console.log('Details response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ingredient details:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.error || error.message || 'Failed to load ingredient details',
      status: error.response?.status,
      details: error.response?.data
    };
  }
};

export const getAllIngredients = async () => {
  try {
    const response = await api.get('/safety/glossary/all');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all ingredients:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.error || error.message || 'Failed to fetch ingredients',
      status: error.response?.status,
      details: error.response?.data
    };
  }
};
