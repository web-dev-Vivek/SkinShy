import React from 'react';

export default function SafetyScoreComparisonSkeleton() {
  return (
    <div className="relative">
      {/* Blurred Content */}
      <div className="blur-md pointer-events-none select-none">
        <div className="flex justify-between items-center text-sm">
          <span className="text-custom-dark-gray">Safety Score:</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-300 rounded-full h-2"></div>
            <div className="h-4 bg-gray-300 rounded w-12"></div>
          </div>
        </div>
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-white/80 rounded px-3 py-1.5 backdrop-blur-sm border border-custom-charcoal/10">
          <p className="text-custom-charcoal font-semibold text-xs">
            Complete Onboarding
          </p>
        </div>
      </div>

      {/* Pulse Animation */}
      <style>{`
        @keyframes pulse-subtle-compare {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-subtle-compare {
          animation: pulse-subtle-compare 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-subtle-compare"></div>
    </div>
  );
}
