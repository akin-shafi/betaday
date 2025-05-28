import { useQuery } from "@tanstack/react-query"
import { useAddress } from "@/contexts/address-context"
import { isBusinessCurrentlyOpen } from "@/utils/businessHours"

interface RecommendedBusiness {
  id: number
  name: string
  image: string | null
  rating: string
  deliveryTime: string
  tags: string[]
  status: string
  preOrder: boolean
  businessType: string
  productCategories: string[]
}

interface APIBusiness {
  id: number
  name: string
  image: string | null
  city: string
  rating: string
  ratingCount: number
  priceRange: string
  deliveryTimeRange: string | null
  businessType: string
  productCategories: string[]
  openingTime: string
  closingTime: string
  businessDays: string
  isActive: boolean
}

const fetchRecommendations = async (
  city: string,
  state: string,
  businessType: string,
  productType?: string,
): Promise<RecommendedBusiness[]> => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/top-rated`

  const normalizedCity = city.replace(/\s+/g, "-").replace(/\//g, "-")

  const params = new URLSearchParams({
    page: "1",
    limit: "5",
    businessType: businessType || "Restaurants",
    city: encodeURIComponent(normalizedCity),
    state: encodeURIComponent(state),
    minRating: "0",
  })

  if (productType) {
    params.set("productType", productType)
  }

  const url = `${baseUrl}?${params.toString()}`

  console.log("Fetching recommendations from:", url)

  // Add timeout and better error handling
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch recommendations: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data.businesses)) {
      throw new Error("Invalid response format")
    }

    return data.data.businesses.map((business: APIBusiness) => ({
      id: business.id,
      name: business.name,
      image: business.image,
      rating: business.rating,
      deliveryTime: business.deliveryTimeRange || "15 - 20 mins",
      tags: [],
      status: isBusinessCurrentlyOpen(
        business.openingTime,
        business.closingTime,
        business.businessDays || "Mon - Sun",
        business.isActive,
      )
        ? "open"
        : "closed",
      preOrder: false,
      businessType: business.businessType,
      productCategories: business.productCategories || [],
    }))
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.")
    }

    throw error
  }
}

export const useRecommendations = (businessType: string) => {
  const { locationDetails } = useAddress()

  return useQuery({
    queryKey: ["recommendations", locationDetails?.localGovernment, locationDetails?.state, businessType],
    queryFn: () => {
      if (!locationDetails?.localGovernment || !locationDetails?.state) {
        throw new Error("Location not set")
      }
      return fetchRecommendations(locationDetails.localGovernment, locationDetails.state, businessType)
    },
    enabled: !!locationDetails?.localGovernment && !!locationDetails?.state,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
