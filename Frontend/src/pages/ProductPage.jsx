import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/products';
import { getSafetyScoreByProductId } from '../services/safety';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProductData = async () => {
    setLoading(true);
    try {
      const [productData, scoreData] = await Promise.all([
        getProductById(id),
        getSafetyScoreByProductId(id)
      ]);
      setProduct(productData);
      setSafetyScore(scoreData.safetyScore);
    } catch (error) {
      console.error('Failed to load product:', error);
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Product not found</p>
          <button onClick={() => navigate('/search')} className="mt-4 text-rose-500 hover:text-rose-600">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const getRiskColor = (riskLevel) => {
    const colors = {
      'very_safe': 'text-green-600',
      'safe': 'text-blue-600',
      'moderate': 'text-yellow-600',
      'high': 'text-red-600',
      'danger': 'text-red-800'
    };
    return colors[riskLevel] || 'text-yellow-600';
  };

  const getRiskBg = (riskLevel) => {
    const colors = {
      'very_safe': 'bg-green-50 border-green-200',
      'safe': 'bg-blue-50 border-blue-200',
      'moderate': 'bg-yellow-50 border-yellow-200',
      'high': 'bg-red-50 border-red-200',
      'danger': 'bg-red-100 border-red-300'
    };
    return colors[riskLevel] || 'bg-yellow-50 border-yellow-200';
  };

  const getCategoryColor = (categoryType) => {
    return categoryType === 'A' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/search')}
            className="text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
          >
            ← Back to Search
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>
            <p className="text-gray-600 text-lg mb-2">{product.productType}</p>
            <p className="text-2xl font-semibold text-gray-900 mb-4">{product.price}</p>
            {product.productUrl && (
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                View on Store →
              </a>
            )}
          </div>

          {/* Safety Score */}
          {safetyScore && (
            <div className={`flex flex-col items-center justify-center rounded-lg p-8 border-2 ${getRiskBg(safetyScore.riskLevel)}`}>
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${getRiskColor(safetyScore.riskLevel)}`}>
                <span className="text-4xl font-bold">{safetyScore.score}</span>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">Safety Score</p>
              <p className={`text-xl font-semibold mt-2 ${getRiskColor(safetyScore.riskLevel)}`}>
                {safetyScore.recommendation}
              </p>
            </div>
          )}
        </div>

        {/* Safety Analysis */}
        {safetyScore && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Analysis</h2>

            {/* Penalties */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Penalties</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">Category A (Potent)</span>
                  <span className="text-red-600 font-semibold">-{safetyScore.penalties.categoryA || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">Allergens</span>
                  <span className="text-red-600 font-semibold">-{safetyScore.penalties.allergens || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">Skin Type Mismatch</span>
                  <span className="text-red-600 font-semibold">-{safetyScore.penalties.skinTypeMismatch || 0}</span>
                </div>
                <div className="flex justify-between py-3 bg-gray-50 px-3 rounded font-semibold">
                  <span>Total Penalties</span>
                  <span className="text-red-600">-{safetyScore.penalties.total || 0}</span>
                </div>
              </div>
            </div>

            {/* Bonuses */}
            {safetyScore.bonuses.total > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Bonuses</h3>
                <div className="flex justify-between py-3 bg-green-50 px-3 rounded font-semibold">
                  <span>Total Bonuses</span>
                  <span className="text-green-600">+{safetyScore.bonuses.total}</span>
                </div>
              </div>
            )}

            {/* Warnings */}
            {safetyScore.warnings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Warnings</h3>
                <ul className="space-y-2">
                  {safetyScore.warnings.map((warning, idx) => (
                    <li key={idx} className="flex gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Ingredients */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients ({product.ingredients.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {product.ingredients.map((ing, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-600">#{ing.position}</span>
                      <span className="text-lg font-semibold text-gray-900">{ing.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryColor(ing.categoryType)}`}>
                    {ing.categoryType === 'A' ? 'Potent' : 'Concentration-Dependent'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-100 text-purple-800">
                    Reactivity: {ing.reactivityScore}/5
                  </span>
                  {ing.knownAllergen && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-orange-100 text-orange-800">
                      Allergen: {ing.allergenGroup}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
