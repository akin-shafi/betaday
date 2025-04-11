// skeletons/ProductModalSkeleton.tsx
import React from "react";

const ProductModalSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Search Input */}
      <div className="h-10 w-full bg-gray-200 rounded-lg" />

      {/* Filter Buttons */}
      <div className="flex justify-start gap-2 overflow-x-auto mt-4">
        <div className="h-8 w-32 bg-gray-200 rounded-full" />
        <div className="h-8 w-24 bg-gray-200 rounded-full" />
        <div className="h-8 w-28 bg-gray-200 rounded-full" />
      </div>

      {/* Tooltip/Info Section */}
      <div className="mt-4">
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>

      {/* Product List */}
      <div className="space-y-4 mt-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-200 pb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-28 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-36 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductModalSkeleton;
