// components/store/CategoriesSection.tsx
import { Slider } from "antd";
// import { motion } from "framer-motion";

interface CategoriesSectionProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  categories: string[];
  categoryCounts: { [category: string]: number }; // Added prop for counts
  isLoading?: boolean;
}

export default function CategoriesSection({
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  categories,
  categoryCounts,
  isLoading = false,
}: CategoriesSectionProps) {
  const minPrice = 0;
  const maxPrice = 15000;

  // const getProgressBarPosition = () => {
  //   // Adjust for "all" category if you want to include it in the progress bar
  //   const allCategories = ["all", ...categories];
  //   const index = allCategories.findIndex((cat) => cat === activeCategory);
  //   if (index === -1) return "0%";
  //   return `${(index / (allCategories.length - 1)) * 100}%`;
  // };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="h-5 w-40 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="mt-4 h-1 w-full bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mb-8 text-[#292d32]">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="flex flex-col gap-4">
        <div className="flex overflow-x-auto pb-2 -mx-1 scrollbar-hide">
          {["all", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`min-w-max py-[6px] px-5 mr-4 text-xs rounded-lg uppercase  text-black cursor-pointer 
                ${
                  activeCategory === category
                    ? "bg-[#FF6600] text-white shadow-md font-medium"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200 font-medium"
                }`}
            >
              {category === "all"
                ? `All (${Object.values(categoryCounts).reduce(
                    (a, b) => a + b,
                    0
                  )})`
                : `${category} (${categoryCounts[category] || 0})`}
            </button>
          ))}
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-md font-semibold mb-2 text-[#292d32]">
            Filter by Price (Naira)
          </h3>
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            tooltip={{ formatter: (value) => `₦${value}` }}
            className="w-full"
          />
          <div className="mt-2 text-sm text-gray-600">
            Price Range: ₦{priceRange[0]} - ₦{priceRange[1]}
          </div>
        </div>
      </div>
      {/* <div className="mt-4 h-1 bg-gray-200 rounded-full relative max-w-screen-md mx-auto">
        <motion.div
          className="absolute h-full bg-[#1A2E20] rounded-full"
          initial={false}
          animate={{ width: "20%", left: getProgressBarPosition() }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div> */}
    </div>
  );
}
