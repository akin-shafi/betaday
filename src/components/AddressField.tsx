/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import AddressSearchModal from "./modal/address-search-modal";
import { useRouter } from "next/navigation";
import { useCurrentLocation } from "@/utils/useCurrentLocation";
import JoinWaitlistModal from "./modal/join-waitlist-modal";

export default function AddressField() {
  const {
    address: contextAddress,
    setAddress,
    setCoordinates,
    setLocationDetails,
    locationDetails,
  } = useAddress();

  const {
    address: currentLocationAddress,
    isLoading,
    error: locationError,
    fetchCurrentLocation,
    coordinates,
    locationDetails: currentLocationDetails,
  } = useCurrentLocation();

  const [inputAddress, setInputAddress] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [undeliverableAddress, setUndeliverableAddress] = useState("");
  const router = useRouter();

  // Set initial input value from context or current location
  useEffect(() => {
    if (contextAddress) {
      setInputAddress(contextAddress);
    } else if (currentLocationAddress) {
      setInputAddress(currentLocationAddress);
      setAddress(currentLocationAddress);
      if (coordinates) {
        setCoordinates(coordinates);
      }
      if (currentLocationDetails) {
        setLocationDetails(currentLocationDetails);
      }
    }
  }, [
    contextAddress,
    currentLocationAddress,
    coordinates,
    currentLocationDetails,
  ]);

  // Handle custom event for getting current location
  useEffect(() => {
    const handleGetCurrentLocation = () => {
      fetchCurrentLocation();
    };
    document.addEventListener("getCurrentLocation", handleGetCurrentLocation);
    return () => {
      document.removeEventListener(
        "getCurrentLocation",
        handleGetCurrentLocation
      );
    };
  }, [fetchCurrentLocation]);

  const handlePlaceOrder = async () => {
    if (!inputAddress.trim()) {
      setError("Please enter an address");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // Update context with the current input address before redirecting
      setAddress(inputAddress);

      const params = new URLSearchParams({
        address: inputAddress,
        state: locationDetails.state || "",
        localGovernment: locationDetails.localGovernment || "",
        locality: locationDetails.locality || "",
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/store`);
    } catch (error) {
      setError("Error processing request");
      setIsSending(false);
    }
  };

  const handleJoinWaitlist = (address: string) => {
    setUndeliverableAddress(address);
    setIsAddressModalOpen(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsWaitlistModalOpen(true);
    }, 100);
  };

  const closeWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
    setUndeliverableAddress("");
  };

  const isButtonDisabled = isLoading || isSending || !inputAddress.trim();

  return (
    <div className="relative space-y-4">
      {/* Address Input */}
      <div className="flex flex-col sm:flex-row gap-2 p-1 rounded-full sm:bg-white  max-w-md mx-auto md:mx-0 animate-fadeInUp">
        <div className="flex-1 flex items-center bg-white rounded-full pl-2">
          <MapPin className="text-[#f15736] h-5 w-5 mr-2" />
          <input
            type="text"
            placeholder="What is your address?"
            value={inputAddress}
            onChange={(e) => {
              setInputAddress(e.target.value);
              setAddress(e.target.value);
              setError(null);
            }}
            onFocus={() => setIsAddressModalOpen(true)}
            className="bg-white rounded-full border-none outline-none w-full py-2 text-base text-black placeholder-black"
          />
        </div>
        {!inputAddress && (
          <button
            onClick={fetchCurrentLocation}
            disabled={isLoading}
            className="bg-[#f15736] text-white cursor-pointer rounded-full px-4 py-2 flex items-center justify-center text-base hover:bg-[#d8432c] transition-colors disabled:opacity-70"
          >
            <Navigation className="h-4 w-4 mr-2" /> Use current location
          </button>
        )}
      </div>

      {/* Loading State with Higher z-index */}
      {isLoading && (
        <div className="absolute left-0 right-0 text-center mt-2 flex items-center justify-center gap-2 animate-fadeIn z-10">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-base text-black font-bold">
            Fetching your location...
          </span>
        </div>
      )}

      {/* Error State */}
      {(error || locationError) && (
        <div className="absolute left-0 right-0 text-center mt-2 text-red-500 text-base animate-fadeIn">
          {error || locationError}
        </div>
      )}

      {/* Place Order Button */}
      {inputAddress && (
        <div className="relative max-w-md mx-auto md:mx-0 animate-fadeInUp">
          <button
            onClick={handlePlaceOrder}
            disabled={isButtonDisabled}
            className="w-full mt-2 bg-[#f15736] text-white cursor-pointer rounded-full px-4 py-2 flex items-center justify-center text-base hover:bg-[#d8432c] transition-colors disabled:opacity-70"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Order Now"
            )}
          </button>
        </div>
      )}

      {/* Address Search Modal */}
      <AddressSearchModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onJoinWaitlist={handleJoinWaitlist}
      />

      {/* Waitlist Modal */}
      <JoinWaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={closeWaitlistModal}
        address={undeliverableAddress}
      />
    </div>
  );
}
