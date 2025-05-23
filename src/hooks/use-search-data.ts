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

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches)
        setSearchData((prev) => ({
          ...prev,
          recentSearches: Array.isArray(parsed) ? parsed.slice(0, 5) : [],
        }))
      } catch (error) {
        console.error("Error parsing recent searches:", error)
      }
    }
  }, [])

  // Function to search businesses using the new search endpoint
  const searchBusinesses = useCallback(async (query?: string, businessType?: string, city?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (query && query.trim()) params.append("q", query.trim())
      if (businessType) params.append("businessType", businessType)
      if (city) params.append("city", city)
      params.append("state", "Lagos") // Default state
      params.append("limit", "20") // Increase limit for better search results

      const response = await fetch(`http://localhost:8500/businesses/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SearchApiResponse = await response.json()

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
      setError(err instanceof Error ? err.message : "Failed to search businesses")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

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

  // Updated search function that uses the new endpoint
  const searchItems = useCallback(
    async (query: string, typeFilter?: string, locationFilter?: string) => {
      return await searchBusinesses(query, typeFilter, locationFilter)
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
