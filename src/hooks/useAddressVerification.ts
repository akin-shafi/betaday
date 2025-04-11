/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useAddressVerification.ts
import { useState } from "react";

interface LocationDetails {
  state?: string;
  localGovernment?: string;
  locality?: string;
  formattedAddress: string;
}

interface AddressVerificationResult {
  isDeliverable: boolean;
  error: string | null;
  isVerifying: boolean;
  verifyAddress: (address: string, locationDetails?: LocationDetails) => Promise<void>;
  reset: () => void; // Add reset function
}

export const useAddressVerification = (): AddressVerificationResult => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeliverable, setIsDeliverable] = useState<boolean>(false);

  const verifyDeliveryZone = async (locationDetails: LocationDetails) => {
    try {
     

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-delivery-zone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: locationDetails.state,
          city: locationDetails.localGovernment,
          // locality: locationDetails.locality,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Delivery zone verification failed");
      }
      return data.isDeliverable;
    } catch (error) {
      console.error("Error verifying delivery zone:", error);
      return false;
    }
  };

  const verifyAddress = async (address: string, locationDetails?: LocationDetails) => {
    setIsVerifying(true);
    setError(null);

    try {
      const details = locationDetails || { formattedAddress: address };

      if (!details.state) {
        setError("State information is missing. Please select a valid address.");
        setIsDeliverable(false);
        return;
      }

      const deliverable = await verifyDeliveryZone({
        state: details.state,
        localGovernment: details.localGovernment || "",
        locality: details.locality || "",
        formattedAddress: details.formattedAddress,
      });

      if (!deliverable) {
        setError(`We don't deliver to ${details.formattedAddress} yet.`);
        setIsDeliverable(false);
      } else {
        setIsDeliverable(true);
      }
    } catch (err) {
      setError("Error verifying address. Please try again.");
      setIsDeliverable(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const reset = () => {
    setError(null);
    setIsDeliverable(false);
    setIsVerifying(false);
  };

  return { isDeliverable, error, isVerifying, verifyAddress, reset };
};