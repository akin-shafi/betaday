/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart, Search, Loader2, X, RefreshCw } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import ClosedBusinessModal from "./modal/closed-business-modal";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToFavorite } from "@/services/businessService";
import { useBusiness, type Business } from "@/hooks/useBusiness";
import { formatBusinessHours, getBusinessStatus } from "@/utils/businessHours";

interface AllBusinessProps {
  activeBusinessType: string;
  selectedSubCategory: string | null;
}

export default function AllBusiness({
  activeBusinessType,
  selectedSubCategory,
}: AllBusinessProps) {
  const { address, locationDetails } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(5); // Initial 5 items

  const { data, loading, error, refetch } = useBusiness({
    address,
    localGovernment: locationDetails?.localGovernment,
    state: locationDetails?.state,
    businessType: activeBusinessType,
    productType: selectedSubCategory,
  });

  const { favorites, handleHeartClick } = useFavorites({
    onSaveToFavorite: saveToFavorite,
  });

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(5);
  }, [activeBusinessType, selectedSubCategory]);

  const allBusinesses: Business[] = data?.businesses || [];
  const filteredBusinesses = searchTerm
    ? allBusinesses.filter((business) =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allBusinesses;

  const visibleBusinesses = filteredBusinesses.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBusinesses.length;

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 5); // Show 5 more items
  };

  const handleBusinessClick = (e: React.MouseEvent, isOpen: boolean) => {
    if (!isOpen) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    setVisibleCount(5);
    refetch();
  };

  // Helper function to get business status
  const getBusinessOpenStatus = (business: Business) => {
    return getBusinessStatus(
      business.openingTime,
      business.closingTime,
      business.businessDays,
      business.isActive
    );
  };

  return (
    <>
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-2">
          <div className="max-w-6xl mx-auto">
            {/* Header with Title and Search - Always Visible */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-6">
              <h2 className="text-xl md:text-2xl font-medium text-[#292d32]">
                All Businesses
                {data?.total > 0 && !searchTerm && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({data.total} available)
                  </span>
                )}
              </h2>
              <div className="mt-3 md:mt-0 md:max-w-xs w-full relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF6600] w-5 h-5"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search stores by name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-base md:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] placeholder-gray-400"
                  aria-label="Search stores by name"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results Info - Always Visible */}
            {searchTerm && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  {filteredBusinesses.length > 0
                    ? `Found ${filteredBusinesses.length} business${
                        filteredBusinesses.length !== 1 ? "es" : ""
                      } matching "${searchTerm}"`
                    : `No businesses found matching "${searchTerm}"`}
                </p>
              </div>
            )}

            {/* Scrollable Container for Business Content - No Fixed Height */}
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
              {/* Error State */}
              {error && !loading && allBusinesses.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-8">
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
                    {error === "Waiting for location data..."
                      ? "Fetching your location..."
                      : "Error loading businesses"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {error === "Waiting for location data..."
                      ? "Please wait while we get your location."
                      : "Please try again or set your location manually."}
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
              {!loading &&
                !error &&
                filteredBusinesses.length === 0 &&
                allBusinesses.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-8">
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
                      No businesses found for this location or category
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

              {/* Search Empty State */}
              {!loading &&
                !error &&
                searchTerm &&
                filteredBusinesses.length === 0 &&
                allBusinesses.length > 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-md text-black mb-2">
                      No businesses found for "{searchTerm}"
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Try a different search term or clear the search to see all
                      businesses.
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-[#FF6600] hover:text-[#FF6600]/80 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                )}

              {/* Business Grid */}
              {!loading && visibleBusinesses.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                  {visibleBusinesses.map((business) => {
                    const businessStatus = getBusinessOpenStatus(business);
                    const isOpen = businessStatus.isOpen;
                    const formattedHours = formatBusinessHours(
                      business.openingTime,
                      business.closingTime,
                      business.businessDays
                    );

                    return (
                      <div
                        key={business.id}
                        className="block p-2 rounded-xl bg-white cursor-pointer relative overflow-hidden transition-all hover:shadow-md"
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
                              {business.productCategories.map(
                                (category: string, index: number) => (
                                  <span
                                    key={index}
                                    className="text-black text-xs px-1 py-0.5 rounded bg-gray-100"
                                  >
                                    {category}
                                  </span>
                                )
                              )}
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
              )}

              {/* View More Button - Fixed at Bottom */}
              {hasMore && !loading && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleViewMore}
                    className="flex items-center space-x-2 bg-[#1A2E20] hover:bg-[#1A2E20]/90 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <span>View More</span>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </button>
                </div>
              )}
            </div>

            {/* Add global style for hidden scrollbar (optional) */}
            <style jsx global>{`
              /* Hide scrollbar for Chrome, Safari and Opera */
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }

              /* Hide scrollbar for IE, Edge and Firefox */
              .hide-scrollbar {
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
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
