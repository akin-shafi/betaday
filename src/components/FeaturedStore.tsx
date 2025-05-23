/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart, Search } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import { useBusiness, Business } from "@/hooks/useBusiness";
import ClosedBusinessModal from "./modal/closed-business-modal";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToFavorite } from "@/services/businessService";
import { useInView } from "react-intersection-observer";

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

export default function FeaturedStore({
  activeBusinessType,
  selectedSubCategory,
}: FeaturedStoreProps) {
  const { address, locationDetails } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pathname = usePathname();
  const limit = 6;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const { data, loading, error } = useBusiness({
    address,
    localGovernment: locationDetails?.localGovernment,
    state: locationDetails?.state,
    businessType: activeBusinessType,
    productType: selectedSubCategory,
    page,
    limit,
  });

  const { favorites, handleHeartClick } = useFavorites({
    onSaveToFavorite: saveToFavorite,
  });

  useEffect(() => {
    if (data?.businesses) {
      setAllBusinesses((prev) => {
        const newBusinesses = data.businesses.filter(
          (newBiz) => !prev.some((biz) => biz.id === newBiz.id)
        );
        return [...prev, ...newBusinesses];
      });
      setHasMore(data.businesses.length === limit && data.total > allBusinesses.length + data.businesses.length);
    }
  }, [data, limit, allBusinesses.length]);

  useEffect(() => {
    setAllBusinesses([]);
    setPage(1);
    setHasMore(true);
  }, [activeBusinessType, address, locationDetails?.localGovernment, locationDetails?.state, selectedSubCategory]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  const filteredBusinesses = searchTerm
    ? allBusinesses.filter((business) =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allBusinesses;

  const handleBusinessClick = (e: React.MouseEvent, isOpen: boolean) => {
    if (!isOpen) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-2">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-6">
              <h2 className="text-xl md:text-2xl font-medium text-[#292d32]">
                Featured Businesses
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
              </div>
            </div>

            {loading && allBusinesses.length === 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(limit)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
              </div>
            )}

            {error && !loading && allBusinesses.length === 0 && (
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
                    alt="No businesses"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className=" font-bold text-md text-black mb-2">
                  {searchTerm
                    ? `No businesses found for "${searchTerm}"`
                    : "No businesses found for this location or category"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm
                    ? "Try a different search term or clear the search."
                    : "Click the address field above to enter new location"}
                </p>
              </div>
            )}

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

            {loading && allBusinesses.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {Array(limit)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCard key={`loading-${index}`} />
                  ))}
              </div>
            )}

            {hasMore && filteredBusinesses.length > 0 && (
              <div ref={ref} className="h-10" aria-hidden="true" />
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