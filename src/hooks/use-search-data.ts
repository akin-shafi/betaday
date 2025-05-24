/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback } from "react"

// Types for our search data
export interface SearchItem {
  id: string
  name: string
  type: string
  location: string
  image?: string
  description?: string
  rating?: number
  date?: string
  owner?: string
  openingTime?: string
  closingTime?: string
  priceRange?: string
  deliveryTimeRange?: string
  ratingCount?: number
}

export interface SearchOption {
  id: string
  name: string
}

export interface SearchData {
  items: SearchItem[]
  types: SearchOption[]
  locations: SearchOption[]
  recentSearches: string[]
}

// API Response interface
interface SearchApiResponse {
  businesses: {
    id: string
    name: string
    image: string
    city: string
    rating: string
    openingTime: string
    closingTime: string
    ratingCount: number
    priceRange: string
    deliveryTimeRange: string
    businessType: string
    productCategories: any[]
  }[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  suggestions: string[]
  message: string
  voiceSearch?: any
}

export function useSearchData() {
  const [searchData, setSearchData] = useState<SearchData>({
    items: [],
    types: [
      { id: "1", name: "Restaurants" },
      { id: "2", name: "Drinks" },
      { id: "3", name: "Supermarkets" },
      { id: "4", name: "Pharmacies" },
      { id: "5", name: "Groceries" },
    ],
    locations: [
      { id: "1", name: "Surulere" },
      { id: "2", name: "Ajeromi-Ifelodun" },
      { id: "3", name: "Ikeja" },
      { id: "4", name: "Lekki" },
      { id: "5", name: "Victoria Island" },
      { id: "6", name: "Yaba" },
    ],
    recentSearches: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [voiceSearchMetadata, setVoiceSearchMetadata] = useState<any>(null)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem("recentSearches")
      if (savedSearches) {
        const parsed = JSON.parse(savedSearches)
        setSearchData((prev) => ({
          ...prev,
          recentSearches: Array.isArray(parsed) ? parsed.slice(0, 5) : [],
        }))
      }
    } catch (error) {
      console.error("Error parsing recent searches:", error)
    }
  }, [])

  // Function to get the correct base URL
  const getBaseUrl = useCallback(() => {
    // Check if we're in development or production
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname

      // If we're on localhost or development
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
      }

      // For production, use the environment variable or construct from current domain
      return process.env.NEXT_PUBLIC_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8500`
    }

    // Fallback for server-side rendering
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
  }, [])

  // Enhanced search function with comprehensive voice support and duplicate prevention
  const searchBusinesses = useCallback(
    async (
      query?: string,
      businessType?: string,
      city?: string,
      options?: {
        keywords?: string[]
        voiceSearch?: boolean
        originalQuery?: string
      },
    ) => {
      // Don't make API call if no meaningful search criteria
      if (!query?.trim() && !businessType && !city && !options?.keywords?.length) {
        setSearchData((prev) => ({ ...prev, items: [] }))
        setSuggestions([])
        setVoiceSearchMetadata(null)
        return []
      }

      // Prevent duplicate calls if already loading
      if (isLoading) {
        console.log("Search already in progress, preventing duplicate call")
        return []
      }

      // Create a cache key to prevent duplicate searches
      const cacheKey = JSON.stringify({
        query: query?.trim(),
        businessType,
        city,
        keywords: options?.keywords?.sort(),
        voiceSearch: options?.voiceSearch,
      })

      // Check if we recently made the same search (prevent rapid duplicate calls)
      const lastSearchKey = sessionStorage.getItem("lastSearchKey")
      const lastSearchTime = sessionStorage.getItem("lastSearchTime")
      const now = Date.now()

      if (lastSearchKey === cacheKey && lastSearchTime && now - Number.parseInt(lastSearchTime) < 2000) {
        console.log("Preventing duplicate search within 2 seconds")
        return searchData.items
      }

      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        // Enhanced voice search parameter handling
        if (options?.voiceSearch && options.originalQuery) {
          params.append("voiceSearch", "true")
          params.append("originalQuery", options.originalQuery)

          if (options.keywords?.length) {
            params.append("keywords", options.keywords.join(","))
          }

          // Use original query if no processed query provided
          if (!query?.trim() && options.originalQuery) {
            params.append("q", options.originalQuery)
          }
        }

        if (query && query.trim()) {
          params.append("q", query.trim())
        }

        if (businessType) params.append("businessType", businessType)
        if (city) params.append("city", city)
        params.append("state", "Lagos") // Default state
        params.append("limit", "20") // Increase limit for better search results

        const baseUrl = getBaseUrl()
        const url = `${baseUrl}/businesses/search?${params.toString()}`

        console.log("Enhanced search URL:", url)
        console.log("Voice search options:", options)

        // Store search info to prevent duplicates
        sessionStorage.setItem("lastSearchKey", cacheKey)
        sessionStorage.setItem("lastSearchTime", now.toString())

        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
        }, 15000) // 15 second timeout for voice searches

        let response: Response

        try {
          response = await fetch(url, {
            method: "GET",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              // Add CORS headers if needed
              ...(typeof window !== "undefined" &&
                window.location.hostname !== "localhost" && {
                  "Access-Control-Allow-Origin": "*",
                }),
            },
          })
        } catch (fetchError) {
          clearTimeout(timeoutId)

          if (fetchError instanceof Error) {
            if (fetchError.name === "AbortError") {
              throw new Error("Request timed out. Please check your connection and try again.")
            }

            if (fetchError.message.includes("Failed to fetch")) {
              throw new Error("Unable to connect to search service. Please check your internet connection.")
            }

            if (fetchError.message.includes("NetworkError")) {
              throw new Error("Network error. Please check your connection and try again.")
            }
          }

          throw new Error("Connection failed. Please try again.")
        }

        clearTimeout(timeoutId)

        // Handle HTTP errors
        if (!response.ok) {
          let errorMessage = "Search failed"

          switch (response.status) {
            case 404:
              errorMessage = "Search service not found. Please try again later."
              break
            case 500:
              errorMessage = "Server error. Please try again later."
              break
            case 503:
              errorMessage = "Service temporarily unavailable. Please try again later."
              break
            case 429:
              errorMessage = "Too many requests. Please wait a moment and try again."
              break
            default:
              errorMessage = `Search failed (${response.status}). Please try again.`
          }

          throw new Error(errorMessage)
        }

        let data: SearchApiResponse

        try {
          data = await response.json()
        } catch (parseError) {
          throw new Error("Invalid response from server. Please try again.")
        }

        // Validate response structure
        if (!data || !Array.isArray(data.businesses)) {
          throw new Error("Invalid data received from server.")
        }

        // Store voice search metadata if present
        if (data.voiceSearch) {
          setVoiceSearchMetadata(data.voiceSearch)
          console.log("Voice search metadata received:", data.voiceSearch)
        }

        // Transform API data to match our SearchItem interface
        const transformedItems: SearchItem[] = data.businesses.map((business) => ({
          id: business.id,
          name: business.name,
          type: business.businessType,
          location: business.city,
          image: business.image,
          description: `${business.priceRange} • ${business.deliveryTimeRange}`,
          rating: Number.parseFloat(business.rating) || 0,
          date: "Available now",
          owner: "Business Owner",
          openingTime: business.openingTime,
          closingTime: business.closingTime,
          priceRange: business.priceRange,
          deliveryTimeRange: business.deliveryTimeRange,
          ratingCount: business.ratingCount,
        }))

        setSearchData((prev) => ({
          ...prev,
          items: transformedItems,
        }))

        setSuggestions(data.suggestions || [])
        return transformedItems
      } catch (err) {
        console.error("Error searching businesses:", err)

        let errorMessage = "Search failed. Please try again."

        if (err instanceof Error) {
          errorMessage = err.message
        }

        setError(errorMessage)

        // Return empty array on error but don't clear existing results immediately
        // This prevents the UI from flickering between states
        setSuggestions([])
        setVoiceSearchMetadata(null)
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [getBaseUrl, isLoading, searchData.items],
  )

  // Function to add a new search to recent searches
  const addRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return

    setSearchData((prev) => {
      const filteredSearches = prev.recentSearches.filter((item) => item.toLowerCase() !== search.toLowerCase())
      const newRecentSearches = [search, ...filteredSearches].slice(0, 5)

      try {
        localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
      } catch (error) {
        console.error("Error saving recent searches:", error)
      }

      return {
        ...prev,
        recentSearches: newRecentSearches,
      }
    })
  }, [])

  // Updated search function that supports voice search
  const searchItems = useCallback(
    async (
      query: string,
      typeFilter?: string,
      locationFilter?: string,
      voiceOptions?: {
        keywords?: string[]
        voiceSearch?: boolean
        originalQuery?: string
      },
    ) => {
      return await searchBusinesses(query, typeFilter, locationFilter, voiceOptions)
    },
    [searchBusinesses],
  )

  return {
    searchData,
    addRecentSearch,
    searchItems,
    isLoading,
    error,
    suggestions,
    refetch: searchBusinesses,
  }
}
