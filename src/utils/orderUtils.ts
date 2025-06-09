/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utility functions for handling orders
 */

import { getSessionToken } from "@/utils/session"

/**
 * Fetches order details from the API
 * @param orderId The ID of the order to fetch
 * @param baseUrl The base URL of the API
 * @returns The order details or null if there was an error
 */
export async function fetchOrderDetails(orderId: string, baseUrl: string) {
  console.log(`fetchOrderDetails: Fetching order ${orderId}`)

  try {
    const token = getSessionToken()
    if (!token) {
      console.error("No auth token found")
      return null
    }

    // Add a timestamp to prevent caching
    const timestamp = new Date().getTime()
    const response = await fetch(`${baseUrl}/api/orders/${orderId}?t=${timestamp}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Error fetching order details: ${response.status}`, errorData)
      return null
    }

    const data = await response.json()
    console.log("Order details response:", data)

    if (data && data.data && data.data.order) {
      return data.data.order
    } else if (data && data.order) {
      return data.order
    } else if (data && data.success === true) {
      return data.data
    } else {
      console.error("Invalid order details response format:", data)
      return null
    }
  } catch (error) {
    console.error("Error in fetchOrderDetails:", error)
    return null
  }
}

/**
 * Creates a fallback order object from cart data
 * @param cartState The current cart state
 * @param contextAddress The delivery address
 * @param paymentMethod The payment method used
 * @param businessName The business name
 * @returns A fallback order object
 */
export function createFallbackOrder(
  cartState: any,
  contextAddress: string,
  paymentMethod: string,
  businessName: string,
  orderId: string | null,
  discount = 0,
) {
  const calculateSubtotal = () => {
    return cartState.packs.reduce(
      (sum: number, pack: any) =>
        sum + pack.items.reduce((packSum: number, item: any) => packSum + item.price * item.quantity, 0),
      0,
    )
  }

  const subtotal = calculateSubtotal()
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  return {
    id: orderId || "pending",
    date: new Date().toISOString(),
    items: cartState.packs.flatMap((pack: any) =>
      pack.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    ),
    subtotal,
    deliveryFee: 0,
    serviceFee: 0,
    discount: discountAmount,
    total,
    paymentMethod,
    deliveryAddress: contextAddress || "Not specified",
    transactionRef: "",
    businessName: businessName || "BetaDay",
  }
}
