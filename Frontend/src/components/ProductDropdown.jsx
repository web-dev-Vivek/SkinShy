import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, searchProducts } from '../services/products';

export default function ProductDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(1, 20);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Failed to load products for dropdown:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 1) {
      setLoading(true);
      try {
        const response = await searchProducts(query);
        setProducts(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else if (query.trim().length === 0) {
      fetchProducts();
    }
  };

  const handleProductClick = (product) => {
    navigate(`/search/${product._id}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredProducts = products;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors"
      >
        Products
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-custom-white border border-custom-light-gray/30 rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-custom-light-gray/20">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-custom-light-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-charcoal text-sm"
              autoFocus
            />
          </div>

          {/* Product List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-custom-dark-gray text-sm">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-custom-dark-gray text-sm">
                {searchQuery ? 'No products found' : 'No products available'}
              </div>
            ) : (
              filteredProducts.map(product => (
                <button
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="w-full text-left px-4 py-3 hover:bg-custom-light-gray/10 border-b border-custom-light-gray/10 last:border-b-0 transition-colors"
                >
                  <p className="font-medium text-custom-charcoal text-sm line-clamp-1">
                    {product.productName}
                  </p>
                  <p className="text-xs text-custom-dark-gray">
                    {product.productType}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
