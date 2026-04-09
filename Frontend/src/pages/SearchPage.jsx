import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, searchProducts } from '../services/products';
import { getSafetyScoreByProductId } from '../services/safety';

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyScores, setSafetyScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(1);
      setProducts(data.data);
      // Load safety scores for first batch
      await loadSafetyScores(data.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSafetyScores = async (productList) => {
    const scores = {};
    for (const product of productList) {
      try {
        const result = await getSafetyScoreByProductId(product._id);
        scores[product._id] = result.safetyScore;
      } catch (error) {
        console.error(`Failed to load score for ${product._id}`);
      }
    }
    setSafetyScores(scores);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      loadProducts();
      return;
    }

    setLoading(true);
    try {
      const data = await searchProducts(query);
      setProducts(data.data);
      await loadSafetyScores(data.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (riskLevel) => {
    const badges = {
      'very_safe': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Very Safe' },
      'safe': { bg: 'bg-blue-100', text: 'text-blue-800', label: '✅ Safe' },
      'moderate': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⚠️ Moderate' },
      'high': { bg: 'bg-red-100', text: 'text-red-800', label: '⚠️ High Risk' },
      'danger': { bg: 'bg-red-200', text: 'text-red-900', label: '🛑 Danger' }
    };
    return badges[riskLevel] || badges.moderate;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">Skinshy</h1>
            <button
              onClick={() => navigate('/profile')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition"
            >
              Profile
            </button>
          </div>
          <p className="text-lg text-pink-50">Find safe products for your skin</p>
        </div>
      </header>

      {/* Search Box */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(product => {
              const score = safetyScores[product._id];
              const badge = score ? getRiskBadge(score.riskLevel) : null;

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800 flex-1 pr-2 line-clamp-2">{product.productName}</h3>
                      {score && (
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 text-white flex items-center justify-center font-bold text-sm">
                          {score.score}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{product.productType}</p>
                    <p className="text-sm font-semibold text-gray-900 mb-3">{product.price}</p>
                    {score && (
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
