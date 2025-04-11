// src/hooks/useAddressAutocomplete.ts
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useState, useEffect } from "react";

interface AddressSuggestion {
  description: string;
  place_id: string;
  details: {
    formattedAddress: string;
    city: string;
    state: string;
    localGovernment: string;
  } | null;
}

interface AutocompleteResponse {
  status: string;
  predictions: AddressSuggestion[];
}

const fetchAddressSuggestions = async (input: string): Promise<AutocompleteResponse> => {
  if (!input.trim()) {
    return { status: "OK", predictions: [] };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/autocomplete?input=${encodeURIComponent(input)}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch address suggestions");
  }

  return response.json();
};

export const useAddressAutocomplete = () => {
  const [input, setInput] = useState<string>("");
  const [debouncedInput, setDebouncedInput] = useState<string>("");

  // Debounce the input to avoid excessive API calls
  const debounceInput = debounce((value: string) => {
    setDebouncedInput(value);
  }, 300);

  useEffect(() => {
    debounceInput(input);
    return () => {
      debounceInput.cancel();
    };
  }, [input]);

  const { data, isLoading, error } = useQuery<AutocompleteResponse, Error>({
    queryKey: ["addressSuggestions", debouncedInput],
    queryFn: () => fetchAddressSuggestions(debouncedInput),
    enabled: !!debouncedInput, // Only fetch if there’s a debounced input
  });

  return {
    input,
    setInput,
    suggestions: data?.predictions || [],
    loading: isLoading,
    error: error?.message || null,
  };
};