/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// useCurrentLocation.ts
// useCurrentLocation.ts
import { useState, useEffect, useRef } from "react";

interface LocationDetails {
  state: string;
  localGovernment: string;
  locality: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseCurrentLocationOptions {
  initialAddress?: string;
  skipInitialFetch?: boolean;
}

export function useCurrentLocation(options: UseCurrentLocationOptions = {}) {
  const { initialAddress, skipInitialFetch = false } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(initialAddress || null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(true);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        setGoogleLoaded(true);
        geocoderRef.current = new window.google.maps.Geocoder();
      } else {
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };
    checkGoogleMapsLoaded();
  }, []);

  const extractLocationDetails = (
    addressComponents: google.maps.GeocoderAddressComponent[]
  ) => {
    let state = "";
    let localGovernment = "";
    let locality = "";
    let subLocality = "";
    let neighborhood = "";
    let route = "";
    let streetNumber = "";

    addressComponents.forEach((component) => {
      const types = component.types;
      if (types.includes("administrative_area_level_1")) state = component.long_name;
      if (types.includes("administrative_area_level_2")) localGovernment = component.long_name;
      if (types.includes("locality")) locality = component.long_name;
      if (types.includes("sublocality") || types.includes("sublocality_level_1")) subLocality = component.long_name;
      if (types.includes("neighborhood")) neighborhood = component.long_name;
      if (types.includes("route")) route = component.long_name;
      if (types.includes("street_number")) streetNumber = component.long_name;
    });

    const details = { state, localGovernment, locality, subLocality, neighborhood, route, streetNumber };
    const specificLocality = subLocality || neighborhood || locality;

    return {
      state,
      localGovernment,
      locality: specificLocality,
      details,
    };
  };

  const createFormattedAddress = (details: any) => {
    const { streetNumber, route, neighborhood, subLocality, locality, localGovernment, state } = details;
    const addressParts = [];

    if (streetNumber && route) addressParts.push(`${streetNumber} ${route}`);
    else if (route) addressParts.push(route);
    if (neighborhood) addressParts.push(neighborhood);
    else if (subLocality) addressParts.push(subLocality);
    if (locality && locality !== subLocality && locality !== neighborhood) addressParts.push(locality);
    if (localGovernment && localGovernment !== locality) addressParts.push(localGovernment);
    if (state) addressParts.push(state);

    return addressParts.join(", ");
  };

  const fetchCurrentLocation = () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Please set your location manually.");
      setIsLoading(false);
      setHasAttemptedFetch(true);
      return;
    }

    if (!geocoderRef.current) {
      setError("Google Maps is not loaded yet. Please try again in a moment.");
      setIsLoading(false);
      setHasAttemptedFetch(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          setDebugInfo(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}, Accuracy: ${accuracy.toFixed(0)}m`);

          geocoderRef.current!.geocode(
            { location: { lat: latitude, lng: longitude }, region: "NG" },
            (results: any[], status: any) => {
              if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                const preferredTypes = [
                  "street_address", "premise", "subpremise", "route", "intersection",
                  "neighborhood", "sublocality", "sublocality_level_1", "locality"
                ];

                const bestResult = results.find((result: { types: string[] }) =>
                  preferredTypes.some(type => result.types.includes(type))) || results[0];

                const locationDetails = extractLocationDetails(bestResult.address_components);
                const customFormattedAddress = createFormattedAddress(locationDetails.details);

                if (!locationDetails.state) {
                  setError("Unable to determine location state. Please set your location manually.");
                  setIsLoading(false);
                  setHasAttemptedFetch(true);
                  return;
                }

                setAddress(customFormattedAddress);
                setCoordinates({ latitude, longitude });
                setLocationDetails({
                  state: locationDetails.state,
                  localGovernment: locationDetails.localGovernment || "",
                  locality: locationDetails.locality || "",
                });

                setIsLoading(false);
                setHasAttemptedFetch(true);
              } else {
                setError("No address found for your location. Please set it manually.");
                setIsLoading(false);
                setHasAttemptedFetch(true);
              }
            }
          );
        } catch (err) {
          setError("Failed to fetch address. Please try again or set manually.");
          setIsLoading(false);
          setHasAttemptedFetch(true);
        }
      },
      (err) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable it or set manually.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable. Please check your settings.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
        setHasAttemptedFetch(true);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    const handleGetCurrentLocation = () => {
      if (googleLoaded) {
        console.log("Manual location fetch triggered");
        setHasAttemptedFetch(false);
        fetchCurrentLocation();
      } else {
        setError("Google Maps is still loading. Please try again in a moment.");
      }
    };

    document.addEventListener("getCurrentLocation", handleGetCurrentLocation);
    return () => document.removeEventListener("getCurrentLocation", handleGetCurrentLocation);
  }, [googleLoaded]);

  return {
    address,
    setAddress,
    coordinates,
    setCoordinates,
    locationDetails,
    setLocationDetails,
    isLoading,
    error,
    debugInfo,
    fetchCurrentLocation
  };
}