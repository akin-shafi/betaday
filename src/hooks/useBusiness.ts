"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { isBusinessCurrentlyOpen } from "@/utils/businessHours"
import { useState } from "react"

// Define the Business interface with proper typing
export interface Business {
  id: string
  slug: string
  name: string
  image: string | null
  city: string
  priceRange: string | null
  deliveryTime: string | null
  rating: number
  ratingCount: number
  openingTime: string
  closingTime: string
  businessDays: string
  status: "open" | "closed"
  businessType: string
  productCategories: string[]
  isActive: boolean
}

// Response interface without pagination data
interface BusinessResponse {
  businesses: Business[]
  total: number
}

// Define props interface without pagination parameters
interface UseBusinessProps {
  address: string | null
  localGovernment: string | undefined
  state: string | undefined
  businessType?: string
  productType?: string | null
}

// Fetch businesses function without pagination
const fetchBusinesses = async ({
  localGovernment,
  state,
  businessType,
  productType,
  cacheBuster,
}: {
  localGovernment: string
  state: string
  businessType?: string
  productType?: string
  cacheBuster: string
}): Promise<BusinessResponse> => {
  if (!localGovernment || !state) {
    throw new Error("Waiting for location data...")
  }

  const normalizedCity = localGovernment.replace(/\s+/g, "-").replace(/\//g, "-")

  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/filter`
  const params = new URLSearchParams({
    city: encodeURIComponent(normalizedCity),
    state: encodeURIComponent(state),
    _t: cacheBuster, // Use the stable cacheBuster value
  })

  if (businessType) {
    params.set("businessType", businessType)
  }

  if (productType) {
    params.set("productType", productType)
  }

  const url = `${baseUrl}?${params.toString()}`
  // console.log("Fetching businesses from:", url)

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch businesses: ${response.statusText}`)
  }

  const data = await response.json()
  // console.log(`Received ${data.businesses?.length || 0} businesses from API`)

  return {
    businesses: data.businesses.map((business: any) => ({
      id: business.id,
      name: business.name,
      slug: business.slug,
      image: business.image || null,
      city: business.city,
      priceRange: business.priceRange || null,
      deliveryTime: business.deliveryTimeRange || "15 - 20 mins",
      rating: Number(business.rating),
      ratingCount: business.ratingCount || business.totalRatings || 0,
      openingTime: business.openingTime,
      closingTime: business.closingTime,
      businessDays: business.businessDays || "Mon - Sun",
      status: isBusinessCurrentlyOpen(
        business.openingTime,
        business.closingTime,
        business.businessDays || "Mon - Sun",
        business.isActive,
      )
        ? "open"
        : "closed",
      businessType: business.businessType,
      productCategories: business.productCategories || [],
      isActive: business.isActive,
    })),
    total: data.businesses?.length || 0,
  }
}

// Updated useBusiness hook without pagination
export const useBusiness = ({
  address,
  localGovernment,
  state,
  businessType,
  productType,
}: UseBusinessProps) => {
  const queryClient = useQueryClient()
  // Use a stable cache buster that doesn't change on every render
  const [cacheBuster] = useState(() => Date.now().toString())

  const query = useQuery({
    queryKey: ["businesses", localGovernment, state, businessType, productType, cacheBuster],
    queryFn: () =>
      fetchBusinesses({
        localGovernment: localGovernment!,
        state: state!,
        businessType,
        productType: productType || undefined,
        cacheBuster,
      }),
    enabled: !!address && !!localGovernment && !!state,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  })

  // Function to invalidate and refetch businesses
  const invalidateBusinesses = () => {
    queryClient.invalidateQueries({ queryKey: ["businesses"] })
  }

  return {
    data: query.data || { businesses: [], total: 0 },
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
    invalidateBusinesses,
  }
}