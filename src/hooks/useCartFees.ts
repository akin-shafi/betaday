/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getSessionToken } from "@/utils/session"
import type { CartState } from "@/contexts/cart-context"
import type { LocationDetails, Coordinates } from "@/contexts/address-context"

interface FeeCalculationPayload {
  businessId: string
  deliveryAddress: {
    street: string
    city: string
    state: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  numPacks: number
  orderValue: number
  localGovernmentId?: string
}

export function useCartFees(
  state: CartState,
  contextAddress: string | null,
  locationDetails: LocationDetails | null,
  coordinates: Coordinates | null,
  businessId: string,
  calculateSubtotal: () => number,
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const token = getSessionToken()

  const [deliveryFee, setDeliveryFee] = useState(0)
  const [serviceFee, setServiceFee] = useState(0)
  const [isCalculatingFees, setIsCalculatingFees] = useState(false)
  const [feeError, setFeeError] = useState<string | null>(null)

  // Add a ref to track the previous values to prevent unnecessary API calls
  const prevStateRef = useRef<{
    packs: number
    items: number
    address: string | null
    subtotal: number
    businessId: string
  }>({
    packs: 0,
    items: 0,
    address: null,
    subtotal: 0,
    businessId: "",
  })

  // Add debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Memoize the calculateFees function to prevent recreating it on every render
  const calculateFees = useCallback(async () => {
    // Validate required data
    if (
      !state ||
      !state.packs ||
      state.packs.length === 0 ||
      !contextAddress ||
      !coordinates ||
      coordinates.latitude == null ||
      coordinates.longitude == null ||
      !businessId ||
      businessId === "unknown"
    ) {
      const errorMessage = !businessId || businessId === "unknown"
        ? "Invalid business information. Please select a valid vendor."
        : "Missing required data for fee calculation";
      setFeeError(errorMessage);
      setDeliveryFee(0);
      setServiceFee(0);
      return;
    }

    // Get current values for comparison
    const currentPacks = state.packs.length
    const currentItems = state.packs.reduce((acc, pack) => {
      return acc + pack.items.reduce((sum, item) => sum + item.quantity, 0)
    }, 0)
    const currentSubtotal = calculateSubtotal()

    // Check if anything has changed to avoid unnecessary API calls
    const prevState = prevStateRef.current
    if (
      prevState.packs === currentPacks &&
      prevState.items === currentItems &&
      prevState.address === contextAddress &&
      prevState.subtotal === currentSubtotal &&
      prevState.businessId === businessId
    ) {
      console.log("Skipping fee calculation - no changes detected")
      return
    }

    // Update the previous state ref
    prevStateRef.current = {
      packs: currentPacks,
      items: currentItems,
      address: contextAddress,
      subtotal: currentSubtotal,
      businessId,
    }

    setIsCalculatingFees(true)
    setFeeError(null)

    try {
      // Extract location details for fee calculation
      const city = locationDetails?.locality || locationDetails?.localGovernment || ""
      const stateValue = locationDetails?.state || ""

      // Create the payload structure
      const payload: FeeCalculationPayload = {
        businessId,
        deliveryAddress: {
          street: contextAddress,
          city,
          state: stateValue,
          coordinates: {
            lat: coordinates.latitude,
            lng: coordinates.longitude,
          },
        },
        numPacks: state.packs.length,
        orderValue: currentSubtotal,
        ...(locationDetails?.localGovernment &&
          locationDetails.localGovernment !== "" && {
            localGovernmentId: locationDetails.localGovernment,
          }),
      }

      // console.log("Calculating fees with payload:", payload)

      const response = await fetch(`${baseUrl}/api/fees/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = errorData.error || "Failed to calculate fees";
        if (response.status === 404) {
          if (errorMessage.includes("business")) {
            errorMessage = "Invalid business information. Please select a valid vendor.";
          } else if (errorMessage.includes("local government")) {
            errorMessage = "Invalid delivery zone. Please select a valid address.";
          }
        } else if (response.status === 400) {
          errorMessage = `${errorMessage} Please contact admin.`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json()
      // console.log("Fee calculation response:", data)

      if (data && data.data) {
        setDeliveryFee(data.data.deliveryFee || 0)
        setServiceFee(data.data.serviceFee || 0)
      } else {
        throw new Error("Invalid fee calculation response");
      }
    } catch (error: any) {
      console.error("Error calculating fees:", error)
      setFeeError(error.message || "Failed to calculate fees")
    } finally {
      setIsCalculatingFees(false)
    }
  }, [state, contextAddress, locationDetails, coordinates, businessId, calculateSubtotal, baseUrl, token])

  // Use a debounced effect to prevent too many API calls
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Make sure state exists and is initialized before accessing its properties
    if (
      state &&
      state.packs &&
      state.packs.length > 0 &&
      contextAddress &&
      coordinates &&
      coordinates.latitude != null &&
      coordinates.longitude != null &&
      businessId &&
      businessId !== "unknown"
    ) {
      // Set a new timer to call calculateFees after a delay
      debounceTimerRef.current = setTimeout(() => {
        calculateFees()
      }, 500) // 500ms debounce
    } else {
      // Reset fees when cart is empty or data is incomplete
      setDeliveryFee(0)
      setServiceFee(0)
      setFeeError(
        businessId === "unknown"
          ? "Invalid business information. Please select a valid vendor."
          : "Missing required data for fee calculation"
      );
    }

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [state, contextAddress, coordinates, businessId, calculateFees])

  return {
    deliveryFee,
    serviceFee,
    isCalculatingFees,
    feeError,
    calculateFees,
  }
}