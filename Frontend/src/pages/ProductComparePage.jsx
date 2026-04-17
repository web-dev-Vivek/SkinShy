import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import OnboardingWarningBanner from '../components/Common/OnboardingWarningBanner';
import { getProductById } from '../services/products';
import { api } from '../services/api';

export default function ProductComparePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products
  useEffect(() => {
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
        setError('Failed to load products');
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

  // Load product details when selected
  const handleProductSelect = async (product) => {
    if (selectedProducts.find(p => p._id === product._id)) {
      // Deselect if already selected
      setSelectedProducts(selectedProducts.filter(p => p._id !== product._id));
      const newDetails = { ...productDetails };
      delete newDetails[product._id];
      setProductDetails(newDetails);
    } else if (selectedProducts.length < 3) {
      // Add to comparison if less than 3 selected
      setLoadingDetails(true);
      try {
        const details = await getProductById(product._id);
        setSelectedProducts([...selectedProducts, product]);
        setProductDetails({
          ...productDetails,
          [product._id]: details
        });
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Failed to load product details');
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  // Check if product is selected
  const isProductSelected = (productId) => {
    return selectedProducts.some(p => p._id === productId);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-custom-white mt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-charcoal mx-auto mb-4"></div>
          <p className="text-custom-dark-gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-custom-white mt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-custom-dark-gray mb-4">Please sign in to compare products</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <OnboardingWarningBanner />
      <div className="min-h-screen bg-gradient-to-b from-[#E9D4BC] to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-gradient text-4xl md:text-5xl lg:text-6xl mb-4">
              Compare Products
            </h1>
            <p className="text-lg text-custom-dark-gray max-w-2xl mx-auto">
              Select up to 3 products to compare side-by-side. View ingredients, safety scores, and allergen warnings.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-7xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Side: Product Selection */}
            <div className="lg:col-span-1">
              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-custom-charcoal/20 bg-white/80 backdrop-blur text-custom-charcoal placeholder:text-custom-dark-gray focus:outline-none focus:border-custom-charcoal transition-all"
                />
              </div>

              {/* Selected Count */}
              <div className="glass rounded-lg p-4 mb-6 border border-white/20">
                <p className="text-sm text-custom-dark-gray font-semibold">
                  Selected: <span className="text-custom-charcoal">{selectedProducts.length}/3</span>
                </p>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-custom-charcoal mx-auto mb-2"></div>
                  <p className="text-sm text-custom-dark-gray">Loading products...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                  {filteredProducts.map(product => (
                    <button
                      key={product._id}
                      onClick={() => handleProductSelect(product)}
                      disabled={loadingDetails}
                      className={`w-full text-left p-3 rounded-lg transition-all border-2 ${
                        isProductSelected(product._id)
                          ? 'glass border-custom-charcoal bg-white/30 shadow-lg'
                          : 'glass border-white/20 hover:border-custom-charcoal/50 hover:bg-white/20'
                      } ${selectedProducts.length === 3 && !isProductSelected(product._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <p className="font-semibold text-sm text-custom-charcoal truncate">
                        {product.productName}
                      </p>
                      <p className="text-xs text-custom-dark-gray mt-1">
                        {product.productType}
                      </p>
                      <p className="text-sm font-bold text-custom-charcoal mt-1">
                        {product.price}
                      </p>
                      {isProductSelected(product._id) && (
                        <div className="mt-2 text-xs bg-custom-charcoal text-white px-2 py-1 rounded w-fit">
                          ✓ Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Comparison View */}
            <div className="lg:col-span-3">
              {selectedProducts.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center border border-white/20 h-full flex items-center justify-center">
                  <div>
                    <p className="text-lg text-custom-charcoal font-semibold mb-2">
                      No Products Selected
                    </p>
                    <p className="text-custom-dark-gray">
                      Select products from the list to compare them side-by-side
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProducts.map(product => {
                    const details = productDetails[product._id];
                    return (
                      <div
                        key={product._id}
                        className="glass rounded-xl border border-white/20 overflow-hidden"
                      >
                        {/* Product Header */}
                        <div className="bg-white/20 backdrop-blur-sm p-4 border-b border-white/20">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-bold text-custom-charcoal line-clamp-2">
                                {product.productName}
                              </h3>
                              <p className="text-xs text-custom-dark-gray mt-1">
                                {product.productType}
                              </p>
                            </div>
                            <button
                              onClick={() => handleProductSelect(product)}
                              className="text-xl hover:scale-110 transition-transform"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Product Content */}
                        <div className="p-4 space-y-4">
                          {/* Price and Safety Score */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-custom-dark-gray">Price:</span>
                              <span className="font-bold text-custom-charcoal">{product.price}</span>
                            </div>
                            {details?.safetyScore && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-custom-dark-gray">Safety Score:</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        details.safetyScore.score >= 75
                                          ? 'bg-green-500'
                                          : details.safetyScore.score >= 50
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                      }`}
                                      style={{
                                        width: `${details.safetyScore.score}%`
                                      }}
                                    ></div>
                                  </div>
                                  <span className="font-bold text-custom-charcoal">
                                    {Math.round(details.safetyScore.score)}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Ingredients */}
                          <div className="border-t border-white/20 pt-4">
                            <h4 className="text-sm font-bold text-custom-charcoal mb-3">
                              Ingredients ({details?.ingredients?.length || 0})
                            </h4>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                              {details?.ingredients && details.ingredients.length > 0 ? (
                                details.ingredients.map((ing, idx) => (
                                  <div key={idx} className="text-xs">
                                    <div className="flex items-start gap-2">
                                      <span className="text-custom-dark-gray min-w-fit">
                                        {idx + 1}.
                                      </span>
                                      <div>
                                        <p className="font-semibold text-custom-charcoal">
                                          {ing.name}
                                        </p>
                                        <p className="text-custom-dark-gray text-[11px]">
                                          {ing.ingredientClass}
                                        </p>
                                        {ing.knownAllergen && (
                                          <p className="text-red-600 font-bold text-[11px] mt-1">
                                            ⚠️ Known Allergen
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-custom-dark-gray text-xs">
                                  No ingredients available
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Allergens Summary */}
                          {details?.ingredients && (
                            <div className="border-t border-white/20 pt-4">
                              <h4 className="text-sm font-bold text-custom-charcoal mb-2">
                                Allergen Warnings
                              </h4>
                              {(() => {
                                const allergens = details.ingredients.filter(ing => ing.knownAllergen);
                                return allergens.length > 0 ? (
                                  <div className="space-y-1">
                                    {allergens.map((ing, idx) => (
                                      <p key={idx} className="text-xs text-red-600 font-semibold">
                                        • {ing.allergenGroup || ing.name}
                                      </p>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-green-600 font-semibold">
                                    ✓ No known allergens
                                  </p>
                                );
                              })()}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="border-t border-white/20 pt-4 space-y-2">
                            <a
                              href={`/search/${product._id}`}
                              className="block text-center text-sm font-semibold text-custom-charcoal hover:text-custom-black transition-colors py-2 px-3 rounded-lg bg-white/20 hover:bg-white/30"
                            >
                              View Details
                            </a>
                            <button
                              onClick={() => handleProductSelect(product)}
                              className="w-full text-sm font-semibold text-red-600 hover:text-red-700 transition-colors py-2 px-3 rounded-lg bg-white/20 hover:bg-white/30"
                            >
                              Remove from Comparison
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
