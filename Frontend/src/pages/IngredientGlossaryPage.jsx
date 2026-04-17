import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import OnboardingWarningBanner from '../components/Common/OnboardingWarningBanner';
import IngredientDetail from '../components/IngredientDetail';
import { searchIngredients, getIngredientDetails } from '../services/ingredients';

export default function IngredientGlossaryPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch();
    } else {
      setIngredients([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchIngredients(searchQuery);
      setIngredients(results || []);
      setSelectedIngredient(null);
    } catch (err) {
      console.error('Search failed:', err);
      const errorMsg = err.status === 401 
        ? 'Authentication failed. Please sign in again.'
        : err.message || 'Failed to search ingredients';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientSelect = async (ingredient) => {
    try {
      const details = await getIngredientDetails(ingredient.name);
      setSelectedIngredient(details);
    } catch (err) {
      console.error('Failed to load ingredient details:', err);
      const errorMsg = err.status === 401 
        ? 'Authentication failed. Please sign in again.'
        : err.message || 'Failed to load ingredient details';
      setError(errorMsg);
    }
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
          <p className="text-custom-dark-gray mb-4">Please sign in to access the ingredient glossary</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <OnboardingWarningBanner />
      <div className="min-h-screen bg-gradient-to-b from-[#E9D4BC] to-white pt-24 pb-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="heading-gradient text-4xl md:text-5xl lg:text-6xl mb-4">
              Ingredient Glossary
            </h1>
            <p className="text-lg text-custom-dark-gray max-w-2xl mx-auto">
              Explore and understand every ingredient in skincare products. Learn what each ingredient does, which skin types benefit from it, and any potential warnings.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12 animate-slide-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ingredients... (e.g., retinol, glycerin, hyaluronic acid)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-custom-charcoal/20 bg-white/80 backdrop-blur text-custom-charcoal placeholder:text-custom-dark-gray focus:outline-none focus:border-custom-charcoal transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-custom-dark-gray hover:text-custom-charcoal"
                >
                  ×
                </button>
              )}
            </div>
            <p className="text-sm text-custom-dark-gray mt-3 text-center">
              Start typing to search for ingredients in our database
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-charcoal mx-auto mb-4"></div>
              <p className="text-custom-dark-gray">Searching ingredients...</p>
            </div>
          )}

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Results List */}
            <div className="lg:col-span-1">
              {ingredients.length > 0 && !selectedIngredient && (
                <div className="animate-slide-up">
                  <h2 className="text-xl font-playfair font-bold text-custom-charcoal mb-4">
                    Results ({ingredients.length})
                  </h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {ingredients.map((ing, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleIngredientSelect(ing)}
                        className="glass glass-hover w-full text-left p-4 rounded-lg transition-all hover:bg-white/20 border border-white/20"
                      >
                        <p className="font-semibold text-custom-charcoal text-sm truncate">
                          {ing.name}
                        </p>
                        <p className="text-xs text-custom-dark-gray mt-1">
                          {ing.category}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ingredient Detail */}
            <div className="lg:col-span-2">
              {selectedIngredient ? (
                <div className="animate-slide-up">
                  <IngredientDetail
                    ingredient={selectedIngredient}
                    onClose={() => setSelectedIngredient(null)}
                  />
                </div>
              ) : (
                <>
                  {searchQuery && ingredients.length === 0 && !loading && (
                    <div className="glass rounded-2xl p-12 text-center border border-white/20">
                      <p className="text-lg text-custom-dark-gray mb-2">
                        No ingredients found for "{searchQuery}"
                      </p>
                      <p className="text-sm text-custom-dark-gray">
                        Try searching for common ingredients like: retinol, glycerin, niacinamide, salicylic acid, or vitamin C
                      </p>
                    </div>
                  )}

                  {!searchQuery && (
                    <div className="glass rounded-2xl p-12 text-center border border-white/20">
                      <p className="text-lg text-custom-charcoal font-semibold mb-3">
                        🔍 Start Searching
                      </p>
                      <p className="text-custom-dark-gray mb-6">
                        Search for any skincare ingredient to learn about its benefits, which skin types it's suitable for, and any potential warnings.
                      </p>
                      <div className="space-y-2 text-sm text-custom-dark-gray">
                        <p><strong>Popular searches:</strong></p>
                        <p>• Hyaluronic Acid • Retinol • Niacinamide • Vitamin C • Salicylic Acid</p>
                        <p>• Glycerin • Peptides • AHA • BHA • Squalane</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Tips Section */}
          {!selectedIngredient && !loading && (
            <div className="mt-16 max-w-4xl mx-auto animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6 border border-white/20">
                  <h3 className="font-playfair font-bold text-custom-charcoal mb-3">
                    💡 Pro Tip
                  </h3>
                  <p className="text-sm text-custom-dark-gray">
                    Ingredients at the top of the list (first 5 positions) have more impact on your skin. Pay attention to ingredients that appear early in the list.
                  </p>
                </div>
                <div className="glass rounded-xl p-6 border border-white/20">
                  <h3 className="font-playfair font-bold text-custom-charcoal mb-3">
                    🛡️ Safety First
                  </h3>
                  <p className="text-sm text-custom-dark-gray">
                    Always patch test new ingredients, especially if you have sensitive skin or known allergies. Review warnings carefully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
