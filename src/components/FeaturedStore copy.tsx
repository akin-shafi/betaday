/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useRef } from "react";
import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@/components/icons";
import { Heart, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import { useFeaturedBusinesses } from "@/hooks/useFeaturedBusinesses";
import ClosedBusinessModal from "./modal/closed-business-modal";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToFavorite } from "@/services/businessService";

interface FeaturedStoreProps {
  activeBusinessType: string;
  selectedSubCategory: string | null;
}

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-72 bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-32 bg-gray-200" />
    <div className="p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center">
          <div className="h-3 bg-gray-200 rounded w-8" />
        </div>
      </div>
      <div className="flex items-center text-gray-500 text-xs mb-2">
        <div className="h-3 w-3 bg-gray-200 rounded mr-1" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-20" />
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
  }, [businesses]);

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
            {/* Header with Title */}
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
                <div className="flex space-x-3 overflow-hidden">
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
            {!loading && businesses.length > 0 && (
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
                  className="flex space-x-3 overflow-x-auto scrollbar-hide pb-4"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {businesses.map((business) => {
                    const isOpen = business.status === "open";

                    return (
                      <Link
                        href={`/store/${business.slug}`}
                        key={business.id}
                        className="block"
                        onClick={(e) => handleBusinessClick(e, isOpen)}
                      >
                        <div className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 relative">
                          <div className="relative h-32 w-full">
                            <Image
                              src={
                                business.image ||
                                "/placeholder.svg?height=128&width=256&query=restaurant"
                              }
                              alt={business.name}
                              fill
                              className="object-cover"
                            />

                            {/* Dark overlay for closed businesses */}
                            {!isOpen && (
                              <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                            )}

                            {/* Favorite Button - Top Right */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleHeartClick(e, business.id.toString());
                              }}
                              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow"
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

                          <div className="p-3">
                            <h3 className="font-medium text-sm md:text-base line-clamp-1 mb-1">
                              {business.name}
                            </h3>

                            <div className="flex items-center mt-1 text-xs text-gray-500 mb-2">
                              <span className="flex items-center">
                                <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                                {business.rating.toFixed(1)}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{business.deliveryTime}</span>
                            </div>

                            {/* Business Status - Below content */}
                            <div className="mt-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  isOpen
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {isOpen ? "Open" : "Closed"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
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
