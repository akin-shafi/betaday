/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useRef, 
} from "react";
import { useCurrentLocation } from "@/utils/useCurrentLocation";

// Add source tracking enum
type AddressSource = "localStorage" | "currentLocation" | "manual" | "none";

export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

export interface LocationDetails {
  state: string;
  localGovernment: string;
  locality: string;
}

interface AddressContextType {
  address: string;
  setAddress: (
    address: string,
    data?: {
      coordinates: Coordinates;
      locationDetails: LocationDetails;
      source: AddressSource;
    }
  ) => void;
  coordinates: Coordinates;
  setCoordinates: (coords: Coordinates) => void;
  locationDetails: LocationDetails;
  setLocationDetails: (details: LocationDetails) => void;
  clearAddressData: () => void;
  isAddressValid: boolean;
  isLoading: boolean;
  error: string | null;
  addressSource: AddressSource;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const STORAGE_KEY = "addressData";

// Validation functions
const isValidCoordinates = (coords: Coordinates): boolean => {
  return (
    coords &&
    typeof coords.latitude === "number" &&
    typeof coords.longitude === "number" &&
    !isNaN(coords.latitude) &&
    !isNaN(coords.longitude)
  );
};

const isValidLocationDetails = (details: LocationDetails): boolean => {
  return (
    details &&
    typeof details.state === "string" &&
    typeof details.localGovernment === "string" &&
    typeof details.locality === "string" &&
    details.state.length > 0 &&
    details.localGovernment.length > 0
  );
};

export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState("");
  const [coordinates, setCoordinatesState] = useState<Coordinates>({
    latitude: null,
    longitude: null,
  });
  const [locationDetails, setLocationDetailsState] = useState<LocationDetails>({
    state: "",
    localGovernment: "",
    locality: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [addressSource, setAddressSource] = useState<AddressSource>("none");

  // Use a ref to track if we've already processed location data
  const hasProcessedLocationRef = useRef(false);

  // Function to check if current address data is valid
  const checkAddressValid = () => {
    return Boolean(
      address &&
        isValidCoordinates(coordinates) &&
        isValidLocationDetails(locationDetails)
    );
  };

  const {
    address: currentAddress,
    coordinates: currentCoordinates,
    locationDetails: currentLocationDetails,
    isLoading: isLocationLoading,
    error: locationError,
    fetchCurrentLocation,
  } = useCurrentLocation({ skipInitialFetch: true });

  // Load saved address data or get current location on mount
  useEffect(() => {
    const initializeAddress = async () => {
      if (hasInitialized) return;
      setHasInitialized(true);

      try {
        const savedAddressData = localStorage.getItem(STORAGE_KEY);
        if (savedAddressData) {
          try {
            const parsed = JSON.parse(savedAddressData);

            // Validate all required fields exist and are valid
            const isValidSavedData =
              typeof parsed.address === "string" &&
              parsed.address &&
              isValidCoordinates(parsed.coordinates) &&
              isValidLocationDetails(parsed.locationDetails);

            if (isValidSavedData) {
              setAddressState(parsed.address);
              setCoordinatesState(parsed.coordinates);
              setLocationDetailsState(parsed.locationDetails);
              setAddressSource("localStorage");
              setIsLoading(false);
              return;
            } else {
              localStorage.removeItem(STORAGE_KEY);
            }
          } catch (e) {
            console.error("Error parsing saved address data:", e);
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        await fetchCurrentLocation();
        setAddressSource("currentLocation");
      } catch (error) {
        console.error("Error initializing address:", error);
        setError("Failed to load location data");
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAddress();
  }, [hasInitialized, fetchCurrentLocation]);

  // Update state when current location changes
  useEffect(() => {
    // Only process location data if we have all required pieces and haven't processed it yet
    if (
      currentAddress &&
      currentCoordinates &&
      currentLocationDetails &&
      !hasProcessedLocationRef.current
    ) {
      hasProcessedLocationRef.current = true;

      const hasValidAddress = checkAddressValid();
      if (!hasValidAddress || addressSource === "none") {
        setAddressState(currentAddress);
        setCoordinatesState({
          latitude: currentCoordinates.latitude,
          longitude: currentCoordinates.longitude,
        });
        setLocationDetailsState(currentLocationDetails);
        setAddressSource("currentLocation");
        setError(null);

        // Save to localStorage
        updateLocalStorage(
          currentAddress,
          {
            latitude: currentCoordinates.latitude,
            longitude: currentCoordinates.longitude,
          },
          currentLocationDetails,
          "currentLocation"
        );
      }
    } else if (locationError && !checkAddressValid()) {
      setError(locationError);
    }
  }, [
    currentAddress,
    currentCoordinates,
    currentLocationDetails,
    locationError,
  ]);

  // Update loading state based on location loading
  useEffect(() => {
    setIsLoading(isLocationLoading);
  }, [isLocationLoading]);

  // Helper function to update localStorage with source tracking
  const updateLocalStorage = (
    currentAddress: string,
    currentCoords: Coordinates,
    currentDetails: LocationDetails,
    source: AddressSource
  ) => {
    try {
      const data = {
        address: currentAddress,
        coordinates: currentCoords,
        locationDetails: currentDetails,
        source: source,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving address data:", error);
    }
  };

  // Custom setters that also update localStorage
  const handleSetAddress = (
    newAddress: string,
    data?: {
      coordinates: Coordinates;
      locationDetails: LocationDetails;
      source: AddressSource;
    }
  ) => {
    if (typeof newAddress !== "string") {
      console.error("Invalid address provided:", newAddress);
      return;
    }

    // If we have complete data, update everything atomically
    if (data) {
      const {
        coordinates: newCoords,
        locationDetails: newDetails,
        source,
      } = data;

      if (!isValidCoordinates(newCoords)) {
        console.error("Invalid coordinates in data:", newCoords);
        return;
      }

      if (!isValidLocationDetails(newDetails)) {
        console.error("Invalid location details in data:", newDetails);
        return;
      }

      // Update all state atomically
      setAddressState(newAddress);
      setCoordinatesState(newCoords);
      setLocationDetailsState(newDetails);
      setAddressSource(source);

      // Save complete data to localStorage
      const storageData = {
        address: newAddress,
        coordinates: newCoords,
        locationDetails: newDetails,
        source: source,
        timestamp: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      } catch (error) {
        console.error("Error saving complete address data:", error);
      }
    } else {
      // Handle single address update
      setAddressState(newAddress);
      setAddressSource("manual");

      // Save current state to localStorage
      const storageData = {
        address: newAddress,
        coordinates,
        locationDetails,
        source: "manual" as AddressSource,
        timestamp: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      } catch (error) {
        console.error("Error saving address update:", error);
      }
    }
  };

  const handleSetCoordinates = (newCoords: Coordinates) => {
    if (!isValidCoordinates(newCoords)) {
      console.error("Invalid coordinates provided:", newCoords);
      return;
    }
    setCoordinatesState(newCoords);

    // Save complete updated data
    const data = {
      address,
      coordinates: newCoords,
      locationDetails,
      source: addressSource,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving coordinates:", error);
    }
  };

  const handleSetLocationDetails = (newDetails: LocationDetails) => {
    if (!isValidLocationDetails(newDetails)) {
      console.error("Invalid location details provided:", newDetails);
      return;
    }
    setLocationDetailsState(newDetails);

    // Save complete updated data
    const data = {
      address,
      coordinates,
      locationDetails: newDetails,
      source: addressSource,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving location details:", error);
    }
  };

  const clearAddressData = () => {
    try {
      setAddressState("");
      setCoordinatesState({ latitude: null, longitude: null });
      setLocationDetailsState({ state: "", localGovernment: "", locality: "" });
      setAddressSource("none");
      localStorage.removeItem(STORAGE_KEY);
      // Reset the ref so we can fetch location again
      hasProcessedLocationRef.current = false;
      fetchCurrentLocation();
    } catch (error) {
      console.error("Error clearing address data:", error);
    }
  };

  return (
    <AddressContext.Provider
      value={{
        address,
        setAddress: handleSetAddress,
        coordinates,
        setCoordinates: handleSetCoordinates,
        locationDetails,
        setLocationDetails: handleSetLocationDetails,
        clearAddressData,
        isAddressValid: checkAddressValid(),
        isLoading,
        error,
        addressSource,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
}
