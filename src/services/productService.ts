/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ProductCategory {
  id: string
  name: string
  description: string | null
  businessId: string | null
  isPredefined: boolean
}

export interface ProductBusiness {
  id: string
  userId: string | null
  name: string
  description: string
  address: string
  city: string
  localGovernment: string
  state: string
  latitude: string
  longitude: string
  image: string | null
  coverImage: string | null
  zone: string | null
  subZone: string | null
  openingTime: string
  closingTime: string
  deliveryOptions: string[]
  contactNumber: string
  website: string
  priceRange: string | null
  deliveryTimeRange: string | null
  rating: string
  totalRatings: number
  isActive: boolean
  vendorId: string | null
  businessType: string
  businessDays: string
  accountNumber: string
  bankName: string
  accountName: string
  createdAt: string
  updatedAt: string
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
  business: ProductBusiness
  categories: ProductCategory[]
}

export interface ProductsResponse {
  products: Product[]
}

// Function to fetch products with proper error handling
export const fetchProducts = async (businessId: string): Promise<Product[]> => {
  try {
    const cacheBuster = Date.now().toString()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
    const url = `${baseUrl}/products?businessId=${encodeURIComponent(businessId)}&_t=${cacheBuster}`

    console.log(`🔄 Fetching products for business ${businessId} with cache bust: ${cacheBuster}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`📦 Raw API response:`, data)

    // Handle different response structures
    let products: Product[] = []

    if (Array.isArray(data)) {
      // If data is directly an array
      products = data
    } else if (data.products && Array.isArray(data.products)) {
      // If data has a products property that's an array
      products = data.products
    } else if (data.data && Array.isArray(data.data)) {
      // If data has a data property that's an array
      products = data.data
    } else {
      console.warn("⚠️ Unexpected API response structure:", data)
      return []
    }

    console.log(`📦 Processed ${products.length} products for business ${businessId}`)

    // Filter only active and available products
    return products.filter((product: Product) => product.isActive && product.isAvailable)
  } catch (error) {
    console.error("❌ Error fetching products:", error)
    throw error
  }
}

// Function to fetch business details directly
export const fetchBusinessDetails = async (businessId: string): Promise<ProductBusiness> => {
  try {
    const cacheBuster = Date.now().toString()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
    const url = `${baseUrl}/businesses/${encodeURIComponent(businessId)}?_t=${cacheBuster}`

    console.log(`🏪 Fetching business details for ${businessId} with cache bust: ${cacheBuster}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch business details: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`🏪 Raw business API response:`, data)

    // Handle different response structures for business data
    let business: ProductBusiness

    if (data.business) {
      business = data.business
    } else if (data.data) {
      business = data.data
    } else {
      business = data
    }

    console.log(`🏪 Processed business details for: ${business.name}`)
    return business
  } catch (error) {
    console.error("❌ Error fetching business details:", error)
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

  console.log(`🏪 Extracted business info from products: ${firstProduct.business.name}`)
  return firstProduct.business
}
