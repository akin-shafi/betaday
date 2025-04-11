/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useRef, useState } from "react";
import { X, Navigation, Flag, Loader2 } from "lucide-react";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { useAddressVerification } from "@/hooks/useAddressVerification";
import { useAddress } from "@/contexts/address-context";
import { useCurrentLocation } from "@/utils/useCurrentLocation";
import Image from "next/image";

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWaitlist: (address: string) => void;
}

export default function AddressSearchModal({
  isOpen,
  onClose,
  onJoinWaitlist,
}: AddressSearchModalProps) {
  const [undeliverableAddress, setUndeliverableAddress] = useState<string>("");
  const { setAddress } = useAddress();
  const {
    input,
    setInput,
    suggestions,
    loading: suggestionsLoading,
    error: autocompleteError,
  } = useAddressAutocomplete();
  const {
    isDeliverable,
    error: verificationError,
    isVerifying,
    verifyAddress,
  } = useAddressVerification();
  const {
    address: currentLocationAddress,
    coordinates: currentLocationCoords,
    locationDetails: currentLocationDetails,
    error: locationError,
    fetchCurrentLocation,
  } = useCurrentLocation({ skipInitialFetch: true });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExplicitlyFetching, setIsExplicitlyFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const prefetchLocation = async () => {
        try {
          fetchCurrentLocation();
        } catch (err: unknown) {
          console.error("Error prefetching location:", err);
        }
      };
      prefetchLocation();
    }
  }, [isOpen, fetchCurrentLocation]);

  const handleAddressSelect = async (suggestion: {
    description: string;
    details: {
      formattedAddress: string;
      state?: string;
      localGovernment?: string;
      locality?: string;
    } | null;
  }) => {
    const address =
      suggestion.details?.formattedAddress || suggestion.description;
    await verifyAddress(address, suggestion.details || undefined);

    if (isDeliverable) {
      const newLocationData = {
        address,
        coordinates: { latitude: 0, longitude: 0 }, // Placeholder; update if backend provides coords
        locationDetails: {
          state: suggestion.details?.state || "Lagos",
          localGovernment: suggestion.details?.localGovernment || "",
          locality: suggestion.details?.locality || "",
        },
      };
      setAddress(address, {
        coordinates: newLocationData.coordinates,
        locationDetails: newLocationData.locationDetails,
        source: "manual",
      });
      onClose();
      document.dispatchEvent(
        new CustomEvent("addressChanged", { detail: newLocationData })
      );
    } else {
      setUndeliverableAddress(address);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsExplicitlyFetching(true);
      if (
        !currentLocationAddress ||
        !currentLocationCoords ||
        !currentLocationDetails
      ) {
        await fetchCurrentLocation();
      }
      if (
        !currentLocationAddress ||
        !currentLocationCoords ||
        !currentLocationDetails
      ) {
        throw new Error("Could not get your current location");
      }

      await verifyAddress(currentLocationAddress, {
        state: currentLocationDetails.state,
        localGovernment: currentLocationDetails.localGovernment,
        locality: currentLocationDetails.locality,
        formattedAddress: currentLocationAddress,
      });

      if (isDeliverable) {
        setAddress(currentLocationAddress, {
          coordinates: currentLocationCoords,
          locationDetails: currentLocationDetails,
          source: "currentLocation",
        });
        document.dispatchEvent(
          new CustomEvent("addressChanged", {
            detail: {
              address: currentLocationAddress,
              coordinates: currentLocationCoords,
              locationDetails: currentLocationDetails,
            },
          })
        );
        onClose();
      } else {
        setUndeliverableAddress(currentLocationAddress);
      }
    } catch (err) {
      console.error("Error getting current location:", err);
      // verificationError("Could not get your current location. Please try again or enter address manually.");
    } finally {
      setIsExplicitlyFetching(false);
    }
  };

  const handleJoinWaitlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) inputRef.current.blur();
    setTimeout(() => onJoinWaitlist(undeliverableAddress), 50);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-opacity z-[100] flex items-start justify-center animate-in fade-in duration-300">
      <div className="bg-white w-full h-full relative flex flex-col animate-in slide-in-from-bottom duration-500">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full z-60"
        >
          <X size={24} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-black">
            Add a delivery address
          </h2>

          <div className="relative mb-4 bg-gray-50 rounded-lg">
            <Flag
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f15736]"
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a new address"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isVerifying}
              className="w-full pl-10 pr-4 py-4 bg-transparent border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15736] text-black placeholder-gray-500 disabled:opacity-50"
              autoComplete="off"
            />
            {suggestions.length > 0 && !isVerifying && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-[100]">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => handleAddressSelect(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none text-black border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-black">
                      {suggestion.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 my-4" />

          <button
            onClick={handleUseCurrentLocation}
            disabled={isVerifying || isExplicitlyFetching}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 p-4 rounded-md cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-[#f15736] mb-2">
              {isExplicitlyFetching ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Navigation size={20} />
              )}
              <span className="font-medium">
                {isExplicitlyFetching
                  ? "Getting your location..."
                  : "Use your current location"}
              </span>
            </div>
            {currentLocationAddress && !isExplicitlyFetching && (
              <p className="text-gray-500 text-sm pl-7">
                {currentLocationAddress}
              </p>
            )}
            {locationError && !isExplicitlyFetching && (
              <p className="text-red-500 text-sm pl-7 mt-1">
                Error getting location. Please try again.
              </p>
            )}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto flex flex-col items-center justify-center">
          {suggestionsLoading && (
            <div className="flex items-center justify-center gap-2 text-gray-500 my-4">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading address suggestions...</span>
            </div>
          )}
          {isVerifying && (
            <div className="flex items-center justify-center gap-2 text-gray-500 my-4">
              <Loader2 className="animate-spin" size={20} />
              <span>Validating delivery zone...</span>
            </div>
          )}
          {(verificationError || autocompleteError) && !isVerifying && (
            <div className="flex flex-col items-center justify-center text-center my-4">
              <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
                <Image
                  src="/icons/empty_box.png"
                  alt="Delivery unavailable"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">
                We don't deliver to that location yet
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                You can get notified when we are live in your city by joining
                our waitlist
              </p>
              <button
                type="button"
                onClick={handleJoinWaitlistClick}
                className="bg-[#f15736] text-white px-6 py-2 rounded-full hover:bg-[#d8432c] transition-colors"
              >
                Join the waitlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
