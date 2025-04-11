import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/utils/auth";
import { Product } from "@/types/product";

interface UseProductsProps {
  page: number;
  limit: number;
  state?: string;
  city?: string;
  category?: string;
  searchTerm?: string;
}



export const fetchProducts = async ({
  page,
  limit,
  state,
  city,
  category,
  searchTerm,
}: UseProductsProps): Promise<{ products: Product[]; total: number }> => {
  const token = getAuthToken();
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/products/filtered-products`;

  const normalizedCity = city
    ?.replace(/\s+/g, "-")
    .replace(/\//g, "-");

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (state) params.append("state", state);
  if (normalizedCity) params.append("city", normalizedCity);
  if (category) params.append("categories", category);
  if (searchTerm) params.append("search", searchTerm);

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch products");
  }

  const data = await response.json();
  return { products: data.products, total: data.total };
};



export const useProducts = ({
  page,
  limit,
  state,
  city,
  category,
  searchTerm,
}: UseProductsProps) => {
  const query = useQuery({
    queryKey: ["products", page, limit, state, city, category, searchTerm],
    queryFn: () => fetchProducts({ page, limit, state, city, category, searchTerm }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!state && !!city,
  });

  return {
    products: query.data?.products || [],
    total: query.data?.total || 0,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
};

export const fetchProductCategories = async (isPredefined?: boolean) => {
  try {
    const token = getAuthToken();
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/product-categories/all`);
    
    // Add isPredefined query parameter if provided
    if (isPredefined !== undefined) {
      url.searchParams.append("isPredefined", isPredefined.toString());
    }

    const response = await fetch(url, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Optional, for clarity
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch product categories.");
    }

    const data = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message || "Error fetching product categories.");
  }
};