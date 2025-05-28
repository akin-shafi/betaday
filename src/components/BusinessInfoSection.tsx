"use client"

import Link from "next/link"
import { ArrowLeft, Clock, Bike, Tag, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { formatBusinessHours, getBusinessStatus } from "@/utils/businessHours"

type BusinessDetails = {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  deliveryOptions: string[]
  image: string | null
  openingTime: string
  closingTime: string
  contactNumber: string
  rating: string
  totalRatings: number
  isActive: boolean
  businessType: string
  deliveryTimeRange: string | null
  businessDays: string
}

interface BusinessInfoSectionProps {
  business: BusinessDetails
  isLoading?: boolean
}

export default function BusinessInfoSection({ business, isLoading = false }: BusinessInfoSectionProps) {
  const [activeOption, setActiveOption] = useState<string | null>(null)

  useEffect(() => {
    if (business?.deliveryOptions?.length > 0) {
      setActiveOption(business.deliveryOptions[0])
    }
  }, [business])

  const foodImage = "/images/food.png"

  if (isLoading) {
    return (
      <div className="relative w-full">
        {/* Cover Background */}
        <div className="absolute inset-0 h-[240px] sm:h-[280px] bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />

        {/* Content */}
        <div className="relative z-20 pt-4 sm:pt-6 pb-4 sm:pb-6">
          <div className="px-3 sm:px-4">
            <div className="inline-flex items-center mb-4 sm:mb-6">
              <div className="h-4 w-4 bg-white/20 rounded mr-2 animate-pulse" />
              <div className="h-4 w-24 sm:w-32 bg-white/20 rounded animate-pulse" />
            </div>

            {/* Business Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl animate-pulse">
              <div className="flex items-start gap-3 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-6 sm:h-8 w-full bg-gray-200 rounded-lg mb-2 sm:mb-3 animate-pulse" />
                  <div className="h-4 sm:h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="w-full p-4 text-center">
        <p className="text-gray-500">Business information not available</p>
      </div>
    )
  }

  const handleToggle = (option: string) => {
    setActiveOption(option)
  }

  // Get business status
  const businessStatus = getBusinessStatus(
    business.openingTime,
    business.closingTime,
    business.businessDays,
    business.isActive,
  )

  // Format business hours for display
  const formattedHours = formatBusinessHours(business.openingTime, business.closingTime, business.businessDays)

  // Check if business is new (0 rating or 0 total ratings)
  const isNewBusiness = business.rating === "0.0" || business.totalRatings === 0

  return (
    <div className="relative w-full mb-4 sm:mb-6">
      {/* Enhanced Darkened Background */}
      <div className="absolute inset-0 h-[240px] sm:h-[280px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-md scale-110 transform"
          style={{
            backgroundImage: `url(${business.image || foodImage})`,
          }}
        />
        {/* Multi-layer dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 pt-4 sm:pt-6 pb-4 sm:pb-6">
        <div className="px-3 sm:px-4">
          {/* Enhanced Breadcrumb */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link
              href="/store"
              className="inline-flex items-center text-white/90 hover:text-white transition-all duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-xs sm:text-sm font-medium">
                <MapPin className="h-3 w-3 inline mr-1" />
                {business.city} • Back to Businesses
              </span>
            </Link>

            {/* Status Badge */}
            <div
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border flex-shrink-0 ${
                businessStatus.isOpen
                  ? "bg-green-500/20 text-green-100 border-green-400/30"
                  : "bg-red-500/20 text-red-100 border-red-400/30"
              }`}
            >
              {businessStatus.isOpen ? "● Open" : "● Closed"}
            </div>
          </div>

          {/* Enhanced Business Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-start gap-3 sm:gap-6 mb-4">
              {/* Enhanced Business Logo */}
              <div className="relative group flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-200/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {business.image ? (
                    <img
                      src={business.image || "/placeholder.svg"}
                      alt={`${business.name} logo`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brandmain/30 to-brandmain/60 flex items-center justify-center">
                      <span className="text-brandmain font-bold text-lg sm:text-2xl">{business.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brandmain/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                  <h1 className="font-bold text-xl sm:text-3xl text-gray-900 leading-tight break-words">
                    {business.name}
                  </h1>

                  {/* Enhanced Rating - Show default for new businesses */}
                  <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-yellow-200/50 flex-shrink-0 self-start">
                    {isNewBusiness ? (
                      <div className="flex items-center">
                        <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md text-xs font-semibold mr-1">
                          NEW
                        </span>
                        <span className="text-xs text-gray-600">Just opened</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-sm sm:text-lg mr-1">{business.rating}</span>
                          <svg
                            width="14"
                            height="14"
                            className="mr-1 sm:w-[18px] sm:h-[18px]"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 0L6.12257 3.45492H9.75528L6.81636 5.59017L7.93893 9.04508L5 6.90983L2.06107 9.04508L3.18364 5.59017L0.244718 3.45492H3.87743L5 0Z"
                              fill="#FFD700"
                            />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">({business.totalRatings})</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Business Type Badge */}
                <div className="inline-flex items-center bg-gradient-to-r from-brandmain/10 to-brandmain/20 text-brandmain px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
                  <Tag className="h-3 w-3 mr-1" />
                  {business.businessType}
                </div>

                {/* Business Hours and Delivery Fee - Side by Side */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  {/* Business Hours - Left Side */}
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 sm:px-3 py-2 rounded-lg flex-1 min-w-0">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-brandmain flex-shrink-0" />
                    <span className="font-medium truncate">{formattedHours}</span>
                  </div>

                  {/* Delivery Fee - Right Side */}
                  <div className="flex items-center bg-blue-50 px-2 sm:px-3 py-2 rounded-lg border border-blue-200/50 flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-md sm:rounded-lg flex items-center justify-center mr-2 shadow-lg">
                      <Bike className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xs sm:text-sm">From ₦600</div>
                      <div className="text-xs text-gray-500 hidden sm:block">Delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Delivery Options */}
            {business.deliveryOptions && business.deliveryOptions.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {business.deliveryOptions.includes("delivery") && (
                  <button
                    onClick={() => handleToggle("delivery")}
                    className={`w-full sm:flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                      activeOption === "delivery"
                        ? "bg-gradient-to-r from-brandmain to-brandmain/90 text-white shadow-lg shadow-brandmain/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    🚚 Delivery • {business.deliveryTimeRange || "30-45 mins"}
                  </button>
                )}
                {business.deliveryOptions.includes("pickup") && (
                  <button
                    onClick={() => handleToggle("pickup")}
                    className={`w-full sm:flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                      activeOption === "pickup"
                        ? "bg-gradient-to-r from-brandmain to-brandmain/90 text-white shadow-lg shadow-brandmain/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    🏪 Pickup • Ready in 15 mins
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
