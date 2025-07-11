"use client";

import type { MainCategory } from "@/hooks/useCategories";
// import { useState } from "react";

interface CategoryTabsProps {
  categories: MainCategory[];
  activeTab: string;
  onTabChange: (categoryName: string) => void;
  onPackageModalOpen?: () => void;
}

export function CategoryTabs({
  categories,
  activeTab,
  onTabChange,
  onPackageModalOpen,
}: CategoryTabsProps) {
  const handleTabClick = (categoryName: string) => {
    // Check if it's Send Packages category
    if (
      categoryName.toLowerCase().includes("send packages") ||
      categoryName.toLowerCase().includes("package") ||
      categoryName.toLowerCase().includes("delivery")
    ) {
      // Directly open package modal
      onPackageModalOpen?.();
      return;
    }

    onTabChange(categoryName);
  };

  return (
    <div className="border-b border-gray-300 mb-6 overflow-x-auto">
      <div className="flex space-x-6">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`relative cursor-pointer pb-2 text-gray-600 hover:text-gray-900 transition-all ${
              activeTab === category.name
                ? "text-gray-900 font-semibold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gray-900"
                : ""
            }`}
            onClick={() => handleTabClick(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
