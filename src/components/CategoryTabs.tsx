// components/CategoryTabs.tsx
"use client";

import { MainCategory } from "@/hooks/useCategories";

interface CategoryTabsProps {
  categories: MainCategory[];
  activeTab: string;
  onTabChange: (categoryName: string) => void;
}

export function CategoryTabs({
  categories,
  activeTab,
  onTabChange,
}: CategoryTabsProps) {
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
            onClick={() => onTabChange(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
