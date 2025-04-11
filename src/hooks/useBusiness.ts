/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useBusiness.ts
import { useQuery } from "@tanstack/react-query"; 

// Define the Business interface with proper typing
interface Business {
  id: string;
  name: string;
  image: string | null; // Adjusted to match backend response
  city: string;
  priceRange: string | null;
  deliveryTime: string | null;
  rating: number; // Changed to number to match backend (decimal)
  ratingCount: number;
  openingTime: string;
  closingTime: string;
  status: "open" | "closed"; // Explicit union type
  businessType: string;
  productCategories: string[];
}

// Define props interface with productType instead of subcategory
interface UseBusinessProps {
  address: string | null;
  localGovernment: string | undefined;
  state: string | undefined;
  businessType?: string;
  productType?: string | null; // Renamed from subcategory
}

// Utility function to determine if a business is open
const isBusinessOpen = (openingTime: string, closingTime: string): boolean => {
  const now = new Date();
  const [openHour, openMinute] = openingTime.split(":").map(Number);
  const [closeHour, closeMinute] = closingTime.split(":").map(Number);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  if (closeTimeInMinutes < openTimeInMinutes) {
    return (
      currentTimeInMinutes >= openTimeInMinutes ||
      currentTimeInMinutes < closeTimeInMinutes
    );
  }
  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes
  );
};

// Fetch businesses function with consistent parameter names
const fetchBusinesses = async ({
  localGovernment,
  state,
  businessType,
  productType,
}: {
  localGovernment: string;
  state: string;
  businessType?: string;
  productType?: string;
}): Promise<Business[]> => {
  if (!localGovernment || !state) {
    throw new Error("Waiting for location data...");
  }

  const normalizedCity = localGovernment
    .replace(/\s+/g, "-")
    .replace(/\//g, "-");

  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/filter`;
  const params = new URLSearchParams({
    city: encodeURIComponent(normalizedCity),
    state: encodeURIComponent(state),
    businessType: businessType || "Restaurants", // Default to Restaurants
  });

  if (productType) {
    params.set("productType", productType); // Consistent with backend
  }

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch businesses: ${response.statusText}`);
  }

  const data = await response.json();

  return data.businesses.map((business: any) => ({
    id: business.id,
    name: business.name,
    image: business.image || null, // Handle null from backend
    city: business.city,
    priceRange: business.priceRange || null,
    deliveryTime: business.deliveryTimeRange || "15 - 20 mins", // Adjusted to match backend field
    rating: Number(business.rating), // Ensure number type
    ratingCount: business.ratingCount || business.totalRatings || 0, // Fallback for consistency
    openingTime: business.openingTime,
    closingTime: business.closingTime,
    status: isBusinessOpen(business.openingTime, business.closingTime)
      ? "open"
      : "closed",
    businessType: business.businessType,
    productCategories: business.productCategories || [],
  }));
};

// Updated useBusiness hook
export const useBusiness = ({
  address,
  localGovernment,
  state,
  businessType,
  productType, // Renamed from subcategory
}: UseBusinessProps) => {
  const query = useQuery({
    queryKey: [
      "businesses",
      localGovernment,
      state,
      businessType,
      productType, // Updated to use productType
    ],
    queryFn: () =>
      fetchBusinesses({
        localGovernment: localGovernment!,
        state: state!,
        businessType,
        productType: productType || undefined, // Handle null case
      }),
    enabled: !!address && !!localGovernment && !!state, // Only run when all required fields are present
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    businesses: query.data || [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
};