import React from 'react';

function IngredientDetail({ ingredient, onClose }) {
  if (!ingredient) return null;

  const getCategoryColor = (category) => {
    switch(category) {
      case 'SAFE':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'CAUTION':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'HARMFUL':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getReactivityColor = (score) => {
    if (score <= 1) return 'text-green-600';
    if (score <= 2) return 'text-blue-600';
    if (score <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="glass glass-hover rounded-2xl p-8 max-w-2xl mx-auto border border-white/20 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-playfair font-bold text-custom-charcoal mb-3">
            {ingredient.name}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(ingredient.category)}`}>
              {ingredient.category}
            </span>
            {ingredient.isAllergen && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
                ⚠️ Allergen
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-2xl text-custom-dark-gray hover:text-custom-charcoal transition-colors"
        >
          ×
        </button>
      </div>

      {/* Reactivity Score */}
      <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
        <p className="text-sm text-custom-dark-gray mb-2">Reactivity Score</p>
        <p className={`text-2xl font-bold ${getReactivityColor(ingredient.reactivityScore)}`}>
          {ingredient.reactivityScore}/5
        </p>
        <p className="text-xs text-custom-dark-gray mt-1">
          {ingredient.reactivityScore <= 1 ? 'Very Low - Safe' :
           ingredient.reactivityScore <= 2 ? 'Low - Generally Safe' :
           ingredient.reactivityScore <= 3 ? 'Moderate - Use Caution' :
           'High - May Cause Irritation'}
        </p>
      </div>

      {/* Benefits */}
      {ingredient.benefits && ingredient.benefits.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-playfair font-bold text-custom-charcoal mb-3">
            ✨ Benefits
          </h3>
          <ul className="space-y-2">
            {ingredient.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-custom-dark-gray">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skin Type Compatibility */}
      {ingredient.skinTypeInfo && (
        <div className="mb-6">
          <h3 className="text-lg font-playfair font-bold text-custom-charcoal mb-3">
            🧴 Skin Type Compatibility
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(ingredient.skinTypeInfo).map(([skinType, compatible]) => (
              <div
                key={skinType}
                className={`p-3 rounded-lg border transition-all ${
                  compatible
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                }`}
              >
                <p className="font-semibold text-sm capitalize">
                  {skinType === 'combination' ? 'Combo' : skinType}
                </p>
                <p className="text-xs">
                  {compatible ? '✓ Good' : '○ Neutral'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredient Classes */}
      {ingredient.classes && ingredient.classes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-playfair font-bold text-custom-charcoal mb-3">
            🔬 Ingredient Class
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredient.classes.map((cls, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm bg-custom-charcoal/10 text-custom-charcoal border border-custom-charcoal/20"
              >
                {cls}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Allergen Info */}
      {ingredient.allergenGroup && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="font-semibold text-red-900 mb-1">⚠️ Allergen Group</p>
          <p className="text-red-800">{ingredient.allergenGroup}</p>
        </div>
      )}

      {/* Warnings */}
      {ingredient.warnings && ingredient.warnings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-playfair font-bold text-custom-charcoal mb-3">
            ⚠️ Warnings
          </h3>
          <ul className="space-y-2">
            {ingredient.warnings.map((warning, idx) => (
              <li key={idx} className="text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {ingredient.recommendation && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="font-semibold text-blue-900 mb-2">💡 Recommendation</p>
          <p className="text-blue-800">{ingredient.recommendation}</p>
        </div>
      )}

      {/* Product Count */}
      {ingredient.productCount > 0 && (
        <div className="mt-6 pt-6 border-t border-white/20 text-center text-sm text-custom-dark-gray">
          Found in <span className="font-bold text-custom-charcoal">{ingredient.productCount}</span> products
        </div>
      )}
    </div>
  );
}

export default IngredientDetail;
