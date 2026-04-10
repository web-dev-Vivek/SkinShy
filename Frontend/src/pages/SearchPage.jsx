import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, searchProducts } from '../services/products';
import { getSafetyScoreByProductId } from '../services/safety';

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyScores, setSafetyScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(1);
      setProducts(data.data);
      // Load safety scores for first batch
      await loadSafetyScores(data.data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products. Please try again.');
      setProducts([]);
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
    setError(null);
    
    if (!query) {
      loadProducts();
      return;
    }

    setLoading(true);
    try {
      const data = await searchProducts(query);
      setProducts(data.data);
      await loadSafetyScores(data.data);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.message || 'Search failed. Please try again.');
      setProducts([]);
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
     <div className="min-h-screen bg-custom-white">
       {/* Header */}
       <header className="bg-custom-charcoal text-custom-white py-8 px-4">
         <div className="max-w-6xl mx-auto">
           <div className="flex justify-between items-center mb-6">
             <h1 className="text-4xl font-bold font-playfair">Skinshy</h1>
             <button
               onClick={() => navigate('/profile')}
               className="bg-custom-white/20 hover:bg-custom-white/30 px-4 py-2 rounded-lg font-semibold transition"
             >
               Profile
             </button>
           </div>
           <p className="text-lg text-custom-off-white">Find safe products for your skin</p>
         </div>
       </header>

       {/* Search Box */}
       <div className="bg-custom-white border-b sticky top-0 z-10 shadow-sm">
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
              {products.map(product => {
                const score = safetyScores[product._id];
                const badge = score ? getRiskBadge(score.riskLevel) : null;

                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-custom-white border border-custom-light-gray/20 rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-custom-charcoal flex-1 pr-2 line-clamp-2">{product.productName}</h3>
                        {score && (
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-custom-charcoal text-custom-white flex items-center justify-center font-bold text-sm">
                            {score.score}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-custom-dark-gray mb-1">{product.productType}</p>
                      <p className="text-sm font-semibold text-custom-charcoal mb-3">{product.price}</p>
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
