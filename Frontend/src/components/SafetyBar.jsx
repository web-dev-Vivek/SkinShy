import React from 'react';

/**
 * SafetyBar Component - Simplified Version
 * Displays skin safety score and suitability remark
 */

export default function SafetyBar({ safetyScore }) {
  if (!safetyScore) {
    return null;
  }

  const {
    score = 0,
    riskLevel = 'unknown',
    recommendation = ''
  } = safetyScore;

  // Determine color based on score
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

  const getSuitabilityText = () => {
    if (score >= 85) return '✓ Suitable - Very Safe';
    if (score >= 70) return '✓ Suitable - Safe';
    if (score >= 50) return '⚠ Moderate Risk - Use with caution';
    return '✗ Not Suitable - High Risk';
  };

  const isSafe = score >= 70;

  return (
    <div className={`rounded-2xl p-6 lg:p-8 border border-custom-light-gray/20 ${getRiskBgColor()}`}>
      {/* Header with Score */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-playfair font-bold text-custom-charcoal">
            Safety Score
          </h2>
        </div>
         {/* Large Number - Fixed vertical alignment */}
         <div className="flex items-center gap-1">
           <div className="text-5xl lg:text-6xl font-mono font-black text-custom-charcoal leading-tight">
             {score}
           </div>
           <div className="flex flex-col justify-end pb-1">
             <p className="text-xs font-playfair text-custom-dark-gray">/ 100</p>
           </div>
         </div>
      </div>

      {/* Safety Score Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-playfair font-semibold text-custom-charcoal">Safety Score</span>
          <span className={`text-sm font-playfair font-bold ${getRiskTextColor()}`}>{score}%</span>
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

      {/* Suitability Remark */}
      <div className={`p-4 rounded-lg ${isSafe ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className={`text-sm font-playfair font-semibold flex items-center gap-2 ${isSafe ? 'text-green-700' : 'text-red-700'}`}>
          {getSuitabilityText()}
        </p>
      </div>

      {/* Recommendation if available */}
      {recommendation && (
        <div className="mt-4 p-4 bg-custom-light-gray/20 rounded-lg">
          <p className="text-sm font-playfair text-custom-dark-gray">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
