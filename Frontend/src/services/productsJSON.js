let productsCache = null;

export const loadProducts = async () => {
  if (productsCache) {
    return productsCache;
  }

  try {
    const response = await fetch('/products.json');
    const data = await response.json();
    productsCache = Array.isArray(data) ? data : [data];
    return productsCache;
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
};

export const getAllProducts = async () => {
  return loadProducts();
};

export const getProductByName = async (productName) => {
  const products = await loadProducts();
  if (!productName) return null;
  
  // Decode the product name from URL
  const decodedName = decodeURIComponent(productName);
  
  // Find product by exact or fuzzy match
  return products.find(product => 
    product.product_name.toLowerCase() === decodedName.toLowerCase()
  ) || null;
};

export const searchProducts = async (query) => {
  const products = await loadProducts();
  if (!query) return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.product_name.toLowerCase().includes(lowerQuery) ||
    product.product_type.toLowerCase().includes(lowerQuery)
  );
};
