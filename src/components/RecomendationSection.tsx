// components/RecomendationSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import ClosedBusinessModal from "@/components/modal/closed-business-modal";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToFavorite } from "@/services/businessService";

interface RecomendationSectionProps {
  activeBusinessType: string;
  selectedSubCategory: string | null;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse flex-shrink-0 w-[280px]">
    <div className="w-full h-40 bg-gray-200" />
    <div className="p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center">
          <div className="h-3 bg-gray-200 rounded w-10" />
        </div>
      </div>
      <div className="flex items-center text-gray-500 text-xs">
        <div className="h-3 w-3 bg-gray-200 rounded mr-1" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        <div className="h-3 bg-gray-200 rounded w-12" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

export default function RecomendationSection({
  activeBusinessType,
  selectedSubCategory,
}: RecomendationSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: recommendations,
    isLoading,
    error,
  } = useRecommendations(activeBusinessType);
  const { favorites, handleHeartClick } = useFavorites({
    onSaveToFavorite: saveToFavorite,
  });

  const filteredRecommendations = selectedSubCategory
    ? recommendations?.filter((business) =>
        business.productCategories.includes(selectedSubCategory)
      ) || []
    : recommendations || [];

  const getBusinessKey = (business: { name: string; businessType: string }) =>
    `${business.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-${business.businessType.toLowerCase()}`;

  const handleBusinessClick = (e: React.MouseEvent, isOpen: boolean) => {
    if (!isOpen) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error.message === "Location not set"
          ? "Please set your location to see recommendations"
          : "Error loading recommendations. Please try again later."}
      </div>
    );
  }

  return (
    <>
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-2">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-medium text-[#292d32] mb-3 md:mb-6">
              Recommended for You
            </h2>

            {isLoading ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
              </div>
            ) : filteredRecommendations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No recommendations available at the moment
              </div>
            ) : (
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {/* {filteredRecommendations.slice(0, 3).map((business) => { */}
                  {filteredRecommendations.map((business) => {
                    const businessKey = getBusinessKey(business);
                    const isOpen = business.status === "open";
                    return (
                      <div
                        key={businessKey}
                        className="block p-2 rounded-xl bg-white cursor-pointer relative overflow-hidden transition-all hover:shadow-md flex-shrink-0 w-[280px]"
                      >
                        <Link
                          href={`/store/${business.id}`}
                          className="block"
                          onClick={(e) => handleBusinessClick(e, isOpen)}
                        >
                          <div className="hover-container w-full h-[160px] relative bg-no-repeat bg-1/2 bg-cover rounded-xl overflow-hidden shadow-sm animate__animated animate__fadeIn">
                            <Image
                              src={
                                business.image ||
                                "/images/store-placeholder.png"
                              }
                              alt={business.name}
                              width={280}
                              height={160}
                              className={`w-full h-40 object-cover ${
                                !isOpen ? "opacity-50" : ""
                              }`}
                            />
                            {!isOpen && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded">
                                  Closed
                                </span>
                              </div>
                            )}
                            <div
                              className={`absolute inset-0 bg-black ${
                                !isOpen ? "opacity-50" : "opacity-0"
                              } overlay transition-opacity duration-300 ease-in-out`}
                            ></div>
                          </div>

                          <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-[#292d32] text-base mb-0 text-truncate hover:underline truncate-text-300">
                                {business.name}
                              </h3>
                              <div className="flex items-center">
                                <span className="text-xs mr-1 text-[#292d32]">
                                  {business.rating}
                                </span>
                                <StarIcon className="text-yellow-400 w-4 h-4" />
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-gray-500 text-xs">
                              <div className="flex items-center">
                                <ClockIcon className="text-[#FF6600] mr-1 w-4 h-4" />
                                {business.deliveryTime}
                              </div>
                              <span
                                className={`text-xs ${
                                  isOpen ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {isOpen ? "Open" : "Closed"}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                              <span className="text-black text-xs px-1 py-0.5 rounded bg-gray-100">
                                {business.businessType}
                              </span>
                              {Array.from(new Set(business.productCategories))
                                .slice(0, 2)
                                .map((category, index) => (
                                  <span
                                    key={index}
                                    className="text-black text-xs px-1 py-0.5 rounded bg-gray-100"
                                  >
                                    {category}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={(e) =>
                            handleHeartClick(e, business.id.toString())
                          }
                          className="flex items-center justify-center rounded-full cursor-pointer absolute right-[21px] top-[12px] bg-brand-white w-[40px] h-[40px] active:opacity-70"
                          disabled={!isOpen}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.has(business.id.toString())
                                ? "text-red-500 fill-current"
                                : "text-gray-400 hover:text-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <ClosedBusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
