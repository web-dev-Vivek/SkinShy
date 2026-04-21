import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-custom-white mt-20 animate-pulse">
      {/* Header */}
      <div className="bg-gray-200 h-32 mb-8"></div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          
          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
