import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function SearchPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all products from backend
    setLoading(true);
    fetch('http://localhost:5000/api/products?limit=100')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data);
        setFilteredProducts(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.productName.toLowerCase().includes(query) ||
        product.productType.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleProductClick = (productName) => {
    navigate(`/search/${encodeURIComponent(productName)}`);
  };

  return (
    <div className="min-h-screen bg-custom-white px-4 py-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-playfair text-custom-charcoal mb-2">
            Welcome, {user?.firstName || 'User'}!
          </h1>
          <p className="text-custom-dark-gray">
            Browse personalized skincare products for you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-custom-light-gray/30 rounded-lg focus:ring-2 focus:ring-custom-charcoal focus:border-transparent text-custom-charcoal placeholder-custom-dark-gray"
          />
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-custom-dark-gray">
          Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-charcoal mx-auto mb-4"></div>
              <p className="text-custom-dark-gray">Loading products...</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-custom-dark-gray text-lg">
              No products found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product.productName)}
                className="border border-custom-light-gray/20 rounded-lg p-4 hover:shadow-lg hover:border-custom-charcoal/30 transition cursor-pointer hover:scale-105 transform"
              >
                <h3 className="font-semibold text-custom-charcoal mb-2 line-clamp-2 hover:text-custom-black">
                  {product.productName}
                </h3>
                <p className="text-sm text-custom-dark-gray mb-2">
                  {product.productType}
                </p>
                <p className="text-lg font-bold text-custom-charcoal">
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
