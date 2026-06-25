import React from 'react';

export default function GuideSkeleton() {
  return (
    <div className="w-full h-screen flex flex-col p-10 gap-6 animate-pulse">
      <div className="w-80 h-10 bg-gray-300 rounded mx-auto" />
      <div className="grid grid-cols-2 gap-6 flex-1">
        <div className="bg-gray-200 rounded-xl" />
        <div className="bg-gray-200 rounded-xl" />
        <div className="bg-gray-200 rounded-xl" />
        <div className="bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
