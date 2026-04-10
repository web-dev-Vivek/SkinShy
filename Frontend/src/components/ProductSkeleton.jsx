import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-custom-white">
      {/* Header */}
      <div className="bg-custom-off-white border-b border-custom-light-gray/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-6 w-32 bg-custom-light-gray/30 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image and Product Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image placeholder */}
            <div className="aspect-square bg-custom-light-gray/20 rounded-2xl animate-pulse"></div>
            
            {/* Product name */}
            <div className="space-y-3">
              <div className="h-8 bg-custom-light-gray/30 rounded animate-pulse"></div>
              <div className="h-5 bg-custom-light-gray/30 rounded w-2/3 animate-pulse"></div>
              <div className="h-7 bg-custom-light-gray/30 rounded w-1/3 animate-pulse"></div>
            </div>

            {/* Button */}
            <div className="h-10 bg-custom-light-gray/30 rounded-lg animate-pulse"></div>
          </div>

          {/* Right: Ingredients and Safety */}
          <div className="lg:col-span-2 space-y-6">
            {/* Safety Score */}
            <div className="bg-custom-off-white border border-custom-light-gray/20 rounded-lg p-6">
              <div className="h-6 w-40 bg-custom-light-gray/30 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-custom-light-gray/30 rounded animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Ingredients List */}
            <div className="bg-custom-off-white border border-custom-light-gray/20 rounded-lg p-6">
              <div className="h-6 w-40 bg-custom-light-gray/30 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border border-custom-light-gray/20 rounded-lg p-4">
                    <div className="h-4 w-3/4 bg-custom-light-gray/30 rounded animate-pulse mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-custom-light-gray/30 rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-custom-light-gray/30 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
