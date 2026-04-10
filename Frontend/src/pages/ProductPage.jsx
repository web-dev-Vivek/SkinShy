import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/products';
import { getSafetyScoreByProductId } from '../services/safety';
import ProductSkeleton from '../components/ProductSkeleton';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productData, scoreData] = await Promise.all([
        getProductById(id),
        getSafetyScoreByProductId(id)
      ]);
      setProduct(productData);
      setSafetyScore(scoreData.safetyScore);
    } catch (err) {
      console.error('Failed to load product:', err);
      setError(err.message || 'Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

   if (loading) {
      return <ProductSkeleton />;
   }

    if (error) {
      return (
        <div className="min-h-screen bg-custom-white">
          <div className="bg-custom-off-white border-b border-custom-light-gray/20 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <button
                onClick={() => navigate('/search')}
                className="text-custom-charcoal hover:text-custom-black font-semibold flex items-center gap-1 transition"
              >
                ← Back to Search
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-custom-charcoal mb-2">Failed to Load Product</h2>
              <p className="text-custom-dark-gray mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => loadProductData()}
                  className="px-6 py-2 bg-custom-charcoal text-custom-white font-semibold rounded-lg hover:bg-custom-black transition"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/search')}
                  className="px-6 py-2 border border-custom-light-gray text-custom-charcoal font-semibold rounded-lg hover:border-custom-charcoal transition"
                >
                  Back to Search
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

   if (!product) {
     return (
       <div className="min-h-screen bg-custom-white flex items-center justify-center">
         <div className="text-center">
           <p className="text-red-600 text-lg">Product not found</p>
           <button onClick={() => navigate('/search')} className="mt-4 text-custom-charcoal hover:text-custom-black">
             Back to Search
           </button>
         </div>
       </div>
     );
   }



   return (
      <div className="min-h-screen bg-custom-white">
        {/* Header */}
        <div className="bg-custom-off-white border-b border-custom-light-gray/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/search')}
              className="text-custom-charcoal hover:text-custom-black font-semibold flex items-center gap-1 transition"
            >
              ← Back to Search
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Product Image & Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-custom-light-gray/10 border-2 border-dashed border-custom-light-gray/30 rounded-2xl flex items-center justify-center overflow-hidden">
                {product.productImage ? (
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-custom-dark-gray">
                    <svg className="w-16 h-16 mx-auto opacity-30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Product Image</p>
                  </div>
                )}
              </div>

              {/* Product Name & Price */}
              <div className="border-t pt-6 space-y-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-custom-charcoal font-playfair break-words">{product.productName}</h1>
                
                {product.productType && (
                  <p className="text-custom-dark-gray text-sm lg:text-base">{product.productType}</p>
                )}

                {product.price && (
                  <p className="text-2xl lg:text-3xl font-bold text-custom-charcoal">{product.price}</p>
                )}

                {product.productUrl && (
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-custom-charcoal hover:bg-custom-black text-custom-white font-semibold py-2 px-4 rounded-lg transition w-full text-center mt-4"
                  >
                    View on Store →
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Ingredients & Safety */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Safety & Risk Percentage */}
              {safetyScore && (
                <div className="bg-custom-off-white border border-custom-light-gray/20 rounded-2xl p-6 lg:p-8">
                  <h2 className="text-lg lg:text-xl font-bold text-custom-charcoal mb-6">Safety Overview</h2>
                  
                  {/* Safety Score Circle */}
                  <div className="flex flex-col items-center mb-8 pb-8 border-b border-custom-light-gray/20">
                    <div className="w-28 h-28 rounded-full border-4 border-custom-charcoal flex items-center justify-center bg-custom-light-gray/5">
                      <div className="text-center">
                        <span className="text-4xl lg:text-5xl font-bold text-custom-charcoal">{safetyScore.score}</span>
                        <p className="text-xs text-custom-dark-gray mt-1">/ 100</p>
                      </div>
                    </div>
                    <p className="text-center text-lg font-semibold text-custom-charcoal mt-4">
                      {safetyScore.recommendation}
                    </p>
                  </div>

                  {/* Safe vs Risk Percentage */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-custom-dark-gray">Breakdown</p>
                    <div className="space-y-3">
                      {/* Safe Percentage */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-custom-charcoal">Safe</span>
                          <span className="text-sm font-bold text-green-600">{safetyScore.score}%</span>
                        </div>
                        <div className="w-full bg-custom-light-gray/20 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-green-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${safetyScore.score}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Risk Percentage */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-custom-charcoal">Risk</span>
                          <span className="text-sm font-bold text-red-600">{100 - safetyScore.score}%</span>
                        </div>
                        <div className="w-full bg-custom-light-gray/20 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-red-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${100 - safetyScore.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {safetyScore.warnings && safetyScore.warnings.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-custom-light-gray/20">
                      <p className="text-sm font-semibold text-custom-charcoal mb-3">⚠️ Warnings</p>
                      <ul className="space-y-2">
                        {safetyScore.warnings.map((warning, idx) => (
                          <li key={idx} className="text-sm text-custom-dark-gray flex gap-2">
                            <span className="flex-shrink-0 text-yellow-600">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients Section */}
              <div className="bg-custom-off-white border border-custom-light-gray/20 rounded-2xl p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-bold text-custom-charcoal">Ingredients</h2>
                  <span className="bg-custom-light-gray/20 text-custom-charcoal text-sm font-semibold px-3 py-1 rounded-full">
                    {product.ingredients.length} items
                  </span>
                </div>

                {/* Ingredients List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {product.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="bg-custom-white border border-custom-light-gray/20 rounded-xl p-4 hover:shadow-md hover:border-custom-light-gray/40 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-custom-dark-gray bg-custom-light-gray/30 px-2 py-1 rounded">
                              #{ing.position}
                            </span>
                            <span className="text-sm lg:text-base font-semibold text-custom-charcoal break-words">{ing.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {/* Category Tag */}
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            ing.categoryType === 'A'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ing.categoryType === 'A' ? 'Potent' : 'Concentration-Dependent'}
                        </span>

                        {/* Reactivity Score */}
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                          Reactivity: {ing.reactivityScore}/5
                        </span>

                        {/* Allergen Badge */}
                        {ing.knownAllergen && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                            🚨 {ing.allergenGroup}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom scrollbar styling */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </div>
    );
}
