/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useRef, useState } from "react";
import { X, Navigation, Flag, Loader2, MapPin, Clock } from "lucide-react";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { useCurrentLocation } from "@/utils/useCurrentLocation";
import { getSessionToken } from "@/utils/session";
import { useAuth } from "@/contexts/auth-context";

interface RecentAddress {
  id: string;
  address: string;
  type: "pickup" | "dropoff";
  createdAt: string;
  // Add location details
  state?: string;
  localGovernment?: string;
  locality?: string;
}

interface LocalAddress {
  id: string;
  address: string;
  type: "pickup" | "dropoff";
  createdAt: string;
  // Add location details
  state?: string;
  localGovernment?: string;
  locality?: string;
}

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (
    address: string,
    coordinates?: { lat: number; lng: number },
    localGovernmentId?: string
  ) => void;
  title: string;
  placeholder: string;
  requireVerification?: boolean;
  addressType?: "pickup" | "dropoff";
}

export default function AddressSelectionModal({
  isOpen,
  onClose,
  onAddressSelect,
  title,
  placeholder,
  requireVerification = false,
  addressType = "pickup",
}: AddressSelectionModalProps) {
  const { user } = useAuth();
  const [recentAddresses, setRecentAddresses] = useState<RecentAddress[]>([]);
  const [localAddresses, setLocalAddresses] = useState<LocalAddress[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Simple verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string>("");
  const [failedAddress, setFailedAddress] = useState<string>("");

  const {
    input,
    setInput,
    suggestions,
    loading: suggestionsLoading,
    error: autocompleteError,
  } = useAddressAutocomplete();

  const {
    address: currentLocationAddress,
    coordinates: currentLocationCoords,
    locationDetails: currentLocationDetails,
    isLoading: locationLoading,
    error: locationError,
    fetchCurrentLocation,
  } = useCurrentLocation({ skipInitialFetch: true });

  const inputRef = useRef<HTMLInputElement>(null);

  // Clear all states when modal opens
  useEffect(() => {
    if (isOpen) {
      setInput("");
      setShowSuggestions(false);
      setIsVerifying(false);
      setVerificationError("");
      setFailedAddress("");
    }
  }, [isOpen]);

  // Fetch recent addresses when modal opens
  useEffect(() => {
    if (isOpen) {
      if (user?.id) {
        fetchRecentAddresses();
      }
      loadLocalAddresses();
    }
  }, [isOpen, user?.id, addressType]);

  // Separate useEffect for current location
  useEffect(() => {
    if (isOpen) {
      fetchCurrentLocation();
    }
  }, [isOpen]);

  const fetchRecentAddresses = async () => {
    if (!user?.id) return;

    const token = getSessionToken();
    if (!token) {
      console.error("No session token available");
      return;
    }

    setLoadingRecent(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/address/${user.id}/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const addresses = await response.json();
        setRecentAddresses(addresses.slice(0, 5));
      } else {
        console.error("Failed to fetch addresses:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch recent addresses:", error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const loadLocalAddresses = () => {
    try {
      const stored = localStorage.getItem("jara_recent_addresses");
      if (stored) {
        const addresses = JSON.parse(stored) as LocalAddress[];
        const filteredAddresses = addresses
          .filter((addr) => addr.type === addressType)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 10);
        setLocalAddresses(filteredAddresses);
      }
    } catch (error) {
      console.error("Failed to load local addresses:", error);
    }
  };

  const saveToLocalStorage = (
    address: string,
    locationDetails?: {
      state?: string;
      localGovernment?: string;
      locality?: string;
    }
  ) => {
    try {
      const stored = localStorage.getItem("jara_recent_addresses");
      let addresses: LocalAddress[] = stored ? JSON.parse(stored) : [];

      const existingIndex = addresses.findIndex(
        (addr) => addr.address === address && addr.type === addressType
      );

      if (existingIndex >= 0) {
        // Update existing address with new location details
        addresses[existingIndex].createdAt = new Date().toISOString();
        if (locationDetails) {
          addresses[existingIndex].state = locationDetails.state;
          addresses[existingIndex].localGovernment =
            locationDetails.localGovernment;
          addresses[existingIndex].locality = locationDetails.locality;
        }
      } else {
        // Add new address with location details
        const newAddress: LocalAddress = {
          id: Date.now().toString(),
          address,
          type: addressType,
          createdAt: new Date().toISOString(),
          state: locationDetails?.state,
          localGovernment: locationDetails?.localGovernment,
          locality: locationDetails?.locality,
        };
        addresses.unshift(newAddress);
      }

      addresses = addresses.slice(0, 50);
      localStorage.setItem("jara_recent_addresses", JSON.stringify(addresses));
      loadLocalAddresses();
    } catch (error) {
      console.error("Failed to save address to local storage:", error);
    }
  };

  const deleteLocalAddress = (addressId: string) => {
    try {
      const stored = localStorage.getItem("jara_recent_addresses");
      if (stored) {
        let addresses = JSON.parse(stored) as LocalAddress[];
        addresses = addresses.filter((addr) => addr.id !== addressId);
        localStorage.setItem(
          "jara_recent_addresses",
          JSON.stringify(addresses)
        );
        loadLocalAddresses();
      }
    } catch (error) {
      console.error("Failed to delete local address:", error);
    }
  };

  // Extract location details from address string using Google Places API
  const extractLocationFromAddress = async (
    address: string
  ): Promise<{
    state?: string;
    localGovernment?: string;
    locality?: string;
  }> => {
    try {
      console.log("Extracting location details for:", address);

      // Use the autocomplete API to get detailed information about the address
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/autocomplete?input=${encodeURIComponent(address)}&details=true`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extract location details");
      }

      const data = await response.json();

      // Find the best match for the address
      const bestMatch = data.predictions?.find(
        (prediction: any) =>
          prediction.description
            .toLowerCase()
            .includes(address.toLowerCase()) ||
          address.toLowerCase().includes(prediction.description.toLowerCase())
      );

      if (bestMatch?.details) {
        console.log("Extracted location details:", bestMatch.details);
        return {
          state: bestMatch.details.state,
          localGovernment: bestMatch.details.localGovernment,
          locality: bestMatch.details.locality,
        };
      }

      // Fallback: try to extract state from address string
      const addressLower = address.toLowerCase();
      let state = "Lagos"; // Default fallback

      if (addressLower.includes("lagos")) state = "Lagos";
      else if (addressLower.includes("abuja")) state = "FCT";
      else if (addressLower.includes("kano")) state = "Kano";
      else if (addressLower.includes("rivers")) state = "Rivers";
      else if (addressLower.includes("ogun")) state = "Ogun";

      console.log("Using fallback location details:", { state });
      return { state };
    } catch (error) {
      console.error("Error extracting location details:", error);
      // Return default fallback
      return { state: "Lagos" };
    }
  };

  // Direct API verification function
  const verifyAddressWithAPI = async (
    address: string,
    details?: any
  ): Promise<boolean> => {
    // Skip verification for drop-off addresses
    if (!requireVerification || addressType !== "pickup") {
      return true;
    }

    // console.log("Starting API verification for:", address);
    // console.log("Using details:", details);

    setIsVerifying(true);
    setVerificationError("");
    setFailedAddress("");

    try {
      // If we don't have location details, try to extract them
      let locationDetails = details;
      if (!locationDetails?.state) {
        console.log("No location details provided, extracting from address...");
        locationDetails = await extractLocationFromAddress(address);
      }

      console.log("Final location details for verification:", locationDetails);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/delivery-zone`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state: locationDetails?.state || "Lagos",
            city:
              locationDetails?.localGovernment ||
              locationDetails?.locality ||
              "",
          }),
        }
      );

      const data = await response.json();
      console.log("API verification response:", data);

      if (!response.ok) {
        console.error("API verification failed:", data.message);
        setVerificationError(data.message || "Verification failed");
        setFailedAddress(address);
        return false;
      }

      if (!data.isDeliverable) {
        console.log("Address not deliverable:", address);
        setVerificationError(`We don't deliver from ${address} yet.`);
        setFailedAddress(address);
        return false;
      }

      console.log("Address verified successfully:", address);
      return true;
    } catch (error) {
      console.error("Verification API error:", error);
      setVerificationError("Error verifying address. Please try again.");
      setFailedAddress(address);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  // Complete address selection flow
  const completeAddressSelection = async (
    address: string,
    coordinates?: { lat: number; lng: number },
    details?: any
  ): Promise<void> => {
    console.log("Starting address selection for:", address, {
      coordinates,
      details,
    });

    // Fill input field
    setInput(address);
    setShowSuggestions(false);

    // Always verify through API
    const isValid = await verifyAddressWithAPI(address, details);

    if (!isValid) {
      console.log("Address verification failed, stopping flow");
      return; // Stop here if verification failed
    }

    console.log("Address verified, completing selection");

    // Save to local storage with location details
    saveToLocalStorage(address, {
      state: details?.state,
      localGovernment: details?.localGovernment,
      locality: details?.locality,
    });

    // Pass to parent with coordinates and localGovernmentId
    const localGovernmentId =
      details?.localGovernment ||
      details?.locality ||
      details?.state ||
      "Lagos";

    console.log("Calling onAddressSelect with:", {
      address,
      coordinates,
      localGovernmentId,
    });
    onAddressSelect(address, coordinates, localGovernmentId);
    onClose();
  };

  const handleSuggestionSelect = async (suggestion: {
    description: string;
    details: {
      formattedAddress: string;
      city: string;
      state: string;
      localGovernment: string;
      locality?: string;
      street?: string;
      latitude?: number;
      longitude?: number;
    } | null;
  }) => {
    console.log("Suggestion selected:", suggestion.description);
    const coordinates =
      suggestion.details?.latitude && suggestion.details?.longitude
        ? {
            lat: suggestion.details.latitude,
            lng: suggestion.details.longitude,
          }
        : undefined;

    await completeAddressSelection(suggestion.description, coordinates, {
      formattedAddress:
        suggestion.details?.formattedAddress || suggestion.description,
      state: suggestion.details?.state,
      localGovernment: suggestion.details?.localGovernment,
      locality: suggestion.details?.locality,
    });
  };

  const handleCurrentLocationSelect = async () => {
    if (currentLocationAddress && currentLocationCoords) {
      console.log("Current location selected:", currentLocationAddress);

      // Convert coordinates format from {latitude, longitude} to {lat, lng}
      const coordinates = {
        lat: currentLocationCoords.latitude,
        lng: currentLocationCoords.longitude,
      };

      await completeAddressSelection(currentLocationAddress, coordinates, {
        formattedAddress: currentLocationAddress,
        state: currentLocationDetails?.state,
        localGovernment: currentLocationDetails?.localGovernment,
        locality: currentLocationDetails?.locality,
      });
    }
  };

  const handleRecentAddressSelect = async (address: RecentAddress) => {
    console.log("Recent address selected:", address);

    // For recent addresses, we need to get coordinates if not available
    let coordinates: { lat: number; lng: number } | undefined;

    // Try to extract coordinates from the address using autocomplete API
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/autocomplete?input=${encodeURIComponent(
          address.address
        )}&details=true`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const bestMatch = data.predictions?.find(
          (prediction: any) =>
            prediction.description
              .toLowerCase()
              .includes(address.address.toLowerCase()) ||
            address.address
              .toLowerCase()
              .includes(prediction.description.toLowerCase())
        );

        if (bestMatch?.details?.latitude && bestMatch?.details?.longitude) {
          coordinates = {
            lat: bestMatch.details.latitude,
            lng: bestMatch.details.longitude,
          };
          console.log("Extracted coordinates for recent address:", coordinates);
        }
      }
    } catch (error) {
      console.error("Failed to extract coordinates for recent address:", error);
    }

    const locationDetails = {
      formattedAddress: address.address,
      state: address.state || "Lagos",
      localGovernment:
        address.localGovernment || address.locality || address.state || "Lagos",
      locality: address.locality,
    };

    await completeAddressSelection(
      address.address,
      coordinates,
      locationDetails
    );
  };

  const handleLocalAddressSelect = async (address: LocalAddress) => {
    console.log("Local address selected:", address);

    // For local addresses, we need to get coordinates if not available
    let coordinates: { lat: number; lng: number } | undefined;

    // Try to extract coordinates from the address using autocomplete API
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/autocomplete?input=${encodeURIComponent(
          address.address
        )}&details=true`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const bestMatch = data.predictions?.find(
          (prediction: any) =>
            prediction.description
              .toLowerCase()
              .includes(address.address.toLowerCase()) ||
            address.address
              .toLowerCase()
              .includes(prediction.description.toLowerCase())
        );

        if (bestMatch?.details?.latitude && bestMatch?.details?.longitude) {
          coordinates = {
            lat: bestMatch.details.latitude,
            lng: bestMatch.details.longitude,
          };
          console.log("Extracted coordinates for local address:", coordinates);
        }
      }
    } catch (error) {
      console.error("Failed to extract coordinates for local address:", error);
    }

    // For local addresses, we need to ensure we have location details
    const locationDetails = {
      formattedAddress: address.address,
      state: address.state || "Lagos", // Fallback to Lagos if no state
      localGovernment:
        address.localGovernment || address.locality || address.state || "Lagos",
      locality: address.locality,
    };

    await completeAddressSelection(
      address.address,
      coordinates,
      locationDetails
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white w-full h-full relative flex flex-col animate-in slide-in-from-bottom duration-500 sm:w-96 sm:h-auto sm:max-h-[90vh] sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative bg-gray-50 rounded-lg">
            <Flag
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A2E20]"
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowSuggestions(true);
                // Clear errors when typing
                setVerificationError("");
                setFailedAddress("");
              }}
              className="w-full pl-10 pr-10 py-3 bg-transparent border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 placeholder-gray-500"
              autoComplete="off"
            />

            {/* Clear button */}
            {input && (
              <button
                onClick={() => {
                  setInput("");
                  setShowSuggestions(false);
                  setVerificationError("");
                  setFailedAddress("");
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}

            {/* Loading indicator for suggestions */}
            {suggestionsLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {/* Address Suggestions */}
          {suggestions.length > 0 && showSuggestions && !isVerifying && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 ">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Autocomplete Error */}
          {autocompleteError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{autocompleteError}</p>
            </div>
          )}

          {/* Verification Loading */}
          {isVerifying && (
            <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">
                  Verifying delivery zone...
                </span>
              </div>
            </div>
          )}

          {/* Verification Error - Only show when there's an actual API error */}
          {verificationError && failedAddress && !isVerifying && (
            <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  We don't deliver from that location yet
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  We currently only offer pickup services in select areas.
                  Please choose a different pickup location.
                </p>
                <button
                  onClick={() => {
                    setVerificationError("");
                    setFailedAddress("");
                    setInput("");
                    setShowSuggestions(false);
                  }}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try another address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current Location - Only show for pickup addresses */}
        {addressType === "pickup" && (
          <div className="px-4 pb-4">
            <button
              onClick={handleCurrentLocationSelect}
              disabled={
                locationLoading || !currentLocationAddress || isVerifying
              }
              className={`w-full text-left bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-100`}
            >
              <div className="flex items-center space-x-3">
                {locationLoading || isVerifying ? (
                  <Loader2 className="w-5 h-5 animate-spin text-green-600 flex-shrink-0" />
                ) : (
                  <Navigation className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-green-800 mb-1">
                    {locationLoading
                      ? "Getting your location..."
                      : isVerifying
                      ? "Verifying location..."
                      : "Use current location"}
                  </p>
                  {currentLocationAddress &&
                    !locationLoading &&
                    !isVerifying && (
                      <p className="text-sm text-green-600 truncate-text">
                        {currentLocationAddress}
                      </p>
                    )}
                  {locationError && !locationLoading && !isVerifying && (
                    <p className="text-sm text-red-500">{locationError}</p>
                  )}
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Recent Addresses */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Recent addresses
            </h3>

            {loadingRecent ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">
                  Loading recent addresses...
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Backend addresses */}
                {user?.id && recentAddresses.length > 0 && (
                  <>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      From your account
                    </h4>
                    {recentAddresses.map((address) => (
                      <button
                        key={address.id}
                        onClick={() => handleRecentAddressSelect(address)}
                        disabled={isVerifying}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 disabled:opacity-50"
                      >
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate-text">
                              {address.address}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  address.type === "pickup"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {address.type === "pickup"
                                  ? "Pickup"
                                  : "Drop-off"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(address.createdAt)}
                              </span>
                              {/* Show location info if available */}
                              {address.state && (
                                <span className="text-xs text-gray-400">
                                  • {address.state}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {/* Local storage addresses */}
                {localAddresses.length > 0 && (
                  <>
                    {user?.id && recentAddresses.length > 0 && (
                      <div className="border-t border-gray-100 my-3"></div>
                    )}
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Recently used
                    </h4>
                    {localAddresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <button
                          onClick={() => handleLocalAddressSelect(address)}
                          disabled={isVerifying}
                          className="flex-1 flex items-start space-x-3 text-left disabled:opacity-50"
                        >
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate-text">
                              {address.address}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  address.type === "pickup"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {address.type === "pickup"
                                  ? "Pickup"
                                  : "Drop-off"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(address.createdAt)}
                              </span>
                              {/* Show location info if available */}
                              {address.state && (
                                <span className="text-xs text-gray-400">
                                  • {address.state}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLocalAddress(address.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                        >
                          <X className="w-3 h-3 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {/* No addresses message */}
                {(!user?.id || recentAddresses.length === 0) &&
                  localAddresses.length === 0 && (
                    <div className="text-center py-8">
                      <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No recent addresses
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
