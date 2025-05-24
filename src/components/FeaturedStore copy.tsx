/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClockIcon, StarIcon } from "@/components/icons"
import { Heart, Search, ChevronDown, Loader2, X, RefreshCw } from "lucide-react"
import { useAddress } from "@/contexts/address-context"
import { useBusiness, type Business } from "@/hooks/useBusiness"
import ClosedBusinessModal from "./modal/closed-business-modal"
import { useFavorites } from "@/hooks/useFavorites"
import { saveToFavorite } from "@/services/businessService"

interface FeaturedStoreProps {
  activeBusinessType: string
  selectedSubCategory: string | null
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
)

export default function FeaturedStore({ activeBusinessType, selectedSubCategory }: FeaturedStoreProps) {
  const { address, locationDetails } = useAddress()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const pathname = usePathname()
  const limit = 6

  const { data, loading, error, refetch, isRefetching } = useBusiness({
    address,
    localGovernment: locationDetails?.localGovernment,
    state: locationDetails?.state,
    businessType: activeBusinessType,
    productType: selectedSubCategory,
    page,
    limit,
  })

  const { favorites, handleHeartClick } = useFavorites({
    onSaveToFavorite: saveToFavorite,
  })

  // Debug logging
  useEffect(() => {
    console.log("FeaturedStore Debug:", {
      data,
      loading,
      error,
      allBusinesses: allBusinesses.length,
      activeBusinessType,
      selectedSubCategory,
      locationDetails,
    })
  }, [data, loading, error, allBusinesses, activeBusinessType, selectedSubCategory, locationDetails])

  // Handle initial data and subsequent page loads
  useEffect(() => {
    console.log("Data effect triggered:", { data, page })

    if (data?.businesses && Array.isArray(data.businesses)) {
      console.log("Processing businesses:", data.businesses.length)

      if (page === 1) {
        // First page - replace all businesses
        console.log("Setting initial businesses:", data.businesses)
        setAllBusinesses(data.businesses)
      } else {
        // Subsequent pages - append new businesses
        setAllBusinesses((prev) => {
          const newBusinesses = data.businesses.filter((newBiz) => !prev.some((biz) => biz.id === newBiz.id))
          console.log("Appending new businesses:", newBusinesses.length)
          return [...prev, ...newBusinesses]
        })
      }
      setTotalCount(data.total || 0)
      setIsLoadingMore(false)
    }
  }, [data, page])

  // Reset when filters change
  useEffect(() => {
    console.log("Resetting due to filter change:", { activeBusinessType, selectedSubCategory })
    setAllBusinesses([])
    setPage(1)
    setTotalCount(0)
  }, [activeBusinessType, selectedSubCategory])

  const filteredBusinesses = searchTerm
    ? allBusinesses.filter((business) => business.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allBusinesses

  const hasMore = allBusinesses.length < totalCount
  const showingCount = filteredBusinesses.length
  const remainingCount = totalCount - allBusinesses.length

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true)
      setPage((prev) => prev + 1)
    }
  }

  const handleBusinessClick = (e: React.MouseEvent, isOpen: boolean) => {
    if (!isOpen) {
      e.preventDefault()
      setIsModalOpen(true)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleRefresh = () => {
    console.log("Manual refresh triggered")
    setAllBusinesses([])
    setPage(1)
    setTotalCount(0)
    refetch()
  }

  const renderLoadMoreSection = () => {
    if (searchTerm) return null // Don't show load more when searching

    if (isLoadingMore) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading more businesses...</span>
          </div>
        </div>
      )
    }

    if (hasMore) {
      return (
        <div className="flex flex-col items-center py-8 space-y-3">
          <p className="text-sm text-gray-500">
            Showing {showingCount} of {totalCount} businesses
            {remainingCount > 0 && ` • ${remainingCount} more available`}
          </p>
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center space-x-2 bg-[#1A2E20] hover:bg-[#1A2E20]/90 text-white px-6 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>View More Businesses</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )
    }

    if (allBusinesses.length > 0) {
      return (
        <div className="flex justify-center py-6">
          <p className="text-sm text-gray-500">You've seen all {totalCount} businesses in this category</p>
        </div>
      )
    }

    return null
  }

  // Debug render conditions
  console.log("Render conditions:", {
    loading,
    error,
    allBusinessesLength: allBusinesses.length,
    filteredBusinessesLength: filteredBusinesses.length,
    isRefetching,
  })

  return (
    <>
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-2">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-6">
              <h2 className="text-xl md:text-2xl font-medium text-[#292d32]">
                Featured Businesses
                {totalCount > 0 && !searchTerm && (
                  <span className="text-sm font-normal text-gray-500 ml-2">({totalCount} available)</span>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] placeholder-gray-400"
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

            {/* Debug Info - Remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-xs">
                <p>
                  <strong>Debug Info:</strong>
                </p>
                <p>
                  Loading: {loading.toString()}, Error: {error || "none"}
                </p>
                <p>
                  All Businesses: {allBusinesses.length}, Filtered: {filteredBusinesses.length}
                </p>
                <p>
                  Total Count: {totalCount}, Has More: {hasMore.toString()}
                </p>
                <p>
                  Active Type: {activeBusinessType}, Sub Category: {selectedSubCategory || "none"}
                </p>
                <p>
                  Location: {locationDetails?.localGovernment || "none"}, {locationDetails?.state || "none"}
                </p>
              </div>
            )}

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  {filteredBusinesses.length > 0
                    ? `Found ${filteredBusinesses.length} business${filteredBusinesses.length !== 1 ? "es" : ""} matching "${searchTerm}"`
                    : `No businesses found matching "${searchTerm}"`}
                </p>
              </div>
            )}

            {/* Loading State for Initial Load */}
            {(loading || isRefetching) && allBusinesses.length === 0 && (
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
                  {error === "Waiting for location data..." ? "Fetching your location..." : "Error loading businesses"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {error === "Waiting for location data..."
                    ? "Please wait while we get your location."
                    : error === "Rate limit exceeded. Please try again later."
                      ? "Too many requests. Please wait a moment and try again."
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

            {/* Empty State - Only show if not loading and no error and no businesses */}
            {!loading && !isRefetching && !error && filteredBusinesses.length === 0 && allBusinesses.length === 0 && (
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
                <h3 className="font-bold text-md text-black mb-2">No businesses found for this location or category</h3>
                <p className="text-sm text-gray-500 mb-4">Click the address field above to enter new location</p>
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
            {!loading && !error && searchTerm && filteredBusinesses.length === 0 && allBusinesses.length > 0 && (
              <div className="flex flex-col items-center justify-center text-center my-8">
                <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-bold text-md text-black mb-2">No businesses found for "{searchTerm}"</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try a different search term or clear the search to see all businesses.
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
                  const isOpen = business.status === "open"
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
                            src={business.image || "/images/store-placeholder.png"}
                            alt={business.name}
                            width={280}
                            height={160}
                            className={`w-full h-40 object-cover ${!isOpen ? "opacity-50" : ""}`}
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
                              <span className="text-xs mr-1 text-[#292d32]">{business.rating}</span>
                              <StarIcon className="text-yellow-400 w-4 h-4" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-gray-500 text-xs">
                            <div className="flex items-center">
                              <ClockIcon className="text-[#FF6600] mr-1 w-4 h-4" />
                              {business.deliveryTime}
                            </div>
                            <span className={`text-xs ${isOpen ? "text-green-600" : "text-red-600"}`}>
                              {isOpen ? "Open" : "Closed"}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-4">
                            <span className="text-black text-xs px-1 py-0.5 rounded bg-gray-100">
                              {business.businessType}
                            </span>
                            {business.productCategories.map((category: string, index: number) => (
                              <span key={index} className="text-black text-xs px-1 py-0.5 rounded bg-gray-100">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={(e) => handleHeartClick(e, business.id.toString())}
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
                  )
                })}
              </div>
            )}

            {/* Load More Section */}
            {renderLoadMoreSection()}
          </div>
        </div>
      </section>
      <ClosedBusinessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
