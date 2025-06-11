/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ProductCategory {
  id?: string;
  name: string;
  description?: string | null;
  businessId?: string | null;
  isPredefined?: boolean;
}

export interface ProductBusiness {
  status: "open" | "closed";
  id: string;
  userId: string | null;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  localGovernment: string;
  state: string;
  latitude: string;
  longitude: string;
  image: string | null;
  coverImage: string | null;
  zone: string | null;
  subZone: string | null;
  openingTime: string;
  closingTime: string;
  deliveryOptions: string[];
  contactNumber: string;
  website: string;
  priceRange: string | null;
  deliveryTimeRange: string | null;
  rating: number;
  totalRatings: number;
  isActive: boolean;
  vendorId: string | null;
  businessType: string;
  businessDays: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  createdAt: string;
  updatedAt: string;
  isTwentyFourSeven?: boolean;
  isTwentyFourHours?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  isActive: boolean;
  isAvailable: boolean;
  options: any | null;
  businessId: string;
  stockQuantity: number;
  isFeatured: boolean;
  discountPrice: string | null;
  created_at: string;
  updated_at: string;
  categories: ProductCategory[];
  business?: ProductBusiness;
}

export interface ProductsResponse {
  products: Product[];
  message: string;
}

export interface CategoriesResponse {
  categories: string[];
  message: string;
}

export const fetchBusinessDetails = async (
  slug: string
): Promise<ProductBusiness> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";

    const params = new URLSearchParams();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userCurrentTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    params.append("userTimeZone", userTimeZone);
    params.append("userCurrentTime", userCurrentTime);

    const url = `${baseUrl}/businesses/slug/${encodeURIComponent(
      slug
    )}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch business details: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    let business: ProductBusiness;

    if (data.business) {
      business = data.business;
    } else if (data.data) {
      business = data.data;
    } else {
      business = data;
    }

    business.status =
      business.status === "open" || business.isTwentyFourSeven
        ? "open"
        : "closed";

    return business;
  } catch (error) {
    console.error("❌ Error fetching business details:", error);
    throw error;
  }
};

export const fetchProductsByBusinessId = async (businessId: string): Promise<Product[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";
    const url = `${baseUrl}/products/business/${encodeURIComponent(businessId)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const data: ProductsResponse = await response.json();

    const products = data.products || [];

    const validProducts = products.filter((product: Product) => product.isActive && product.isAvailable);

    return validProducts;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw error;
  }
};

export const fetchCategoriesByBusinessId = async (businessId: string): Promise<string[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";
    const url = `${baseUrl}/products/business/${encodeURIComponent(businessId)}/categories`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    const data: CategoriesResponse = await response.json();

    const categories = data.categories || [];

    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
};

export const fetchProducts = async (slug: string): Promise<Product[]> => {
  try {
    const business = await fetchBusinessDetails(slug);
    return await fetchProductsByBusinessId(business.id);
  } catch (error) {
    console.error("❌ Error in legacy fetchProducts:", error);
    throw error;
  }
};

export const getBusinessFromProducts = (products: Product[]): ProductBusiness | null => {
  if (!products || products.length === 0) {
    return null;
  }

  const firstProduct = products[0];
  if (!firstProduct.business) {
    return null;
  }

  return firstProduct.business;
};