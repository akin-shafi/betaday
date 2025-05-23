/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

export interface Business {
  id: string;
  name: string;
  image: string | null;
  city: string;
  priceRange: string | null;
  deliveryTime: string | null;
  rating: number;
  ratingCount: number;
  openingTime: string;
  closingTime: string;
  status: "open" | "closed";
  businessType: string;
  productCategories: string[];
}

interface BusinessResponse {
  businesses: Business[];
  total: number;
  page: number;
  limit: number;
}

interface UseBusinessProps {
  address: string | null;
  localGovernment: string | undefined;
  state: string | undefined;
  businessType?: string;
  productType?: string | null;
  page?: number;
  limit?: number;
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

const fetchBusinesses = async ({
  localGovernment,
  state,
  businessType,
  productType,
  page = 1,
  limit = 10,
}: {
  localGovernment: string;
  state: string;
  businessType?: string;
  productType?: string;
  page?: number;
  limit?: number;
}): Promise<BusinessResponse> => {
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
    businessType: businessType || "Restaurants",
    page: page.toString(),
    limit: limit.toString(),
  });

  if (productType) {
    params.set("productType", productType);
  }

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch businesses: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    businesses: data.businesses.map((business: any) => ({
      id: business.id,
      name: business.name,
      image: business.image || null,
      city: business.city,
      priceRange: business.priceRange || null,
      deliveryTime: business.deliveryTimeRange || "15 - 20 mins",
      rating: Number(business.rating),
      ratingCount: business.ratingCount || business.totalRatings || 0,
      openingTime: business.openingTime,
      closingTime: business.closingTime,
      status: isBusinessOpen(business.openingTime, business.closingTime)
        ? "open"
        : "closed",
      businessType: business.businessType,
      productCategories: business.productCategories || [],
    })),
    total: data.total || 0,
    page: data.page || page,
    limit: data.limit || limit,
  };
};

export const useBusiness = ({
  address,
  localGovernment,
  state,
  businessType,
  productType,
  page = 1,
  limit = 10,
}: UseBusinessProps) => {
  const query = useQuery({
    queryKey: [
      "businesses",
      localGovernment,
      state,
      businessType,
      productType,
      page,
      limit,
    ],
    queryFn: () =>
      fetchBusinesses({
        localGovernment: localGovernment!,
        state: state!,
        businessType,
        productType: productType || undefined,
        page,
        limit,
      }),
    enabled: !!address && !!localGovernment && !!state,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    data: query.data || { businesses: [], total: 0, page, limit },
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
};