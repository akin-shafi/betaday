// components/CategoriesInStore.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useCategories } from "@/hooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/hooks/useProducts";
import { CategoryTabs } from "./CategoryTabs";
import { useAddress } from "@/contexts/address-context";
import { useBusiness } from "@/hooks/useBusiness";
import { AnimatePresence } from "framer-motion";
import { ProductModal } from "@/components/modal/ProductModal";

const SkeletonCategoryCard = () => (
  <div className="p-3 rounded-lg flex flex-col items-center animate-pulse bg-gray-100 w-32 h-28 flex-shrink-0">
    <div className="w-12 h-12 mb-2 bg-gray-200 rounded-full" />
    <div className="h-3 bg-gray-200 rounded w-20" />
  </div>
);

export default function CategoriesInStore() {
  const { data: categories, isLoading, error } = useCategories();
  const { locationDetails, address } = useAddress();
  const [activeTab, setActiveTab] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { businesses } = useBusiness({
    address: address || "",
    localGovernment: locationDetails?.localGovernment,
    state: locationDetails?.state,
    businessType: activeTab || "Restaurants",
  });

  useEffect(() => {
    if (!categories || mounted) return;
    setMounted(true);
    const initialTab = categories[0]?.name || "Restaurants";
    setActiveTab(initialTab);
  }, [categories, mounted]);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: [
      "products",
      selectedCategory,
      locationDetails?.state,
      locationDetails?.localGovernment,
    ],
    queryFn: () =>
      fetchProducts({
        page: 1,
        limit: 10,
        state: locationDetails?.state,
        city: locationDetails?.localGovernment,
        category: selectedCategory || "",
        searchTerm: "",
      }),
    enabled: isModalOpen && !!selectedCategory,
  });

  const products = productsData?.products || [];

  const handleTabChange = (categoryName: string) => {
    setActiveTab(categoryName);
  };

  const handleSubCategoryClick = (subCategoryName: string) => {
    setSelectedCategory(subCategoryName);
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading categories. Please try again later.
      </div>
    );
  }

  const activeCategory = categories?.find((cat) => cat.name === activeTab);

  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-1">
        <div className="max-w-6xl mx-auto">
          {mounted && !isLoading && categories && (
            <CategoryTabs
              categories={categories}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          )}
          <div className="flex flex-row items-center space-x-4 mb-6">
            <h2 className="text-xl md:text-2xl font-medium text-[#292d32] flex items-center">
              <Image
                src="/best-deal.png"
                alt="Best Deal"
                width={50}
                height={50}
                className="md:w-24"
              />
            </h2>
            <div className="text-gray-500 pr-2 py-2 text-sm font-medium">
              Click a treat below to get the best deal
            </div>
          </div>

          <div className="md:hidden mx-1">
            <Swiper slidesPerView={2.5} spaceBetween={12} className="px-4">
              {mounted && !isLoading && activeCategory
                ? activeCategory.subcategories.map((subcategory, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="p-2 rounded-lg cursor-pointer flex flex-col items-center justify-center w-24 h-24 bg-gray-100 hover:bg-blue-100"
                        onClick={() => handleSubCategoryClick(subcategory.name)}
                      >
                        <Image
                          src={subcategory.image || "/placeholder.svg"}
                          alt={subcategory.name}
                          width={32}
                          height={32}
                          className="w-10 h-10 mb-1"
                        />
                        <span className="text-gray-800 font-medium text-xs text-center">
                          {subcategory.name}
                        </span>
                      </div>
                    </SwiperSlide>
                  ))
                : Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <SwiperSlide key={index}>
                        <SkeletonCategoryCard />
                      </SwiperSlide>
                    ))}
            </Swiper>
          </div>

          <div className="hidden md:block mx-2">
            <Swiper slidesPerView={7.5} spaceBetween={16} className="px-4">
              {mounted && !isLoading && activeCategory
                ? activeCategory.subcategories.map((subcategory, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="p-2 rounded-lg cursor-pointer flex flex-col items-center justify-center w-28 h-28 bg-gray-100 hover:bg-blue-100"
                        onClick={() => handleSubCategoryClick(subcategory.name)}
                      >
                        <Image
                          src={subcategory.image || "/placeholder.svg"}
                          alt={subcategory.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 mb-2"
                        />
                        <span className="text-gray-800 font-medium text-sm text-center">
                          {subcategory.name}
                        </span>
                      </div>
                    </SwiperSlide>
                  ))
                : Array(7)
                    .fill(0)
                    .map((_, index) => (
                      <SwiperSlide key={index}>
                        <SkeletonCategoryCard />
                      </SwiperSlide>
                    ))}
            </Swiper>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          products={products}
          selectedCategory={selectedCategory}
          productsLoading={productsLoading}
          locationDetails={locationDetails}
          businesses={businesses}
        />
      </AnimatePresence>
    </section>
  );
}
