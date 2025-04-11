// hooks/useRecommendations.ts
import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@/contexts/address-context";

interface RecommendedBusiness {
  id: number;
  name: string;
  image: string | null;
  rating: string;
  deliveryTime: string;
  tags: string[];
  status: string;
  preOrder: boolean;
  businessType: string;
  productCategories: string[];
}

interface APIBusiness {
  id: number;
  name: string;
  image: string | null;
  city: string;
  rating: string;
  ratingCount: number;
  priceRange: string;
  deliveryTimeRange: string | null;
  businessType: string;
  productCategories: string[];
  openingTime: string;
  closingTime: string;
}

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

const fetchRecommendations = async (
  city: string,
  state: string,
  businessType: string,
  productType?: string // Added optional productType
): Promise<RecommendedBusiness[]> => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/top-rated`;

  const normalizedCity = city
    .replace(/\s+/g, "-")
    .replace(/\//g, "-");
  const params = new URLSearchParams({
    page: "1",
    limit: "5",
    businessType: businessType || "Restaurants",
    city: encodeURIComponent(normalizedCity),
    state: encodeURIComponent(state),
    minRating: "0",
  });

  if (productType) {
    params.set("productType", productType);
  }

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  const data = await response.json();

  return data.data.businesses.map((business: APIBusiness) => ({
    id: business.id,
    name: business.name,
    image: business.image,
    rating: business.rating,
    deliveryTime: business.deliveryTimeRange || "15 - 20 mins",
    tags: [],
    status: isBusinessOpen(business.openingTime, business.closingTime) ? "open" : "closed",
    preOrder: false,
    businessType: business.businessType,
    productCategories: business.productCategories,
  }));
};

export const useRecommendations = (businessType: string) => {
  const { locationDetails } = useAddress();

  return useQuery({
    queryKey: ["recommendations", locationDetails?.localGovernment, locationDetails?.state, businessType],
    queryFn: () => {
      if (!locationDetails?.localGovernment || !locationDetails?.state) {
        throw new Error("Location not set");
      }
      return fetchRecommendations(locationDetails.localGovernment, locationDetails.state, businessType);
    },
    enabled: !!locationDetails?.localGovernment && !!locationDetails?.state,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};