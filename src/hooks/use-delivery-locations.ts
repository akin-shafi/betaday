"use client"

import { useState, useEffect, useCallback } from "react"
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

export function useDeliveryLocations() {
  const { locationDetails } = useAddress()
  const [deliveryData, setDeliveryData] = useState<DeliveryLocationData>({
    states: [],
    localGovernments: [],
    localities: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to get the correct base URL
  const getBaseUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname

      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
      }

      return process.env.NEXT_PUBLIC_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8500`
    }

    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
  }, [])

  // Function to fetch states
  const fetchStates = useCallback(async (): Promise<DeliveryLocation[]> => {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/delivery-locations/states`)

    if (!response.ok) {
      throw new Error(`Failed to fetch states: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error("Invalid states data received")
    }

    return data.data.map((state: ApiState) => ({
      id: state.id.toString(),
      name: state.name,
    }))
  }, [getBaseUrl])

  // Function to fetch local governments by state name
  const fetchLocalGovernmentsByState = useCallback(
    async (stateName: string): Promise<DeliveryLocation[]> => {
      const baseUrl = getBaseUrl()

      // First, get all states to find the state ID
      const statesResponse = await fetch(`${baseUrl}/delivery-locations/states`)
      if (!statesResponse.ok) {
        throw new Error(`Failed to fetch states: ${statesResponse.status}`)
      }

      const statesData = await statesResponse.json()
      if (!statesData.success || !Array.isArray(statesData.data)) {
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
      const lgResponse = await fetch(`${baseUrl}/delivery-locations/states/${targetState.id}/local-governments`)

      if (!lgResponse.ok) {
        throw new Error(`Failed to fetch local governments: ${lgResponse.status}`)
      }

      const lgData = await lgResponse.json()

      if (!lgData.success || !Array.isArray(lgData.data)) {
        throw new Error("Invalid local governments data received")
      }

      return lgData.data.map((lg: ApiLocalGovernment) => ({
        id: lg.id.toString(),
        name: lg.name,
      }))
    },
    [getBaseUrl],
  )

  // Function to fetch localities by local government name
  const fetchLocalitiesByLG = useCallback(
    async (lgName: string, stateName: string): Promise<DeliveryLocation[]> => {
      const baseUrl = getBaseUrl()

      try {
        // Get all local governments to find the LG ID
        const lgResponse = await fetch(`${baseUrl}/delivery-locations/local-governments`)
        if (!lgResponse.ok) {
          throw new Error(`Failed to fetch local governments: ${lgResponse.status}`)
        }

        const lgData = await lgResponse.json()
        if (!lgData.success || !Array.isArray(lgData.data)) {
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
        const localitiesResponse = await fetch(
          `${baseUrl}/delivery-locations/local-governments/${targetLG.id}/localities`,
        )

        if (!localitiesResponse.ok) {
          throw new Error(`Failed to fetch localities: ${localitiesResponse.status}`)
        }

        const localitiesData = await localitiesResponse.json()

        if (!localitiesData.success || !Array.isArray(localitiesData.data)) {
          throw new Error("Invalid localities data received")
        }

        return localitiesData.data.map((locality: ApiLocality) => ({
          id: locality.id.toString(),
          name: locality.name,
        }))
      } catch (error) {
        console.error("Error fetching localities:", error)
        return []
      }
    },
    [getBaseUrl],
  )

  // Main function to load delivery locations
  const loadDeliveryLocations = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Always fetch states
      const states = await fetchStates()

      let localGovernments: DeliveryLocation[] = []
      let localities: DeliveryLocation[] = []

      // If we have user's state, fetch local governments for that state
      if (locationDetails.state) {
        try {
          localGovernments = await fetchLocalGovernmentsByState(locationDetails.state)

          // If we also have user's local government, fetch localities
          if (locationDetails.localGovernment && localGovernments.length > 0) {
            localities = await fetchLocalitiesByLG(locationDetails.localGovernment, locationDetails.state)
          }
        } catch (error) {
          console.error("Error fetching user-specific locations:", error)
          // Continue with just states if user-specific data fails
        }
      }

      setDeliveryData({
        states,
        localGovernments,
        localities,
      })
    } catch (err) {
      console.error("Error loading delivery locations:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load delivery locations"
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
    } finally {
      setIsLoading(false)
    }
  }, [
    locationDetails.state,
    locationDetails.localGovernment,
    fetchStates,
    fetchLocalGovernmentsByState,
    fetchLocalitiesByLG,
  ])

  // Load locations when component mounts or when user's location changes
  useEffect(() => {
    loadDeliveryLocations()
  }, [loadDeliveryLocations])

  // Function to refresh locations (useful for manual refresh)
  const refreshLocations = useCallback(() => {
    loadDeliveryLocations()
  }, [loadDeliveryLocations])

  return {
    deliveryData,
    isLoading,
    error,
    refreshLocations,
  }
}
