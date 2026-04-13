import React from 'react';

/**
 * SafetyBar Component
 * Displays skin safety analysis with mathematical-logical operations
 * 
 * Mathematical Logic:
 * - Safety Score = 100 - total_penalties + bonuses
 * - Risk Level determined by score ranges
 * - Visual representation using bar charts and color coding
 */

export default function SafetyBar({ safetyScore }) {
  if (!safetyScore) {
    return null;
  }

  const {
    score = 0,
    riskLevel = 'unknown',
    penalties = {},
    bonuses = {},
    breakdown = {},
    warnings = [],
    recommendation = ''
  } = safetyScore;

  // Logical operations to determine risk level and color
  const getRiskColor = () => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRiskBgColor = () => {
    if (score >= 85) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    if (score >= 50) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const getRiskTextColor = () => {
    if (score >= 85) return 'text-green-700';
    if (score >= 70) return 'text-yellow-700';
    if (score >= 50) return 'text-orange-700';
    return 'text-red-700';
  };

  const getRiskLabel = () => {
    if (score >= 85) return 'VERY SAFE';
    if (score >= 70) return 'SAFE';
    if (score >= 50) return 'MODERATE RISK';
    if (score >= 30) return 'HIGH RISK';
    return 'DANGER';
  };

  // Calculate penalty and bonus percentages for visual representation
  const totalPenalties = penalties.total || 0;
  const totalBonuses = bonuses.total || 0;

  // Mathematical calculation: breakdown percentages
  const categoryAPenaltyPercent = Math.round((penalties.categoryA || 0) / Math.max(totalPenalties, 1) * 100);
  const allergenPenaltyPercent = Math.round((penalties.allergens || 0) / Math.max(totalPenalties, 1) * 100);
  const skinTypePenaltyPercent = Math.round((penalties.skinTypeMismatch || 0) / Math.max(totalPenalties, 1) * 100);

  // Determine if safe based on mathematical thresholds
  const isSafe = score >= 70;
  const hasWarnings = warnings && warnings.length > 0;

  return (
    <div className={`rounded-2xl p-6 lg:p-8 border border-custom-light-gray/20 ${getRiskBgColor()}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-custom-charcoal mb-2">
            Skin Safety Analysis
          </h2>
          <p className={`text-sm font-semibold ${getRiskTextColor()}`}>
            {getRiskLabel()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl lg:text-5xl font-bold text-custom-charcoal">
            {score}
          </div>
          <p className="text-xs text-custom-dark-gray mt-1">/ 100</p>
        </div>
      </div>

      {/* Main Safety Bar - Mathematical representation */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-custom-charcoal">Overall Safety Score</span>
          <span className={`text-sm font-bold ${getRiskTextColor()}`}>{score}%</span>
        </div>
        <div className="w-full bg-custom-light-gray/30 rounded-full h-4 overflow-hidden">
          <div
            className={`${getRiskColor()} h-full rounded-full transition-all duration-500 ease-out`}
            style={{
              width: `${Math.min(score, 100)}%`,
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
          >
            {/* Animated shimmer effect */}
            <div className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Breakdown of Penalties - Mathematical logical operations */}
      {totalPenalties > 0 && (
        <div className="mb-6 pb-6 border-b border-custom-light-gray/20">
          <p className="text-sm font-semibold text-custom-charcoal mb-3">Risk Factors (-{totalPenalties} points)</p>
          <div className="space-y-2">
            {/* Category A Penalties */}
            {penalties.categoryA > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-custom-dark-gray">High Reactivity Ingredients</span>
                  <span className="font-semibold text-red-600">-{penalties.categoryA} pts</span>
                </div>
                <div className="w-full bg-custom-light-gray/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${categoryAPenaltyPercent}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Allergen Penalties */}
            {penalties.allergens > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-custom-dark-gray">Allergen Triggers</span>
                  <span className="font-semibold text-orange-600">-{penalties.allergens} pts</span>
                </div>
                <div className="w-full bg-custom-light-gray/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{ width: `${allergenPenaltyPercent}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Skin Type Mismatch Penalties */}
            {penalties.skinTypeMismatch > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-custom-dark-gray">Skin Type Incompatibility</span>
                  <span className="font-semibold text-yellow-600">-{penalties.skinTypeMismatch} pts</span>
                </div>
                <div className="w-full bg-custom-light-gray/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full"
                    style={{ width: `${skinTypePenaltyPercent}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bonuses - Beneficial Ingredients */}
      {totalBonuses > 0 && (
        <div className="mb-6 pb-6 border-b border-custom-light-gray/20">
          <p className="text-sm font-semibold text-custom-charcoal mb-3">Beneficial Ingredients (+{totalBonuses} points)</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-custom-dark-gray">Positive ingredients found</span>
            <span className="font-semibold text-green-600">+{totalBonuses} pts</span>
          </div>
          <div className="w-full bg-custom-light-gray/20 rounded-full h-2 overflow-hidden mt-2">
            <div
              className="bg-green-500 h-full rounded-full"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <div className="mb-6 pb-6 border-b border-custom-light-gray/20">
          <p className="text-sm font-semibold text-custom-charcoal mb-3">⚠️ Warnings ({warnings.length})</p>
          <ul className="space-y-2">
            {warnings.map((warning, idx) => (
              <li key={idx} className="text-sm text-custom-dark-gray flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div className={`p-4 rounded-lg ${isSafe ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className={`text-sm font-semibold ${isSafe ? 'text-green-700' : 'text-red-700'}`}>
            {recommendation}
          </p>
        </div>
      )}

      {/* Mathematical Formula Explanation */}
      <div className="mt-6 pt-6 border-t border-custom-light-gray/20">
        <details className="cursor-pointer group">
          <summary className="text-xs font-semibold text-custom-dark-gray hover:text-custom-charcoal transition">
            📊 How is this calculated?
          </summary>
          <div className="mt-3 text-xs text-custom-dark-gray space-y-2 bg-custom-white/50 p-3 rounded">
            <p>
              <span className="font-semibold">Formula:</span> Safety Score = 100 - Total Penalties + Bonuses
            </p>
            <p className="text-xs">
              <span className="font-semibold">Components:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Category A Ingredients: High reactivity penalty</li>
              <li>Allergen Triggers: Your known allergies detected</li>
              <li>Skin Type Match: Compatibility with your skin profile</li>
              <li>Beneficial Ingredients: Positive additions in top 5</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
