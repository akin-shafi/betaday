"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/services/productService";

interface MenuItem extends Product {
  popular?: boolean;
}

interface MenuItemsSectionProps {
  activeCategory: string;
  menuItems: MenuItem[];
  setSelectedItem: (item: MenuItem | null) => void;
  isLoading?: boolean;
  isBusinessOpen?: boolean;
  businessName?: string;
  openingTime?: string;
  closingTime?: string;
  businessDays?: string;
  isTwentyFourSeven?: boolean;
  isTwentyFourHours?: boolean;
}

const formatPrice = (price: string): string => {
  const cleanPrice = price.replace(/[₦$£€,]/g, "").trim();
  const numericPrice = Number.parseFloat(cleanPrice);

  if (isNaN(numericPrice)) {
    return price;
  }

  return `₦${numericPrice.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const generateInitials = (name: string): string => {
  const words = name
    .split(/[\s&+\-,/]+/)
    .filter((word) => word.length > 0)
    .map((word) => word.trim());

  if (words.length === 0) return "??";

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  } else {
    return words
      .slice(0, 3)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }
};

const formatBusinessHours = (
  openingTime?: string,
  closingTime?: string,
  businessDays?: string,
  isTwentyFourSeven?: boolean,
  isTwentyFourHours?: boolean
): string => {
  if (isTwentyFourSeven || isTwentyFourHours) return "Open 24/7";

  if (!openingTime || !closingTime || !businessDays)
    return "Hours not available";

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  return `${businessDays}: ${formatTime(openingTime)} - ${formatTime(
    closingTime
  )}`;
};

export default function MenuItemsSection({
  activeCategory,
  menuItems,
  setSelectedItem,
  isLoading = false,
  isBusinessOpen = true,
  businessName = "This business",
  openingTime,
  closingTime,
  businessDays,
  isTwentyFourSeven = false,
  isTwentyFourHours = false,
}: MenuItemsSectionProps) {
  const handleItemClick = (item: MenuItem) => {
    if (!effectiveIsBusinessOpen) {
      return;
    }
    setSelectedItem(item);
  };

  const isPopular = (item: MenuItem) => {
    return item.popular || item.isFeatured || false;
  };

  const effectiveIsBusinessOpen =
    isTwentyFourSeven || isTwentyFourHours || isBusinessOpen;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-[120px] h-[120px] bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!effectiveIsBusinessOpen && menuItems?.length > 0) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Business Currently Closed
              </h3>
              <div className="mt-1 text-sm text-red-700">
                <p className="mb-1">
                  {businessName} is currently closed. You can browse the menu
                  but cannot place orders at this time.
                </p>
                {formatBusinessHours(
                  openingTime,
                  closingTime,
                  businessDays,
                  isTwentyFourSeven,
                  isTwentyFourHours
                ) && (
                  <p className="text-xs bg-white px-2 py-1 rounded border border-red-100 inline-block">
                    <span className="font-medium">Business Hours:</span>{" "}
                    {formatBusinessHours(
                      openingTime,
                      closingTime,
                      businessDays,
                      isTwentyFourSeven,
                      isTwentyFourHours
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {menuItems.map((item) => {
              const initials = generateInitials(item.name);

              return (
                <div
                  key={item.id}
                  className="relative bg-white rounded-lg border border-gray-200 shadow-sm opacity-60 cursor-not-allowed"
                  title="This business is currently closed"
                >
                  <div className="flex items-start gap-4 p-4">
                    <div className="relative flex-shrink-0 w-[120px] h-[120px]">
                      {item.image ? (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                          className="rounded-md grayscale"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {initials}
                          </span>
                        </div>
                      )}

                      {isPopular(item) && (
                        <span className="absolute top-2 left-2 bg-gray-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                          Popular
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
                        <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          Unavailable
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 text-[#292d32]">
                      <h3 className="font-medium text-md text-gray-500">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-400">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Products Available
          </h3>
          <p className="text-gray-600">
            No products found for this category or search query.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {menuItems.map((item) => {
            const initials = generateInitials(item.name);

            return (
              <div
                key={item.id}
                className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="relative flex-shrink-0 w-[120px] h-[120px]">
                    {item.image ? (
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        className="rounded-md transform group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-md flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-2xl drop-shadow-sm">
                          {initials}
                        </span>
                      </div>
                    )}

                    {isPopular(item) && (
                      <span className="absolute top-2 left-2 bg-[#ff6600] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-[#292d32]">
                    <h3 className="font-medium text-md">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A2E20]">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
