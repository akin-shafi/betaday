/* eslint-disable @typescript-eslint/no-unused-vars */
// components/FeaturedStore.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import { useBusiness } from "@/hooks/useBusiness";
import ClosedBusinessModal from "./modal/closed-business-modal";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToFavorite } from "@/services/businessService";

interface FeaturedStoreProps {
  activeBusinessType: string; // Renamed from activeCategory
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

export default function FeaturedStore({
  activeBusinessType,
  selectedSubCategory,
}: FeaturedStoreProps) {
  const { address, locationDetails } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const { businesses, loading, error } = useBusiness({
    address,
    localGovernment: locationDetails?.localGovernment,
    state: locationDetails?.state,
    businessType: activeBusinessType, // Changed from category
    // subcategory: selectedSubCategory,
  });

  const { favorites, handleHeartClick } = useFavorites({
    onSaveToFavorite: saveToFavorite,
  });

  const filteredBusinesses = selectedSubCategory
    ? businesses.filter((business) =>
        business.productCategories.includes(selectedSubCategory)
      )
    : businesses;

  const handleBusinessClick = (e: React.MouseEvent, isOpen: boolean) => {
    if (!isOpen) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  // Rest of the component remains the same...
  return (
    <>
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-2">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-medium text-[#292d32] mb-3 md:mb-6">
              Featured Businesses
            </h2>

            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center text-center my-4">
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
              </div>
            )}

            {!loading && !error && filteredBusinesses.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center my-4">
                <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/icons/empty_box.png"
                    alt="Delivery unavailable"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className=" font-bold text-md text-black mb-2">
                  No businesses found for this location or category
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Click the address field above to enter new location
                </p>
              </div>
            )}

            {!loading && filteredBusinesses.length > 0 && (
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

            {!loading && filteredBusinesses.length > 0 && (
              <div className="flex justify-center mt-8">
                <button className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-50 transition-colors text-sm">
                  View More
                </button>
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
