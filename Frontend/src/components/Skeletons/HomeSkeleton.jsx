import React from 'react';

export default function HomeSkeleton() {
  return (
   <div className="w-screen h-screen flex flex-col md:flex-row p-4 md:p-10 gap-6">

      {/* LEFT */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">

        <div className="w-24 h-4 bg-gray-200 rounded" />
        <div className="w-3/4 h-10 bg-gray-300 rounded" />
        <div className="w-2/3 h-6 bg-gray-200 rounded" />

        <div className="w-32 h-10 bg-gray-300 rounded mt-4" />
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full h-[250px] sm:h-[350px] md:h-[420px] bg-gray-200 rounded-xl" />
      </div>

    </div>
  );
}
