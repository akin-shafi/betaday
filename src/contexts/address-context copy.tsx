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

type AddressSource = "localStorage" | "currentLocation" | "manual" | "none";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationDetails {
  state: string;
  localGovernment: string;
  locality: string;
  localGovernmentId?: string;
  // coordinates?: string;
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

const isValidCoordinates = (coords: Coordinates): boolean => {
  return (
    coords &&
    typeof coords.latitude === "number" &&
    typeof coords.longitude === "number" &&
    !isNaN(coords.latitude) &&
    !isNaN(coords.longitude) &&
    coords.latitude !== 0 &&
    coords.longitude !== 0
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
    latitude: 0,
    longitude: 0,
  });
  const [locationDetails, setLocationDetailsState] = useState<LocationDetails>({
    state: "",
    localGovernment: "",
    locality: "",
    localGovernmentId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [addressSource, setAddressSource] = useState<AddressSource>("none");

  const hasProcessedLocationRef = useRef(false);

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

  useEffect(() => {
    const initializeAddress = async () => {
      if (hasInitialized) return;
      setHasInitialized(true);

      try {
        const savedAddressData = localStorage.getItem(STORAGE_KEY);
        if (savedAddressData) {
          try {
            const parsed = JSON.parse(savedAddressData);

            const isValidSavedData =
              typeof parsed.address === "string" &&
              parsed.address &&
              isValidCoordinates(parsed.coordinates) &&
              isValidLocationDetails(parsed.locationDetails);

            if (isValidSavedData) {
              setAddressState(parsed.address);
              setCoordinatesState(parsed.coordinates);
              setLocationDetailsState({
                ...parsed.locationDetails,
                localGovernmentId:
                  parsed.locationDetails.localGovernmentId || "",
              });
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

  useEffect(() => {
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
        setLocationDetailsState({
          ...currentLocationDetails,
          localGovernmentId: currentLocationDetails.localGovernment || "",
        });
        setAddressSource("currentLocation");
        setError(null);

        updateLocalStorage(
          currentAddress,
          {
            latitude: currentCoordinates.latitude,
            longitude: currentCoordinates.longitude,
          },
          {
            ...currentLocationDetails,
            localGovernmentId: currentLocationDetails.localGovernment || "",
          },
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

  useEffect(() => {
    setIsLoading(isLocationLoading);
  }, [isLocationLoading]);

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

  const handleSetAddress = (
    newAddress: string,
    data?: {
      coordinates: Coordinates;
      locationDetails: LocationDetails;
      source: AddressSource;
    }
  ) => {
    if (typeof newAddress !== "string" || !newAddress) {
      console.error("Invalid address provided:", newAddress);
      return;
    }

    if (
      !data ||
      !isValidCoordinates(data.coordinates) ||
      !isValidLocationDetails(data.locationDetails)
    ) {
      console.error(
        "Invalid or missing coordinates or location details:",
        data
      );
      setError("Address requires valid coordinates and location details");
      return;
    }

    const {
      coordinates: newCoords,
      locationDetails: newDetails,
      source,
    } = data;

    setAddressState(newAddress);
    setCoordinatesState(newCoords);
    setLocationDetailsState({
      ...newDetails,
      localGovernmentId: newDetails.localGovernmentId || "",
    });
    setAddressSource(source);
    setError(null);

    const storageData = {
      address: newAddress,
      coordinates: newCoords,
      locationDetails: {
        ...newDetails,
        localGovernmentId: newDetails.localGovernmentId || "",
      },
      source: source,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error("Error saving complete address data:", error);
    }
  };

  const handleSetCoordinates = (newCoords: Coordinates) => {
    if (!isValidCoordinates(newCoords)) {
      console.error("Invalid coordinates provided:", newCoords);
      return;
    }
    setCoordinatesState(newCoords);

    const data = {
      address,
      coordinates: newCoords,
      locationDetails: {
        ...locationDetails,
        localGovernmentId: locationDetails.localGovernmentId || "",
      },
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
    setLocationDetailsState({
      ...newDetails,
      localGovernmentId: newDetails.localGovernmentId || "",
    });

    const data = {
      address,
      coordinates,
      locationDetails: {
        ...newDetails,
        localGovernmentId: newDetails.localGovernmentId || "",
      },
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
      setCoordinatesState({ latitude: 0, longitude: 0 });
      setLocationDetailsState({
        state: "",
        localGovernment: "",
        locality: "",
        localGovernmentId: "",
      });
      setAddressSource("none");
      localStorage.removeItem(STORAGE_KEY);
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
