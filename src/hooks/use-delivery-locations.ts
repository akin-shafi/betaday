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

const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const loadingStates = new Map<string, boolean>()

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

  const abortControllerRef = useRef<AbortController | null>(null)
  const lastLocationRef = useRef<string>("")
  const isInitializedRef = useRef(false)
  const isMountedRef = useRef(true)

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

  const getCachedData = (key: string) => {
    const cached = apiCache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return null
  }

  const setCachedData = (key: string, data: any) => {
    apiCache.set(key, { data, timestamp: Date.now() })
  }

  const fetchWithCache = async (url: string, cacheKey: string, signal?: AbortSignal) => {
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const existingPromise = promiseCache.get(cacheKey)
    if (existingPromise) {
      return await existingPromise
    }

    const promise = (async () => {
      try {
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

        setCachedData(cacheKey, data)

        return data
      } finally {
        promiseCache.delete(cacheKey)
      }
    })()

    promiseCache.set(cacheKey, promise)

    return await promise
  }

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

  const fetchLocalGovernmentsByState = async (stateName: string, signal?: AbortSignal): Promise<DeliveryLocation[]> => {
    const baseUrl = getBaseUrl()

    try {
      const statesData = await fetchWithCache(`${baseUrl}/delivery-locations/states`, "states", signal)

      if (!statesData?.success || !Array.isArray(statesData.data)) {
        throw new Error("Invalid states data received")
      }

      const targetState = statesData.data.find(
        (state: ApiState) => state.name.toLowerCase() === stateName.toLowerCase(),
      )

      if (!targetState) {
        return []
      }

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

  const fetchLocalitiesByLG = async (
    lgName: string,
    stateName: string,
    signal?: AbortSignal,
  ): Promise<DeliveryLocation[]> => {
    const baseUrl = getBaseUrl()
    const cacheKey = `localities-${stateName.toLowerCase()}-${lgName.toLowerCase()}`

    try {
      const cachedData = getCachedData(cacheKey)
      if (cachedData) {
        return cachedData
      }

      const lgCacheKey = "all-lgs"
      const lgData = await fetchWithCache(`${baseUrl}/delivery-locations/local-governments`, lgCacheKey, signal)

      if (!lgData?.success || !Array.isArray(lgData.data)) {
        throw new Error("Invalid local governments data received")
      }

      const targetLG = lgData.data.find(
        (lg: ApiLocalGovernment) =>
          lg.name.toLowerCase() === lgName.toLowerCase() && lg.state.name.toLowerCase() === stateName.toLowerCase(),
      )

      if (!targetLG) {
        return []
      }

      const localitiesUrl = `${baseUrl}/delivery-locations/local-governments/${targetLG.id}/localities`
      const localitiesData = await fetchWithCache(localitiesUrl, cacheKey, signal)

      if (!localitiesData?.success || !Array.isArray(localitiesData.data)) {
        throw new Error("Invalid localities data received")
      }

      const localities = localitiesData.data.map((locality: ApiLocality) => ({
        id: locality.id.toString(),
        name: locality.name,
      }))

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

  const loadDeliveryLocations = async () => {
    const locationKey = `${locationDetails.state}-${locationDetails.localGovernment}-${locationDetails.locality}`

    if (isInitializedRef.current && lastLocationRef.current === locationKey) {
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsLoading(true)
    setError(null)

    try {
      const states = await fetchStates(signal)

      let localGovernments: DeliveryLocation[] = []
      let localities: DeliveryLocation[] = []

      if (locationDetails.state) {
        try {
          localGovernments = await fetchLocalGovernmentsByState(locationDetails.state, signal)

          if (locationDetails.localGovernment && localGovernments.length > 0) {
            localities = await fetchLocalitiesByLG(locationDetails.localGovernment, locationDetails.state, signal)
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return
          }
          console.error("Error fetching user-specific locations:", error)
        }
      }

      if (isMountedRef.current) {
        setDeliveryData({
          states,
          localGovernments,
          localities,
        })

        lastLocationRef.current = locationKey
        isInitializedRef.current = true
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return
      }

      console.error("Error loading delivery locations:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load delivery locations"

      if (isMountedRef.current) {
        setError(errorMessage)

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

  useEffect(() => {
    const locationKey = `${locationDetails.state}-${locationDetails.localGovernment}-${locationDetails.locality}`

    if (!isInitializedRef.current || lastLocationRef.current !== locationKey) {
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          loadDeliveryLocations()
        }
      }, 100)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [locationDetails.state, locationDetails.localGovernment, locationDetails.locality])

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const refreshLocations = () => {
    apiCache.clear()
    promiseCache.clear()
    isInitializedRef.current = false
    lastLocationRef.current = ""
    loadDeliveryLocations()
  }

  return {
    deliveryData,
    isLoading,
    error,
    refreshLocations,
  }
}