/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Navigation, Loader2 } from "lucide-react";
import { useAddress } from "@/contexts/address-context";

interface CurrentLocationButtonProps {
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: string | null) => void;
}

export default function CurrentLocationButton({
  onLoadingChange,
  onError,
}: CurrentLocationButtonProps) {
  const { setAddress, setCoordinates } = useAddress();
  const [isLoading, setIsLoading] = useState(false);

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      throw new Error("Unable to find address");
    } catch (error) {
      throw new Error("Error fetching address");
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    onLoadingChange?.(true);
    onError?.(null);

    if (!navigator.geolocation) {
      onError?.("Geolocation is not supported by your browser");
      setIsLoading(false);
      onLoadingChange?.(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const fetchedAddress = await getAddressFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          setAddress(fetchedAddress);
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
          onLoadingChange?.(false);
        } catch (error) {
          onError?.("Error fetching your address");
          setIsLoading(false);
          onLoadingChange?.(false);
        }
      },
      (error) => {
        onError?.("Unable to retrieve your location");
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    );
  };

  return (
    <button
      onClick={handleGetCurrentLocation}
      disabled={isLoading}
      className="bg-[#f15736] text-white cursor-pointer rounded-full px-4 py-2 flex items-center justify-center text-sm hover:bg-[#d8432c] transition-colors disabled:opacity-70 w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Fetching...
        </>
      ) : (
        <>
          <Navigation className="h-4 w-4 mr-2" />
          Use current location
        </>
      )}
    </button>
  );
}
