import React from 'react';

export default function SafetyScoreSkeleton() {
  return (
    <div className="relative rounded-2xl p-6 lg:p-8 border border-custom-light-gray/20 bg-custom-off-white">
      {/* Blurred Content */}
      <div className="blur-md pointer-events-none select-none">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="text-right">
            <div className="text-4xl lg:text-5xl font-bold">
              <div className="h-12 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-16 mt-2 mx-auto"></div>
          </div>
        </div>

        {/* Main Safety Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 bg-gray-300 rounded w-40"></div>
            <div className="h-4 bg-gray-300 rounded w-12"></div>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4"></div>
        </div>

        {/* Breakdown Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-3 bg-gray-300 rounded w-56"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2"></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-3 bg-gray-300 rounded w-48"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2"></div>
          </div>
        </div>
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/5">
        <div className="text-center">
          <div className="bg-white rounded-lg px-6 py-4 shadow-lg border border-custom-charcoal/20">
            <p className="text-custom-charcoal font-semibold text-sm lg:text-base">
              ✨ Complete Onboarding to Unlock
            </p>
            <p className="text-custom-dark-gray text-xs lg:text-sm mt-1">
              Waiting for onboarding completion
            </p>
          </div>
        </div>
      </div>

      {/* Pulse Animation */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse-subtle"></div>
    </div>
  );
}
