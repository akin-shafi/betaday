/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ProductCategory {
  id?: string
  name: string
  description?: string | null
  businessId?: string | null
  isPredefined?: boolean
}

export interface ProductBusiness {
  status: "open" | "closed"; // Updated to string
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
  id: string
  name: string
  description: string
  price: string
  image: string | null
  isActive: boolean
  isAvailable: boolean
  options: any | null
  businessId: string
  stockQuantity: number
  isFeatured: boolean
  discountPrice: string | null
  created_at: string
  updated_at: string
  categories: ProductCategory[]
  business?: ProductBusiness
}

export interface ProductsResponse {
  products: Product[]
  message: string
}

export interface CategoriesResponse {
  categories: string[]
  message: string
}

// http://localhost:8500/businesses/slug/spicy-food?userCurrentTime=23%3A00%3A00

// Fetch business details by slug
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
    console.log(`📡 Fetching business details from: ${url}`);

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
    console.log(`🏡 Raw business API response:`, JSON.stringify(data, null, 2));

    let business: ProductBusiness;

    if (data.business) {
      business = data.business;
    } else if (data.data) {
      business = data.data;
    } else {
      business = data;
    }

    // Normalize status to "open" or "closed"
    business.status =
      business.status === "open" || business.isTwentyFourSeven
        ? "open"
        : "closed";

    console.log(
      `🏡 Processed business details for: ${business.name} (ID: ${business.id})`
    );
    console.log(`🕐 Normalized status: ${business.status}`);
    return business;
  } catch (error) {
    console.error("❌ Error fetching business details:", error);
    throw error;
  }
};


// Fetch products by business ID
export const fetchProductsByBusinessId = async (businessId: string): Promise<Product[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
    const url = `${baseUrl}/products/business/${encodeURIComponent(businessId)}`

    console.log(`📦 Fetching products for business ID: ${businessId}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
    }

    const data: ProductsResponse = await response.json()
    console.log(`📦 Raw products API response:`, data)

    // Extract products from response
    const products = data.products || []

    // Filter for active and available products only
    const validProducts = products.filter((product: Product) => product.isActive && product.isAvailable)

    console.log(`📦 Processed ${validProducts.length} valid products out of ${products.length} total`)
    return validProducts
  } catch (error) {
    console.error("❌ Error fetching products:", error)
    throw error
  }
}

// Fetch categories by business ID
export const fetchCategoriesByBusinessId = async (businessId: string): Promise<string[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
    const url = `${baseUrl}/products/business/${encodeURIComponent(businessId)}/categories`

    console.log(`📂 Fetching categories for business ID: ${businessId}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
    }

    const data: CategoriesResponse = await response.json()
    console.log(`📂 Raw categories API response:`, data)

    // Extract categories from response
    const categories = data.categories || []

    console.log(`📂 Processed ${categories.length} categories:`, categories)
    return categories
  } catch (error) {
    console.error("❌ Error fetching categories:", error)
    // Return empty array instead of throwing to allow graceful fallback
    console.warn("⚠️ Falling back to empty categories array")
    return []
  }
}

// Legacy function - kept for backward compatibility but now uses business ID
export const fetchProducts = async (slug: string): Promise<Product[]> => {
  try {
    // First get business details to get the ID
    const business = await fetchBusinessDetails(slug)
    // Then fetch products using the business ID
    return await fetchProductsByBusinessId(business.id)
  } catch (error) {
    console.error("❌ Error in legacy fetchProducts:", error)
    throw error
  }
}

// Extract business info from products (fallback method)
export const getBusinessFromProducts = (products: Product[]): ProductBusiness | null => {
  if (!products || products.length === 0) {
    console.warn("⚠️ No products provided to extract business info")
    return null
  }

  const firstProduct = products[0]
  if (!firstProduct.business) {
    console.warn("⚠️ First product missing business info")
    return null
  }

  console.log(`🏡 Extracted business info from products: ${firstProduct.business.name}`)
  return firstProduct.business
}
