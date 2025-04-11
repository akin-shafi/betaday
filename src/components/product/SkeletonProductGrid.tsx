import React from "react";

export const SkeletonProductGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-200 rounded-lg p-4 shadow-md"
        >
          <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-400 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};
