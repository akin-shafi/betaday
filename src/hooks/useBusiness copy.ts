/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query"

export interface Business {
  id: string
  name: string
  image: string | null
  city: string
  priceRange: string | null
  deliveryTime: string | null
  rating: number
  ratingCount: number
  openingTime: string
  closingTime: string
  status: "open" | "closed"
  businessType: string
  productCategories: string[]
}

interface BusinessResponse {
  businesses: Business[]
  total: number
  page: number
  limit: number
}

interface UseBusinessProps {
  address: string | null
  localGovernment: string | undefined
  state: string | undefined
  businessType?: string
  productType?: string | null
  page?: number
  limit?: number
}

const isBusinessOpen = (openingTime: string, closingTime: string): boolean => {
  const now = new Date()
  const [openHour, openMinute] = openingTime.split(":").map(Number)
  const [closeHour, closeMinute] = closingTime.split(":").map(Number)

  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  const openTimeInMinutes = openHour * 60 + openMinute
  const closeTimeInMinutes = closeHour * 60 + closeMinute
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  if (closeTimeInMinutes < openTimeInMinutes) {
    return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes < closeTimeInMinutes
  }
  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes
}

// Create a cache for API requests to prevent duplicate calls
const requestCache = new Map<string, Promise<BusinessResponse>>()

const fetchBusinesses = async ({
  localGovernment,
  state,
  businessType,
  productType,
  page = 1,
  limit = 10,
}: {
  localGovernment?: string
  state?: string
  businessType?: string
  productType?: string
  page?: number
  limit?: number
}): Promise<BusinessResponse> => {
  // If location data is missing, use default values instead of throwing an error
  if (!localGovernment || !state) {
    console.warn("Location data missing, using default values")
    localGovernment = "Surulere" // Default city
    state = "Lagos" // Default state
  }

  const normalizedCity = localGovernment.replace(/\s+/g, "-").replace(/\//g, "-")

  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/filter`
  const params = new URLSearchParams({
    city: encodeURIComponent(normalizedCity),
    state: encodeURIComponent(state),
    page: page.toString(),
    limit: limit.toString(),
  })

  // Only add businessType if it's provided and not empty
  if (businessType && businessType.trim()) {
    params.set("businessType", businessType)
  }

  // Only add productType if it's provided and not empty
  if (productType && productType.trim()) {
    params.set("productType", productType)
  }

  const url = `${baseUrl}?${params.toString()}`

  // Check if we already have a request in progress for this URL
  if (requestCache.has(url)) {
    return requestCache.get(url) as Promise<BusinessResponse>
  }

  // Create a new request and cache it
  const requestPromise = (async () => {
    try {
      console.log("Fetching businesses from:", url)
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 429) {
          console.error("Rate limit exceeded. Waiting before retrying...")
          // Wait 2 seconds before retrying on rate limit
          await new Promise((resolve) => setTimeout(resolve, 2000))
          throw new Error("Rate limit exceeded. Please try again later.")
        }
        throw new Error(`Failed to fetch businesses: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`Received ${data.businesses?.length || 0} businesses from API`)

      return {
        businesses: data.businesses.map((business: any) => ({
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
          status: isBusinessOpen(business.openingTime, business.closingTime) ? "open" : "closed",
          businessType: business.businessType,
          productCategories: business.productCategories || [],
        })),
        total: data.total || 0,
        page: data.page || page,
        limit: data.limit || limit,
      }
    } catch (error) {
      console.error("Error fetching businesses:", error)
      throw error
    } finally {
      // Remove from cache after request completes (success or error)
      setTimeout(() => requestCache.delete(url), 1000)
    }
  })()

  // Store the promise in the cache
  requestCache.set(url, requestPromise)
  return requestPromise
}

export const useBusiness = ({
  localGovernment,
  state,
  businessType,
  productType,
  page = 1,
  limit = 10,
}: UseBusinessProps) => {
  // Create a stable query key that doesn't include undefined values
  const queryKey = [
    "businesses",
    localGovernment || "default",
    state || "default",
    businessType || "all",
    productType || "all",
    page,
    limit,
  ]

  // Check if we have valid location data
  const hasValidLocation = Boolean(localGovernment && state)

  const query = useQuery({
    queryKey,
    queryFn: () =>
      fetchBusinesses({
        localGovernment,
        state,
        businessType,
        productType: productType || undefined,
        page,
        limit,
      }),
    // Only enable the query if we have valid location data
    enabled: hasValidLocation,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    // Add retry logic for better resilience
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Add refetch options for better UX
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })

  return {
    data: query.data || { businesses: [], total: 0, page, limit },
    loading: query.isLoading || query.isFetching,
    error: !hasValidLocation
      ? "Waiting for location data..."
      : query.error instanceof Error
        ? query.error.message
        : null,
    refetch: query.refetch,
    isRefetching: query.isFetching && !query.isLoading,
  }
}
