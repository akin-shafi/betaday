/* eslint-disable @typescript-eslint/no-explicit-any */

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"

export interface CategoriesResponse {
  categories: string[]
  message: string
}

export const fetchBusinessCategories = async (businessId: string, token?: string): Promise<string[]> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    }

    // Add authorization header if token is provided
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    // Use the correct API endpoint
    const cacheBuster = Date.now()
    const url = `${API_URL}/products/business/${encodeURIComponent(businessId)}/categories?_t=${cacheBuster}`

    console.log(`📂 Fetching categories for business ${businessId} with cache bust: ${cacheBuster}`)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
    }

    const data: CategoriesResponse = await response.json()

    console.log(`📂 Received ${data.categories?.length || 0} categories for business ${businessId}`)

    // Return the categories array
    return Array.isArray(data.categories) ? data.categories : []
  } catch (error) {
    console.error("Error in fetchBusinessCategories:", error)
    return []
  }
}
