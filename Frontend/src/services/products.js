import api from './api';

export const getProducts = async (page = 1, limit = 20, search = '', type = '') => {
  let url = `/products?page=${page}&limit=${limit}`;
  if (search) url += `&search=${search}`;
  if (type) url += `&type=${type}`;
  
  const response = await api.get(url);
  return response.data;
};

export const searchProducts = async (query, limit = 20) => {
  const response = await api.get(`/products/search?q=${query}&limit=${limit}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

export const getProductTypes = async () => {
  const response = await api.get('/products/api/types');
  return response.data.data;
};
