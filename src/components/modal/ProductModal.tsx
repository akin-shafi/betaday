/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProductModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input, Tooltip } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, Info } from "lucide-react";
import { Product } from "@/types/product";
import ProductModalSkeleton from "@/components/skeletons/ProductModalSkeleton";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedCategory: string | null;
  productsLoading: boolean;
  locationDetails: { state?: string; localGovernment?: string } | null;
  businesses: any[];
}

const modalVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { x: "-100%", opacity: 0, transition: { duration: 0.2 } },
};

export function ProductModal({
  isOpen,
  onClose,
  products,
  selectedCategory,
  productsLoading,
  locationDetails,
  businesses,
}: ProductModalProps) {
  const [filter, setFilter] = useState<"fastest" | "lowest" | "rated">(
    "fastest"
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [modalHeight, setModalHeight] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setModalHeight(window.innerHeight);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const calculateDeliveryFee = (businessCity: string) => {
    const userCity = locationDetails?.localGovernment || "";
    return businessCity === userCity ? 600 : 1200;
  };

  const getBusinessId = (businessName: string) => {
    const business = businesses.find((b) => b.name === businessName);
    return business?.id || "";
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      product.business.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filter === "fastest") {
      const aTime = parseInt(
        a.business.deliveryTimeRange?.split("-")[0] || "999"
      );
      const bTime = parseInt(
        b.business.deliveryTimeRange?.split("-")[0] || "999"
      );
      return aTime - bTime;
    } else if (filter === "lowest") {
      const aTotal =
        parseFloat(a.price) + calculateDeliveryFee(a.business.city);
      const bTotal =
        parseFloat(b.price) + calculateDeliveryFee(b.business.city);
      return aTotal - bTotal;
    } else if (filter === "rated") {
      const aRating = parseFloat(a.business.rating || "0");
      const bRating = parseFloat(b.business.rating || "0");
      return bRating - aRating;
    }
    return 0;
  });

  const fastest = sortedProducts[0];
  const lowest = filteredProducts.reduce((min, p) => {
    const pTotal = parseFloat(p.price) + calculateDeliveryFee(p.business.city);
    const minTotal =
      parseFloat(min.price) + calculateDeliveryFee(min.business.city);
    return pTotal < minTotal ? p : min;
  }, filteredProducts[0]);
  const mostRated = filteredProducts.reduce(
    (max, p) =>
      parseFloat(p.business.rating || "0") >
      parseFloat(max.business.rating || "0")
        ? p
        : max,
    filteredProducts[0]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-start"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-[480px] bg-white fixed top-0 left-0 md:w-[480px]"
        style={{ height: modalHeight ? `${modalHeight}px` : "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#292d32]">
            Products in {selectedCategory}
          </h2>
          <button
            className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X
              size={24}
              className="transition-transform group-hover:scale-110"
            />
            <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </button>
        </div>

        <div
          className="p-4 overflow-y-auto"
          style={{
            height: modalHeight ? `${modalHeight - 60}px` : "calc(100% - 60px)",
          }}
        >
          {productsLoading ? (
            <ProductModalSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No products found for this category.
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Search for restaurant"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="rounded-lg border-gray-300 text-sm"
              />

              <div className="flex justify-start gap-2 overflow-x-auto mt-4">
                <button
                  onClick={() => setFilter("fastest")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    filter === "fastest"
                      ? "bg-[#FF6600] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Fastest Delivery +10pts
                </button>
                <button
                  onClick={() => setFilter("lowest")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    filter === "lowest"
                      ? "bg-[#4CAF50] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Lower price
                </button>
                <button
                  onClick={() => setFilter("rated")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    filter === "rated"
                      ? "bg-[#2196F3] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Most Rated
                </button>
              </div>

              <div>
                <Tooltip
                  title="Choose 'Fastest Delivery' and earn 10 points instantly! If your order arrives later than the estimated time, you’ll get an additional 20 bonus points as compensation. Points can be redeemed for discounts on future orders."
                  placement="topLeft"
                  style={{ maxWidth: "300px" }}
                >
                  <span className="text-xs text-gray-500 mb-4 flex items-center gap-1 cursor-pointer">
                    Fastest Delivery Guarantee: Earn 20 bonus points if we’re
                    late!
                    <Info
                      size={14}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </span>
                </Tooltip>
              </div>

              <div className="space-y-4">
                {sortedProducts.map((product) => {
                  const deliveryFee = calculateDeliveryFee(
                    product.business.city
                  );
                  const price = parseFloat(product.price);
                  const totalCost = price + deliveryFee;
                  const businessId = getBusinessId(product.business.name);
                  const isFastest = filter === "fastest" && product === fastest;
                  const isLowest = filter === "lowest" && product === lowest;
                  const isMostRated =
                    filter === "rated" && product === mostRated;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between border-b border-gray-200 pb-4"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="w-14 h-14 object-cover rounded-full"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#292d32] flex items-center gap-2">
                            {product.name}
                            {isFastest && (
                              <span className="text-xs text-white bg-[#FF6600] px-2 py-1 rounded-full">
                                Fastest
                              </span>
                            )}
                            {isLowest && (
                              <span className="text-xs text-white bg-[#4CAF50] px-2 py-1 rounded-full">
                                Cheapest
                              </span>
                            )}
                            {isMostRated && (
                              <span className="text-xs text-white bg-[#2196F3] px-2 py-1 rounded-full">
                                Top Rated
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.business.name}
                          </p>
                          <p className="text-xs font-medium text-[#292d32]">
                            ₦{price} + ₦{deliveryFee} Delivery = ₦{totalCost}
                          </p>
                          <p className="text-xs text-gray-500">
                            Delivery:{" "}
                            {product.business.deliveryTimeRange || "N/A"}
                            {product.business.rating && (
                              <span className="ml-2">
                                <span className="text-[#FF6600]">★</span>{" "}
                                {product.business.rating}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={
                          businessId
                            ? {
                                pathname: `/store/${businessId}`,
                                query: { productId: product.id },
                              }
                            : "#"
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-700 hover:bg-[#1A2E20] hover:text-white transition-colors duration-200 ${
                          !businessId && "cursor-not-allowed opacity-50"
                        }`}
                      >
                        Order Now
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
