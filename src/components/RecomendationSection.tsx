"use client";

import type React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useRecommendations,
  type RecommendedBusiness,
} from "@/hooks/useRecommendations";
import ClosedBusinessModal from "@/components/modal/closed-business-modal";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToFavorite } from "@/services/businessService";
import { formatBusinessHours, getBusinessStatus } from "@/utils/businessHours";

interface RecommendationSectionProps {
  activeBusinessType: string;
  selectedSubCategory: string | null;
}

// Skeleton loader component for business cards
const SkeletonCard = () => (
  <div className="block p-2 rounded-xl bg-white relative overflow-hidden transition-all flex-shrink-0 w-[280px] shadow-sm">
    <div className="w-full h-[160px] rounded-xl bg-gray-200 animate-pulse" />
    <div className="p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-10 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 rounded-full mr-1 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-10 animate-pulse" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mt-2 animate-pulse" />
      <div className="flex flex-wrap gap-3 mt-4">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
      </div>
    </div>
  </div>
);

export default function RecommendationSection({
  activeBusinessType,
  selectedSubCategory,
}: RecommendationSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // Helper function to get business status
  const getBusinessOpenStatus = (business: RecommendedBusiness) => {
    return getBusinessStatus(
      business.openingTime,
      business.closingTime,
      business.businessDays,
      business.isActive
    );
  };

  // Scroll functions for arrow navigation
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
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
              Top Picks for You
            </h2>

            <div className="relative">
              {/* Left Arrow - Hidden on mobile and when loading */}
              {!isLoading && filteredRecommendations.length > 3 && (
                <button
                  onClick={scrollLeft}
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-[#FF6600] transition-colors border border-gray-100"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1"
              >
                {/* Show skeleton loaders when loading */}
                {isLoading ? (
                  // Render 4 skeleton cards while loading
                  Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonCard key={`skeleton-${index}`} />
                  ))
                ) : filteredRecommendations.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 w-full">
                    No recommendations available at the moment
                  </div>
                ) : (
                  // Render actual business cards when data is loaded
                  filteredRecommendations.map((business) => {
                    const businessKey = getBusinessKey(business);
                    const businessStatus = getBusinessOpenStatus(business);
                    const isOpen = businessStatus.isOpen;
                    
                    const formattedHours = formatBusinessHours(
                      business.openingTime,
                      business.closingTime,
                      business.businessDays
                    );

                    return (
                      <div
                        key={businessKey}
                        className="block p-2 rounded-xl bg-white cursor-pointer relative overflow-hidden transition-all hover:shadow-md flex-shrink-0 w-[280px]"
                      >
                        <Link
                          href={`/store/${business.slug}`}
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

                            {/* Business Hours Display */}
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {formattedHours}
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
                  })
                )}
              </div>

              {/* Right Arrow - Hidden on mobile and when loading */}
              {!isLoading && filteredRecommendations.length > 3 && (
                <button
                  onClick={scrollRight}
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-[#FF6600] transition-colors border border-gray-100"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
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
