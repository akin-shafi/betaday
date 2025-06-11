/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useRef } from "react";
import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import { useFeaturedBusinesses } from "@/hooks/useFeaturedBusinesses";
import ClosedBusinessModal from "./modal/closed-business-modal";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToFavorite } from "@/services/businessService";
import { formatBusinessHours, getBusinessStatus } from "@/utils/businessHours";

interface FeaturedStoreProps {
  activeBusinessType: string;
  selectedSubCategory: string | null;
}

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-72 bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse">
    <div className="w-full h-40 bg-gray-100" />
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

export default function FeaturedStore({
  activeBusinessType,
  selectedSubCategory,
}: FeaturedStoreProps) {
  const { locationDetails } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use the featured businesses hook with higher limit for horizontal scroll
  const { businesses, total, loading, error, hasData, isEmpty } =
    useFeaturedBusinesses({
      city: locationDetails?.localGovernment || "",
      state: locationDetails?.state || "",
      businessType:
        activeBusinessType !== "All" ? activeBusinessType : undefined,
      limit: 20, // Higher limit for horizontal scroll
      page: 1, // Always page 1 for horizontal scroll
      enabled: Boolean(
        locationDetails?.state && locationDetails?.localGovernment
      ),
    });

  const { favorites, handleHeartClick } = useFavorites({
    onSaveToFavorite: saveToFavorite,
  });

  // Filter businesses based on search term
  const filteredBusinesses = businesses;

  // Check scroll position and update arrow states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Handle scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      // Check initial state
      checkScrollPosition();

      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, [filteredBusinesses]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const handleBusinessClick = (e: React.MouseEvent, isOpen: boolean) => {
    if (!isOpen) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleRefresh = () => {
    // The hook will automatically refetch when dependencies change
  };

  return (
    <>
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-2">
          <div className="max-w-6xl mx-auto">
            {/* Header with Title and Search */}
            <div className="flex items-center mb-3 md:mb-6">
              <h2 className="text-xl md:text-2xl font-medium text-[#292d32]">
                Featured Businesses
                {total > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({total} available)
                  </span>
                )}
              </h2>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="relative">
                <div className="flex space-x-4 overflow-hidden">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && businesses.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/icons/empty_box.png"
                    alt="No businesses"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Error loading businesses
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {error || "Please try again or set your location manually."}
                </p>
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 bg-[#1A2E20] hover:bg-[#1A2E20]/90 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && isEmpty && (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/icons/empty_box.png"
                    alt="No businesses"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-md text-black mb-2">
                  No featured businesses found for this location or category
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Click the address field above to enter new location
                </p>
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 bg-[#1A2E20] hover:bg-[#1A2E20]/90 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Data</span>
                </button>
              </div>
            )}

            {/* Horizontal Scroll Container with Navigation */}
            {!loading && filteredBusinesses.length > 0 && (
              <div className="relative">
                {/* Left Arrow */}
                {canScrollLeft && (
                  <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                )}

                {/* Right Arrow */}
                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                )}

                {/* Scrollable Business Container */}
                <div
                  ref={scrollContainerRef}
                  className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {filteredBusinesses.map((business) => {
                    const isOpen = business.status === "open";

                    const formattedHours = formatBusinessHours(
                      business.openingTime,
                      business.closingTime,
                      business.businessDays
                    );

                    return (
                      <div
                        key={business.id}
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
                            <div className="text-xs text-gray-500 mb-3 truncate">
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
                      // <div
                      //   key={business.id}
                      //   className="flex-shrink-0 w-72 bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200 relative"
                      // >
                      //   <Link
                      //     href={`/store/${business.slug}`}
                      //     className="block"
                      //     onClick={(e) => handleBusinessClick(e, isOpen)}
                      //   >
                      //     <div className="relative h-40 w-full">
                      //       <Image
                      //         src={
                      //           business.image ||
                      //           "/images/store-placeholder.png" ||
                      //           "/placeholder.svg"
                      //         }
                      //         alt={business.name}
                      //         fill
                      //         className={`object-cover ${
                      //           !isOpen ? "opacity-50" : ""
                      //         }`}
                      //       />
                      //       {!isOpen && (
                      //         <div className="absolute inset-0 flex items-center justify-center">
                      //           <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded">
                      //             Closed
                      //           </span>
                      //         </div>
                      //       )}
                      //       <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
                      //         {isOpen ? (
                      //           <span className="text-green-600">Open</span>
                      //         ) : (
                      //           <span className="text-red-500">Closed</span>
                      //         )}
                      //       </div>
                      //     </div>

                      //     <div className="p-3">
                      //       <div className="flex items-center justify-between mb-1">
                      //         <h3 className="font-medium text-[#292d32] text-base truncate pr-2">
                      //           {business.name}
                      //         </h3>
                      //         <div className="flex items-center flex-shrink-0">
                      //           <span className="text-xs mr-1 text-[#292d32]">
                      //             {business.rating.toFixed(1)}
                      //           </span>
                      //           <StarIcon className="text-yellow-400 w-4 h-4" />
                      //         </div>
                      //       </div>

                      //       <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                      //         <div className="flex items-center">
                      //           <ClockIcon className="text-[#FF6600] mr-1 w-4 h-4" />
                      //           <span>{business.deliveryTime}</span>
                      //         </div>
                      //       </div>

                      //       {/* Business Hours Display */}
                      //       <div className="text-xs text-gray-500 mb-3 truncate">
                      //         {business.openingTime} - {business.closingTime}
                      //         {business.businessDays &&
                      //           ` • ${business.businessDays}`}
                      //       </div>

                      //       <div className="flex flex-wrap gap-2">
                      //         <span className="text-black text-xs px-2 py-1 rounded bg-gray-100">
                      //           {business.businessType}
                      //         </span>
                      //         {business.productCategories
                      //           ?.slice(0, 2)
                      //           .map((category: string, index: number) => (
                      //             <span
                      //               key={index}
                      //               className="text-black text-xs px-2 py-1 rounded bg-gray-100"
                      //             >
                      //               {category}
                      //             </span>
                      //           ))}
                      //       </div>
                      //     </div>
                      //   </Link>

                      //   {/* Favorite Button */}
                      //   <button
                      //     onClick={(e) =>
                      //       handleHeartClick(e, business.id.toString())
                      //     }
                      //     className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow"
                      //     disabled={!isOpen}
                      //   >
                      //     <Heart
                      //       className={`h-4 w-4 ${
                      //         favorites.has(business.id.toString())
                      //           ? "text-red-500 fill-current"
                      //           : "text-gray-400 hover:text-gray-500"
                      //       }`}
                      //     />
                      //   </button>
                      // </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom scrollbar hiding styles */}
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
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
