/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useQuery } from "@tanstack/react-query"
import { debounce } from "lodash"
import { useState, useEffect, useCallback } from "react"

interface AddressSuggestion {
  description: string
  place_id: string
  details: {
    formattedAddress: string
    city: string
    state: string
    localGovernment: string
    locality?: string
    latitude?: number
    longitude?: number
  } | null
}

interface AutocompleteResponse {
  status: string
  predictions: AddressSuggestion[]
}

const fetchAddressSuggestions = async (input: string): Promise<AutocompleteResponse> => {
  if (!input.trim()) {
    return { status: "OK", predictions: [] }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/autocomplete?input=${encodeURIComponent(input)}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(errorData.error || "Failed to fetch address suggestions")
  }

  return response.json()
}

export const useAddressAutocomplete = () => {
  const [input, setInput] = useState<string>("")
  const [debouncedInput, setDebouncedInput] = useState<string>("")

  // Create a memoized debounce function
  const debouncedSetInput = useCallback(
    debounce((value: string) => {
      setDebouncedInput(value)
    }, 300),
    [],
  )

  // Update debounced value when input changes
  useEffect(() => {
    debouncedSetInput(input)
    return () => {
      debouncedSetInput.cancel()
    }
  }, [input, debouncedSetInput])

  const { data, isLoading, error } = useQuery<AutocompleteResponse, Error>({
    queryKey: ["addressSuggestions", debouncedInput],
    queryFn: () => fetchAddressSuggestions(debouncedInput),
    enabled: debouncedInput.length > 2, // Only fetch if there's at least 3 characters
    retry: 1, // Only retry once on failure
    staleTime: 30000, // Cache results for 30 seconds
  })

  return {
    input,
    setInput,
    suggestions: data?.predictions || [],
    loading: isLoading,
    error: error?.message || null,
  }
}