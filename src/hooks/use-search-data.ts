/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { useDeliveryLocations } from "./use-delivery-locations"

export interface SearchItem {
  id: string
  name: string
  slug: string
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

interface SearchApiResponse {
  businesses: {
    id: string
    name: string
    slug: string
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
  const { deliveryData, isLoading: locationsLoading } = useDeliveryLocations()

  const [searchData, setSearchData] = useState<SearchData>({
    items: [],
    types: [
      { id: "1", name: "Restaurants" },
      { id: "2", name: "Drinks" },
      { id: "3", name: "Supermarkets" },
      { id: "4", name: "Pharmacies" },
      { id: "5", name: "Groceries" },
    ],
    locations: [],
    recentSearches: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [voiceSearchMetadata, setVoiceSearchMetadata] = useState<any>(null)

  const lastLocalGovCountRef = useRef(0)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    const currentCount = deliveryData.localGovernments.length

    if (!isInitializedRef.current || lastLocalGovCountRef.current !== currentCount) {
      if (currentCount > 0) {
        setSearchData((prev) => ({
          ...prev,
          locations: deliveryData.localGovernments,
        }))
      } else {
        setSearchData((prev) => ({
          ...prev,
          locations: [
            { id: "1", name: "Surulere" },
            { id: "2", name: "Ajeromi-Ifelodun" },
            { id: "3", name: "Ikeja" },
            { id: "4", name: "Lekki" },
            { id: "5", name: "Victoria Island" },
            { id: "6", name: "Yaba" },
          ],
        }))
      }

      lastLocalGovCountRef.current = currentCount
      isInitializedRef.current = true
    }
  }, [deliveryData.localGovernments])

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

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname

      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
      }

      return process.env.NEXT_PUBLIC_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8500`
    }

    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
  }

  const searchBusinesses = async (
    query?: string,
    businessType?: string,
    city?: string,
    options?: {
      keywords?: string[]
      voiceSearch?: boolean
      originalQuery?: string
    },
  ) => {
    if (!query?.trim() && !businessType && !city && !options?.keywords?.length) {
      setSearchData((prev) => ({ ...prev, items: [] }))
      setSuggestions([])
      setVoiceSearchMetadata(null)
      return []
    }

    if (isLoading) {
      return []
    }

    const cacheKey = JSON.stringify({
      query: query?.trim(),
      businessType,
      city,
      keywords: options?.keywords?.sort(),
      voiceSearch: options?.voiceSearch,
    })

    const lastSearchKey = sessionStorage.getItem("lastSearchKey")
    const lastSearchTime = sessionStorage.getItem("lastSearchTime")
    const now = Date.now()

    if (lastSearchKey === cacheKey && lastSearchTime && now - Number.parseInt(lastSearchTime) < 2000) {
      return searchData.items
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (options?.voiceSearch && options.originalQuery) {
        params.append("voiceSearch", "true")
        params.append("originalQuery", options.originalQuery)

        if (options?.keywords?.length) {
          params.append("keywords", options.keywords.join(","))
        }

        if (!query?.trim() && options.originalQuery) {
          params.append("q", options.originalQuery)
        }
      }

      if (query && query.trim()) {
        params.append("q", query.trim())
      }

      if (businessType) params.append("businessType", businessType)
      if (city) params.append("city", city)
      params.append("state", "Lagos")
      const baseUrl = getBaseUrl()
      const url = `${baseUrl}/businesses/search?${params.toString()}`

      sessionStorage.setItem("lastSearchKey", cacheKey)
      sessionStorage.setItem("lastSearchTime", now.toString())

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      let response: Response

      try {
        response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
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
            throw new Error("Network error. Please try again.")
          }
        }

        throw new Error("Connection failed. Please try again.")
      }

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = "Search failed."

        switch (response.status) {
          case 404:
            errorMessage = "Search service not found. Please try again."
            break
          case 500:
            errorMessage = "Server error. Please try again."
            break
          case 503:
            errorMessage = "Service temporarily unavailable. Please try again."
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

      if (!data || !Array.isArray(data.businesses)) {
        throw new Error("Invalid data received from server.")
      }

      if (data.voiceSearch) {
        setVoiceSearchMetadata(data.voiceSearch)
      }

      const transformedItems: SearchItem[] = data.businesses.map((business) => ({
        id: business.id,
        name: business.name,
        slug: business.slug,
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

      setSuggestions([])
      setVoiceSearchMetadata(null)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const addRecentSearch = (search: string) => {
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
  }

  const removeRecentSearch = (searchToRemove: string) => {
    setSearchData((prev) => {
      const newRecentSearches = prev.recentSearches.filter(
        (search) => search.toLowerCase() !== searchToRemove.toLowerCase(),
      )

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
  }

  const clearAllRecentSearches = () => {
    setSearchData((prev) => {
      try {
        localStorage.removeItem("recentSearches")
      } catch (error) {
        console.error("Error clearing recent searches:", error)
      }

      return {
        ...prev,
        recentSearches: [],
      }
    })
  }

  const searchItems = async (
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
  }

  return {
    searchData,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
    searchItems,
    isLoading: isLoading || locationsLoading,
    error,
    suggestions,
    refetch: searchBusinesses,
  }
}