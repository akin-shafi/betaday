/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { useAddress } from "@/contexts/address-context"

export interface DeliveryLocation {
  id: string
  name: string
}

export interface DeliveryLocationData {
  states: DeliveryLocation[]
  localGovernments: DeliveryLocation[]
  localities: DeliveryLocation[]
}

interface ApiState {
  id: number
  name: string
  isActive: boolean
}

interface ApiLocalGovernment {
  id: number
  name: string
  isActive: boolean
  stateId: number
  state: ApiState
}

interface ApiLocality {
  id: number
  name: string
  isActive: boolean
  localGovernmentId: number
  localGovernment: ApiLocalGovernment
}

// Global cache to prevent duplicate API calls across all hook instances
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Global loading state to prevent multiple simultaneous calls
const loadingStates = new Map<string, boolean>()

// Global promise cache to share ongoing requests
const promiseCache = new Map<string, Promise<any>>()

export function useDeliveryLocations() {
  const { locationDetails } = useAddress()
  const [deliveryData, setDeliveryData] = useState<DeliveryLocationData>({
    states: [],
    localGovernments: [],
    localities: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs to prevent duplicate calls and track state
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastLocationRef = useRef<string>("")
  const isInitializedRef = useRef(false)
  const isMountedRef = useRef(true)

  // Function to get the correct base URL (no useCallback to prevent recreation)
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

  // Cache helper functions
  const getCachedData = (key: string) => {
    const cached = apiCache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`💾 Using cached data for: ${key}`)
      return cached.data
    }
    return null
  }

  const setCachedData = (key: string, data: any) => {
    apiCache.set(key, { data, timestamp: Date.now() })
  }

  // Enhanced fetch with shared promise caching
  const fetchWithCache = async (url: string, cacheKey: string, signal?: AbortSignal) => {
    // Check cache first
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return cachedData
    }

    // Check if there's already a promise for this request
    const existingPromise = promiseCache.get(cacheKey)
    if (existingPromise) {
      console.log(`🔄 Sharing existing promise for: ${cacheKey}`)
      return await existingPromise
    }

    // Create new promise and cache it
    const promise = (async () => {
      try {
        console.log(`📡 Fetching: ${cacheKey}`)
        const response = await fetch(url, {
          signal,
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()

        // Cache the response
        setCachedData(cacheKey, data)

        return data
      } finally {
        // Always remove from promise cache when done
        promiseCache.delete(cacheKey)
      }
    })()

    // Cache the promise
    promiseCache.set(cacheKey, promise)

    return await promise
  }

  // Function to fetch states
  const fetchStates = async (signal?: AbortSignal): Promise<DeliveryLocation[]> => {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/delivery-locations/states`
    const cacheKey = "states"

    try {
      const data = await fetchWithCache(url, cacheKey, signal)

      if (!data?.success || !Array.isArray(data.data)) {
        throw new Error("Invalid states data received")
      }

      return data.data.map((state: ApiState) => ({
        id: state.id.toString(),
        name: state.name,
      }))
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error
      }
      console.error("Error fetching states:", error)
      throw error
    }
  }

  // Function to fetch local governments by state name
  const fetchLocalGovernmentsByState = async (stateName: string, signal?: AbortSignal): Promise<DeliveryLocation[]> => {
    const baseUrl = getBaseUrl()

    try {
      // First, get all states to find the state ID (use cache)
      const statesData = await fetchWithCache(`${baseUrl}/delivery-locations/states`, "states", signal)

      if (!statesData?.success || !Array.isArray(statesData.data)) {
        throw new Error("Invalid states data received")
      }

      // Find the state by name (case-insensitive)
      const targetState = statesData.data.find(
        (state: ApiState) => state.name.toLowerCase() === stateName.toLowerCase(),
      )

      if (!targetState) {
        console.warn(`State "${stateName}" not found, returning empty local governments`)
        return []
      }

      // Fetch local governments for this state
      const lgCacheKey = `lg-state-${targetState.id}`
      const lgUrl = `${baseUrl}/delivery-locations/states/${targetState.id}/local-governments`
      const lgData = await fetchWithCache(lgUrl, lgCacheKey, signal)

      if (!lgData?.success || !Array.isArray(lgData.data)) {
        throw new Error("Invalid local governments data received")
      }

      return lgData.data.map((lg: ApiLocalGovernment) => ({
        id: lg.id.toString(),
        name: lg.name,
      }))
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error
      }
      console.error("Error fetching local governments:", error)
      throw error
    }
  }

  // Function to fetch localities by local government name
  const fetchLocalitiesByLG = async (
    lgName: string,
    stateName: string,
    signal?: AbortSignal,
  ): Promise<DeliveryLocation[]> => {
    const baseUrl = getBaseUrl()
    const cacheKey = `localities-${stateName.toLowerCase()}-${lgName.toLowerCase()}`

    try {
      // Check cache first for this specific combination
      const cachedData = getCachedData(cacheKey)
      if (cachedData) {
        return cachedData
      }

      // Get all local governments to find the LG ID (use cache)
      const lgCacheKey = "all-lgs"
      const lgData = await fetchWithCache(`${baseUrl}/delivery-locations/local-governments`, lgCacheKey, signal)

      if (!lgData?.success || !Array.isArray(lgData.data)) {
        throw new Error("Invalid local governments data received")
      }

      // Find the local government by name and state
      const targetLG = lgData.data.find(
        (lg: ApiLocalGovernment) =>
          lg.name.toLowerCase() === lgName.toLowerCase() && lg.state.name.toLowerCase() === stateName.toLowerCase(),
      )

      if (!targetLG) {
        console.warn(`Local government "${lgName}" in "${stateName}" not found, returning empty localities`)
        return []
      }

      // Fetch localities for this local government
      const localitiesUrl = `${baseUrl}/delivery-locations/local-governments/${targetLG.id}/localities`
      const localitiesData = await fetchWithCache(localitiesUrl, cacheKey, signal)

      if (!localitiesData?.success || !Array.isArray(localitiesData.data)) {
        throw new Error("Invalid localities data received")
      }

      const localities = localitiesData.data.map((locality: ApiLocality) => ({
        id: locality.id.toString(),
        name: locality.name,
      }))

      // Cache the result
      setCachedData(cacheKey, localities)
      return localities
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error
      }
      console.error("Error fetching localities:", error)
      return []
    }
  }

  // Main function to load delivery locations
  const loadDeliveryLocations = async () => {
    // Create location key for comparison
    const locationKey = `${locationDetails.state}-${locationDetails.localGovernment}-${locationDetails.locality}`

    // Skip if same location and already initialized
    if (isInitializedRef.current && lastLocationRef.current === locationKey) {
      console.log("🔄 Skipping load - same location, already initialized")
      return
    }

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsLoading(true)
    setError(null)

    try {
      console.log("🔄 Loading delivery locations for:", locationKey)

      // Always fetch states first
      const states = await fetchStates(signal)

      let localGovernments: DeliveryLocation[] = []
      let localities: DeliveryLocation[] = []

      // If we have user's state, fetch local governments for that state
      if (locationDetails.state) {
        try {
          localGovernments = await fetchLocalGovernmentsByState(locationDetails.state, signal)

          // If we also have user's local government, fetch localities
          if (locationDetails.localGovernment && localGovernments.length > 0) {
            localities = await fetchLocalitiesByLG(locationDetails.localGovernment, locationDetails.state, signal)
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            console.log("🚫 Request aborted")
            return
          }
          console.error("Error fetching user-specific locations:", error)
          // Continue with just states if user-specific data fails
        }
      }

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setDeliveryData({
          states,
          localGovernments,
          localities,
        })

        // Update refs
        lastLocationRef.current = locationKey
        isInitializedRef.current = true

        console.log("✅ Delivery locations loaded successfully")
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("🚫 Request aborted")
        return
      }

      console.error("Error loading delivery locations:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load delivery locations"

      if (isMountedRef.current) {
        setError(errorMessage)

        // Set fallback data
        setDeliveryData({
          states: [],
          localGovernments: [
            { id: "1", name: "Surulere" },
            { id: "2", name: "Ajeromi-Ifelodun" },
            { id: "3", name: "Ikeja" },
            { id: "4", name: "Lekki" },
            { id: "5", name: "Victoria Island" },
            { id: "6", name: "Yaba" },
          ],
          localities: [],
        })
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  // Load locations when component mounts or when user's location changes
  useEffect(() => {
    // Create location key for comparison
    const locationKey = `${locationDetails.state}-${locationDetails.localGovernment}-${locationDetails.locality}`

    // Only load if location has actually changed or not initialized
    if (!isInitializedRef.current || lastLocationRef.current !== locationKey) {
      // Use a small delay to debounce rapid changes
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          loadDeliveryLocations()
        }
      }, 100)

      // Cleanup function
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [locationDetails.state, locationDetails.localGovernment, locationDetails.locality]) // Only depend on actual values

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Function to refresh locations (useful for manual refresh)
  const refreshLocations = () => {
    // Clear cache for fresh data
    apiCache.clear()
    promiseCache.clear()
    isInitializedRef.current = false
    lastLocationRef.current = ""
    console.log("🗑️ Cache cleared, refreshing locations...")
    loadDeliveryLocations()
  }

  return {
    deliveryData,
    isLoading,
    error,
    refreshLocations,
  }
}
