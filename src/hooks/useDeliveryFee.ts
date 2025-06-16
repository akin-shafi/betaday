"use client"

import { useState, useCallback } from "react"
import { getSessionToken } from "@/utils/session"

interface Coordinates {
  lat: number
  lng: number
}

interface AddressData {
  address: string
  coordinates: Coordinates
  localGovernmentId: string
}

interface FeeBreakdown {
  baseFee: number
  distanceFee: number
  dynamicAdjustment: number
  isSurge: boolean
}

interface DeliveryFeeData {
  deliveryFee: number
  currency: string
  distanceInKm: string
  breakdown: FeeBreakdown
  pickupZone: string
  dropoffZone: string
}

interface UseDeliveryFeeReturn {
  feeData: DeliveryFeeData | null
  isCalculating: boolean
  error: string | null
  missingLocationError: { pickup?: boolean; dropoff?: boolean } | null
  calculateFee: (pickup: AddressData, dropoff: AddressData) => Promise<void>
  clearFee: () => void
}

export const useDeliveryFee = (): UseDeliveryFeeReturn => {
  const [feeData, setFeeData] = useState<DeliveryFeeData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [missingLocationError, setMissingLocationError] = useState<{ pickup?: boolean; dropoff?: boolean } | null>(null)

  const calculateFee = useCallback(async (pickup: AddressData, dropoff: AddressData): Promise<void> => {
    // Clear previous errors
    setError(null)
    setMissingLocationError(null)

    // Check for missing location data
    const locationErrors: { pickup?: boolean; dropoff?: boolean } = {}

    if (!pickup.coordinates || !pickup.localGovernmentId) {
      locationErrors.pickup = true
    }

    if (!dropoff.coordinates || !dropoff.localGovernmentId) {
      locationErrors.dropoff = true
    }

    if (Object.keys(locationErrors).length > 0) {
      setMissingLocationError(locationErrors)
      console.log("Missing location data:", { pickup: pickup.localGovernmentId, dropoff: dropoff.localGovernmentId })
      return
    }

    // Create a unique key for this calculation to prevent duplicate calls
    const calculationKey = `${pickup.coordinates.lat}-${pickup.coordinates.lng}-${pickup.localGovernmentId}-${dropoff.coordinates.lat}-${dropoff.coordinates.lng}-${dropoff.localGovernmentId}`

    console.log("Calculating delivery fee for:", { pickup, dropoff, calculationKey })

    setIsCalculating(true)

    try {
      const token = getSessionToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fees/package`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          pickup: {
            coordinates: {
              lat: pickup.coordinates.lat,
              lng: pickup.coordinates.lng,
            },
            localGovernmentId: pickup.localGovernmentId,
          },
          dropoff: {
            coordinates: {
              lat: dropoff.coordinates.lat,
              lng: dropoff.coordinates.lng,
            },
            localGovernmentId: dropoff.localGovernmentId,
          },
        }),
      })

      const result = await response.json()
      console.log("Fee calculation response:", result)

      if (!response.ok) {
        throw new Error(result.error || "Failed to calculate delivery fee")
      }

      if (result.status === "success" && result.data) {
        setFeeData(result.data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Error calculating delivery fee:", err)
      setError(err instanceof Error ? err.message : "Failed to calculate delivery fee")
    } finally {
      setIsCalculating(false)
    }
  }, [])

  const clearFee = useCallback(() => {
    setFeeData(null)
    setError(null)
    setMissingLocationError(null)
  }, [])

  return {
    feeData,
    isCalculating,
    error,
    missingLocationError,
    calculateFee,
    clearFee,
  }
}
