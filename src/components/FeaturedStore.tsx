/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { ClockIcon, StarIcon } from "@/components/icons";
import {
  Heart,
  Search,
  ChevronDown,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import type { Business } from "@/hooks/useBusiness";
import ClosedBusinessModal from "./modal/closed-business-modal";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToFavorite } from "@/services/businessService";

interface FeaturedStoreProps {
  activeBusinessType: string;
  selectedSubCategory: string | null;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse">
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

// Custom hook for paginated businesses that preserves cache
const usePaginatedBusinesses = ({
  address,
  localGovernment,
  state,
  businessType,
  productType,
  maxPage,
  limit = 6,
}: {
  address: string | null;
  localGovernment: string | undefined;
  state: string | undefined;
  businessType: string;
  productType: string | null;
  maxPage: number;
  limit?: number;
}) => {
  const [pageData, setPageData] = useState<{
    [page: number]:
      | {
          businesses: Business[];
          total: number;
          page: number;
          limit: number;
        }
      | undefined;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!address || !localGovernment || !state) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const allBusinesses: Business[] = [];
      let currentTotal = 0;

      try {
        for (let page = 1; page <= maxPage; page++) {
          const queryKey = [
            "businesses",
            localGovernment,
            state,
            businessType,
            productType,
            page,
            limit,
          ];

          // Check if data for this page is already available
          if (pageData[page]) {
            allBusinesses.push(...pageData[page]!.businesses);
            currentTotal = pageData[page]!.total;
            continue;
          }

          const normalizedCity = localGovernment
            .replace(/\s+/g, "-")
            .replace(/\//g, "-");
          const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/filter`;
          const params = new URLSearchParams({
            city: encodeURIComponent(normalizedCity),
            state: encodeURIComponent(state),
            page: page.toString(),
            limit: limit.toString(),
          });

          if (businessType) {
            params.set("businessType", businessType);
          }

          if (productType) {
            params.set("productType", productType);
          }

          const url = `${baseUrl}?${params.toString()}`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(
              `Failed to fetch businesses: ${response.statusText}`
            );
          }

          const data = await response.json();
          const fetchedBusinesses = data.businesses.map((business: any) => ({
            id: business.id,
            name: business.name,
            image: business.image || null,
            city: business.city,
            priceRange: business.priceRange || null,
            deliveryTime: business.deliveryTimeRange || "15 - 20 mins",
            rating: Number(business.rating),
            ratingCount: business.ratingCount || business.totalRatings || 0,
            openingTime: business.openingTime,
            closingTime: business.closingTime,
            status: isBusinessOpen(business.openingTime, business.closingTime)
              ? "open"
              : "closed",
            businessType: business.businessType,
            productCategories: business.productCategories || [],
          }));

          const pageResult = {
            businesses: fetchedBusinesses,
            total: data.total || 0,
            page: data.page || page,
            limit: data.limit || limit,
          };

          // Update the pageData state
          setPageData((prevPageData) => ({
            ...prevPageData,
            [page]: pageResult,
          }));

          allBusinesses.push(...fetchedBusinesses);
          currentTotal = data.total || 0;
        }

        // Remove duplicates
        const uniqueBusinesses = allBusinesses.filter(
          (business, index, self) =>
            index === self.findIndex((b) => b.id === business.id)
        );

        setBusinesses(uniqueBusinesses);
        setTotal(currentTotal);
      } catch (err: any) {
        setError(err.message || "Failed to fetch businesses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [
    address,
    localGovernment,
    state,
    businessType,
    productType,
    maxPage,
    limit,
  ]);

  const refetch = () => {
    setPageData({}); // Clear cache
  };

  return {
    data: {
      businesses,
      total,
      page: maxPage,
      limit,
    },
    loading: isLoading,
    error,
    refetch,
  };
};

// Utility function to determine if a business is open
const isBusinessOpen = (openingTime: string, closingTime: string): boolean => {
  const now = new Date();
  const [openHour, openMinute] = openingTime.split(":").map(Number);
  const [closeHour, closeMinute] = closingTime.split(":").map(Number);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  if (closeTimeInMinutes < openTimeInMinutes) {
    return (
      currentTimeInMinutes >= openTimeInMinutes ||
      currentTimeInMinutes < closeTimeInMinutes
    );
  }
  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes
  );
};

export default function FeaturedStore({
  activeBusinessType,
  selectedSubCategory,
}: FeaturedStoreProps) {
  const { address, locationDetails } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPage, setMaxPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 6;

  const { data, loading, error, refetch } = usePaginatedBusinesses({
    address,
    localGovernment: locationDetails?.localGovernment,
    state: locationDetails?.state,
    businessType: activeBusinessType,
    productType: selectedSubCategory,
    maxPage,
    limit,
  });

  const { favorites, handleHeartClick } = useFavorites({
    onSaveToFavorite: saveToFavorite,
  });

  // Reset maxPage when filters change
  useEffect(() => {
    setMaxPage(1);
    setIsLoadingMore(false);
  }, [activeBusinessType, selectedSubCategory]);

  const allBusinesses = data?.businesses || [];
  const filteredBusinesses = searchTerm
    ? allBusinesses.filter((business) =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allBusinesses;

  const hasMore = allBusinesses.length < (data?.total || 0);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setMaxPage((prev) => prev + 1);
      // Reset loading state after a delay
      setTimeout(() => setIsLoadingMore(false), 1000);
    }
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
    setMaxPage(1);
    refetch();
  };

  return (
    <>
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-2">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-6">
              <h2 className="text-xl md:text-2xl font-medium text-[#292d32]">
                Featured Businesses
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

            {/* Search Results Info */}
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

            {/* Loading State for Initial Load */}
            {loading && allBusinesses.length === 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(limit)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && allBusinesses.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center my-8">
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
                <div className="flex flex-col items-center justify-center text-center my-8">
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
                <div className="flex flex-col items-center justify-center text-center my-8">
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
            {filteredBusinesses.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => {
                  const isOpen = business.status === "open";
                  return (
                    <div
                      key={business.id}
                      className="block p-2 rounded-xl bg-white cursor-pointer relative overflow-hidden transition-all hover:shadow-md"
                    >
                      <Link
                        href={`/store/${business.id}`}
                        className="block"
                        onClick={(e) => handleBusinessClick(e, isOpen)}
                      >
                        <div className="hover-container w-full h-[160px] relative bg-no-repeat bg-1/2 bg-cover rounded-xl overflow-hidden shadow-sm animate__animated animate__fadeIn">
                          <Image
                            src={
                              business.image || "/images/store-placeholder.png"
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

            {/* Load More Button */}
            {!loading &&
              !isLoadingMore &&
              filteredBusinesses.length > 0 &&
              hasMore &&
              !searchTerm && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="flex items-center space-x-2 bg-[#1A2E20] hover:bg-[#1A2E20]/90 text-white px-6 py-3 rounded-full transition-colors"
                  >
                    <span>View More Businesses</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}

            {/* Loading More State */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Loading more businesses...</span>
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
