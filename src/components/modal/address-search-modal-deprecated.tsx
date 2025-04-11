/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { X, Navigation, Flag, Loader2 } from "lucide-react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useAddress } from "@/contexts/address-context";
import { useCurrentLocation } from "@/utils/useCurrentLocation";
import Image from "next/image";

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWaitlist: (address: string) => void;
}

interface LocationDetails {
  street_number: string;
  route: string;
  sublocality: string;
  locality: string;
  localGovernment: string;
  administrative_area: string;
  country: string;
  formattedAddress: string;
}

export default function AddressSearchModal({
  isOpen,
  onClose,
  onJoinWaitlist,
}: AddressSearchModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExplicitlyFetching, setIsExplicitlyFetching] = useState(false);
  const { setAddress } = useAddress();
  const {
    address: currentLocationAddress,
    coordinates: currentLocationCoords,
    locationDetails: currentLocationDetails,
    error: locationError,
    fetchCurrentLocation,
  } = useCurrentLocation({ skipInitialFetch: true });
  const inputRef = useRef<HTMLInputElement>(null);
  const [undeliverableAddress, setUndeliverableAddress] = useState<string>("");

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "NG" },
    },
    debounce: 300,
  });

  useEffect(() => {
    if (isOpen) {
      // Only prefetch location, don't focus input automatically
      const prefetchLocation = async () => {
        try {
          fetchCurrentLocation();
        } catch (err: unknown) {
          console.error("Error prefetching location:", err);
        }
      };

      prefetchLocation();

      // Blur the input if it has focus when showing error
      if (error && inputRef.current) {
        inputRef.current.blur();
      }
    }
  }, [isOpen, fetchCurrentLocation, error]);

  const handleAddressSelect = async (suggestion: any) => {
    const description = suggestion.description;
    setValue(description, false);
    clearSuggestions();
    setError(null);

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      const place = results[0];

      const locationDetails = extractLocationDetails(place.address_components);
      const formattedAddress = place.formatted_address || description;

      if (locationDetails.administrative_area !== "Lagos") {
        setUndeliverableAddress(formattedAddress);
        setError("We don't deliver to your location yet.");
        return;
      }

      setIsVerifying(true);
      const isDeliverable = await verifyDeliveryZone(locationDetails);
      setIsVerifying(false);

      if (!isDeliverable) {
        setUndeliverableAddress(formattedAddress);
        setError(
          `We don't deliver to ${
            locationDetails.formattedAddress || description
          } yet.`
        );
        return;
      }

      const newLocationData = {
        address: formattedAddress,
        coordinates: { latitude: lat, longitude: lng },
        locationDetails: {
        state: locationDetails.administrative_area,
        localGovernment: locationDetails.localGovernment,
        locality: locationDetails.locality,
        },
      };

      setAddress(formattedAddress, {
        coordinates: newLocationData.coordinates,
        locationDetails: newLocationData.locationDetails,
        source: "manual",
      });

      onClose();
      document.dispatchEvent(
        new CustomEvent("addressChanged", { detail: newLocationData })
      );
    } catch (err) {
      setIsVerifying(false);
      setError("Error processing address. Please try again.");
      console.error("Address selection error:", err);
    }
  };

  const extractLocationDetails = (
    addressComponents: google.maps.GeocoderAddressComponent[] = []
  ): LocationDetails => {
    const details: LocationDetails = {
      street_number: "",
      route: "",
      sublocality: "",
      locality: "",
      localGovernment: "",
      administrative_area: "",
      country: "",
      formattedAddress: "",
    };

    addressComponents.forEach((component) => {
      if (component.types.includes("street_number"))
        details.street_number = component.long_name;
      if (component.types.includes("route"))
        details.route = component.long_name;
      if (
        component.types.includes("sublocality") ||
        component.types.includes("sublocality_level_1")
      )
        details.sublocality = component.long_name;
      if (component.types.includes("locality"))
        details.locality = component.long_name;
      if (component.types.includes("administrative_area_level_2"))
        details.localGovernment = component.long_name;
      if (component.types.includes("administrative_area_level_1"))
        details.administrative_area = component.long_name;
      if (component.types.includes("country"))
        details.country = component.long_name;
    });

    details.formattedAddress = [
      details.street_number ? `${details.street_number}` : "",
      details.route,
      details.sublocality ? `off ${details.sublocality}` : "",
      details.locality,
      details.administrative_area,
    ]
      .filter(Boolean)
      .join(", ");

    return details;
  };

  const verifyDeliveryZone = async (locationDetails: LocationDetails) => {
    try {
      const response = await fetch("/api/verify-delivery-zone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: locationDetails.administrative_area,
          localGovernment: locationDetails.localGovernment,
          locality: locationDetails.locality,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Delivery zone verification failed");
      return data.isDeliverable;
    } catch (error) {
      console.error("Error verifying delivery zone:", error);
      return false;
    }
  };

  const handleSearch = (input: string) => {
    setValue(input);
    setError(null);
    setIsVerifying(false);
  };

  const handleJoinWaitlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event bubbling
    if (inputRef.current) {
      inputRef.current.blur(); // Ensure input loses focus
    }
    // Small delay to ensure input blur happens before modal transition
    setTimeout(() => {
      onJoinWaitlist(undeliverableAddress);
    }, 50);
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsExplicitlyFetching(true);
      setError(null);

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

      if (currentLocationDetails.state !== "Lagos") {
        setUndeliverableAddress(currentLocationAddress);
        setError("We don't deliver to your location yet.");
        return;
      }

      setIsVerifying(true);
      const isDeliverable = await verifyDeliveryZone({
        administrative_area: currentLocationDetails.state,
        localGovernment: currentLocationDetails.localGovernment,
        locality: currentLocationDetails.locality,
        street_number: "",
        route: "",
        sublocality: "",
        country: "Nigeria",
        formattedAddress: currentLocationAddress,
      });
      setIsVerifying(false);

      if (!isDeliverable) {
        setUndeliverableAddress(currentLocationAddress);
        setError(`We don't deliver to ${currentLocationAddress} yet.`);
        return;
      }

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
    } catch (err) {
      console.error("Error getting current location:", err);
      setError(
        "Could not get your current location. Please try again or enter address manually."
      );
    } finally {
      setIsExplicitlyFetching(false);
      setIsVerifying(false);
    }
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-opacity z-[100] flex items-start justify-center animate-in fade-in duration-300">
      <div className="bg-white  w-full h-full relative flex flex-col animate-in slide-in-from-bottom duration-500">
        <button
          onClick={onClose}
          className="absolute right-4 top-4  cursor-pointer   text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full z-60"
        >
          <X size={24} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-black">
            Add a delivery address
          </h2>

          <div
            className="relative mb-4 bg-gray-50 rounded-lg"
            onClick={handleInputClick}
          >
            <Flag
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f15736]"
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a new address"
              value={value}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={!ready || isVerifying}
              className="w-full pl-10 pr-4 py-4 bg-transparent border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15736] text-black placeholder-gray-500 disabled:opacity-50"
              autoComplete="off"
            />
            {status === "OK" && data.length > 0 && !isVerifying && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-[100]">
                {data.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => handleAddressSelect(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none text-black border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-black">
                      {suggestion.structured_formatting?.main_text ||
                        suggestion.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.structured_formatting?.secondary_text || ""}
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
          {!ready && (
            <div className="flex items-center justify-center gap-2 text-gray-500 my-4">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading address suggestions...</span>
            </div>
          )}
          {isVerifying && (
            <div className="flex items-center justify-center gap-2 text-gray-500 my-4">
              <Loader2 className="animate-spin" size={20} />
              <span>Validating delievery zone...</span>
            </div>
          )}
          {error && !isVerifying && (
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
                We don&apos;t deliver to that location yet
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                You can get notified when we are live in your city by joining
                our waitlist
              </p>
              <button
                type="button" // Explicitly set button type
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
