import React from 'react';

export default function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="border border-custom-light-gray/20 rounded-lg p-4 animate-pulse">
          {/* Product Name */}
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>

          {/* Product Type */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

          {/* Product Price */}
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
}
