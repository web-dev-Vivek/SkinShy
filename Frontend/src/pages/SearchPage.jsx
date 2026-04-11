import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { getAllProducts, searchProducts } from '../services/productsJSON';
import PageHeader from '../components/PageHeader';

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setError(null);

    try {
      const data = await searchProducts(query);
      setProducts(data);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.message || 'Search failed. Please try again.');
      setProducts([]);
    }
  };

  const handleProductClick = (productName) => {
    // Encode product name for URL
    const encodedName = encodeURIComponent(productName);
    navigate(`/search/${encodedName}`);
  };

  return (
    <div className="min-h-screen bg-custom-white">
      {/* Header */}
      <PageHeader />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-lg text-custom-dark-gray mb-6">Find safe products for your skin</p>
      </div>

      {/* Search Box */}
      <div className="bg-custom-white border-b sticky z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border border-custom-light-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-charcoal text-custom-charcoal"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-700 font-medium text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
            <button
              onClick={() => loadProducts()}
              className="mt-2 text-xs text-red-600 hover:text-red-800 font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-charcoal mx-auto mb-4"></div>
              <p className="text-custom-dark-gray">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-custom-dark-gray text-lg">
              {searchQuery ? 'No products found for your search' : 'No products available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, idx) => (
              <div
                key={idx}
                onClick={() => handleProductClick(product.product_name)}
                className="bg-custom-white border border-custom-light-gray/20 rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                {/* Product Image/URL */}
                <div className="aspect-square bg-custom-light-gray/10 border-b border-custom-light-gray/20 overflow-hidden flex items-center justify-center">
                  {product.product_url ? (
                    <img
                      src={product.product_url}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <svg className="w-12 h-12 text-custom-light-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-custom-charcoal line-clamp-2 mb-1">{product.product_name}</h3>
                  <p className="text-sm text-custom-dark-gray mb-2">{product.product_type}</p>
                  <p className="text-sm font-semibold text-custom-charcoal">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
