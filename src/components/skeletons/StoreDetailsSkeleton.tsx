// store/[id]/StoreDetailsSkeleton.tsx
import React from "react";

const StoreDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton (based on HeaderStore) */}

      {/* Main Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column (Business Info, Categories, Menu Items) */}
          <div className="w-full lg:w-2/3">
            {/* BusinessInfoSection Skeleton */}
            <div className="mb-6">
              <div className="inline-flex items-center mb-6">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] bg-gray-200 rounded-md mb-4" />
              <div className="py-4">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="flex items-baseline">
                    <div className="h-8 w-48 bg-gray-200 rounded mr-4" />
                    <div className="flex items-center">
                      <div className="h-4 w-8 bg-gray-200 rounded mr-1" />
                      <div className="h-4 w-4 bg-gray-200 rounded mr-1" />
                      <div className="h-4 w-12 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex w-full md:w-52 mt-4 md:mt-0">
                    <div className="h-8 w-24 bg-gray-200 rounded-lg mr-1" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                  </div>
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
            </div>

            {/* CategoriesSection Skeleton */}
            <div className="mb-8">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="flex flex-col gap-4">
                <div className="flex overflow-x-auto pb-2 -mx-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-24 bg-gray-200 rounded-lg mx-1"
                    />
                  ))}
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded mt-2" />
                </div>
              </div>
            </div>

            {/* MenuItemsSection Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-[120px] h-[120px] bg-gray-200 rounded-md" />
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-full bg-gray-200 rounded mb-1" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded mb-3" />
                      <div className="h-5 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (CartSection) */}
          <div className="w-full lg:w-1/3 hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-200 rounded" />
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-10 w-full bg-gray-200 rounded mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsSkeleton;
