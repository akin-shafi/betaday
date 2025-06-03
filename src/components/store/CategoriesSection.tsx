"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";

interface CategoriesSectionProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
  categoryCounts: { [key: string]: number };
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export default function CategoriesSection({
  activeCategory,
  setActiveCategory,
  categories,
  categoryCounts,
  // isLoading = false,
  onSearch,
  searchQuery = "",
}: CategoriesSectionProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    onSearch?.(query);
  };

  // if (isLoading) {
  //   return (
  //     <div className="w-full px-4 mb-6">
  //       {/* Search Bar Skeleton */}
  //       <div className="relative mb-6">
  //         <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
  //       </div>

  //       {/* Categories Skeleton */}
  //       <div className="flex items-center gap-2 mb-4">
  //         <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
  //         <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
  //       </div>
  //       <div className="flex gap-2 overflow-x-auto pb-2">
  //         {[...Array(4)].map((_, i) => (
  //           <div
  //             key={i}
  //             className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
  //           />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full px-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search in menu..."
          value={localSearchQuery}
          onChange={handleSearchChange}
          className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brandmain focus:border-transparent transition-all"
        />
      </div>

      {/* Categories */}
      {/* <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="h-4 w-4 text-brandmain" />
        <span className="text-sm font-medium text-brandmain">Sections</span>
      </div> */}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-brandmain text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
            {categoryCounts[category] && (
              <span
                className={`ml-2 text-xs ${
                  activeCategory === category
                    ? "text-white/80"
                    : "text-gray-500"
                }`}
              >
                ({categoryCounts[category]})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
