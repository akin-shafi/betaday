"use client"

import { useState, useEffect } from "react"

// Helper function to normalize city name for API
const normalizeCityName = (city: string): string => {
  return city.replace(/\s+/g, "-").replace(/\//g, "-")
}

export interface FeaturedBusiness {
  id: string
  name: string
  slug: string
  image: string
  rating: number
  deliveryTime: string
  businessType: string
  productCategories: string[]
  openingTime: string
  closingTime: string
  businessDays: string
  isActive: boolean
  featuredPriority: number
  status: "open" | "closed"
  refetch: () => void
  createdAt: string
}

interface FeaturedBusinessesResponse {
  success: boolean
  message: string
  data: FeaturedBusiness[]
  total: number
  page: number
  limit: number
}

interface UseFeaturedBusinessesOptions {
  city?: string
  state?: string
  localGovernment?: string
  businessType?: string
  limit?: number
  page?: number
  enabled?: boolean
}

export function useFeaturedBusinesses(options: UseFeaturedBusinessesOptions = {}) {
  const { city, state, localGovernment, businessType, limit = 10, page = 1, enabled = true } = options

  const [businesses, setBusinesses] = useState<FeaturedBusiness[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedBusinesses = async () => {
      if (!enabled || !city || !state) return

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        // Normalize the city name before adding to params
        const normalizedCity = normalizeCityName(city)
        if (normalizedCity) params.append("city", normalizedCity)
        if (state) params.append("state", state)
        if (localGovernment) params.append("localGovernment", localGovernment)
        if (businessType) params.append("businessType", businessType)

          
        params.append("limit", limit.toString())
        params.append("page", page.toString())

        // Add user timezone and current time
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const userCurrentTime = new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        params.append("userTimeZone", userTimeZone)
        params.append("userCurrentTime", userCurrentTime)

        // Use proper base URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
        const response = await fetch(`${baseUrl}/api/featured?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch featured businesses: ${response.statusText}`)
        }

        const responseData: FeaturedBusinessesResponse = await response.json()

        if (responseData.success && responseData.data) {
          // The businesses are directly in the data array
          setBusinesses(responseData.data)
          setTotal(responseData.total)
          setCurrentPage(responseData.page)
        } else {
          throw new Error(responseData.message || "Failed to fetch featured businesses")
        }
      } catch (err) {
        console.error("Error fetching featured businesses:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setBusinesses([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedBusinesses()
  }, [city, state, localGovernment, businessType, limit, page, enabled])

  return {
    businesses,
    total,
    currentPage,
    loading,
    error,
    hasData: businesses.length > 0,
    isEmpty: !loading && businesses.length === 0,
  }
}
