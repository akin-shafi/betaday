/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from "uuid"

export const BROWN_BAG_PRICE = 200

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CartPack {
  id: string
  items: CartItem[]
}

// Calculate subtotal of all items in the cart
export function calculateSubtotal(packs: CartPack[], brownBagQuantity: number): number {
  const packsTotal = packs.reduce((sum, pack) => {
    return sum + pack.items.reduce((packSum, item) => packSum + item.price * item.quantity, 0)
  }, 0)
  const brownBagTotal = brownBagQuantity * BROWN_BAG_PRICE
  return packsTotal + brownBagTotal
}

// Calculate total with discount and fees
export function calculateTotal(subtotal: number, discount: number, deliveryFee: number, serviceFee: number): number {
  const discountAmount = (subtotal * discount) / 100
  return subtotal - discountAmount + deliveryFee + serviceFee
}

// Map display payment method to API payment method
export function getPaymentMethod(method: string): string {
  const paymentMethodMap: { [key: string]: string } = {
    Wallet: "wallet",
    "Pay with Card": "card",
    "Pay with Bank Transfer": "bank_transfer",
    "Pay with USSD": "ussd",
    "Pay with QR Code": "qr",
    "Cash on Delivery": "cash_on_delivery",
    "Pay with Opay": "opay",
  }
  const mappedMethod = paymentMethodMap[method]
  if (!mappedMethod) {
    console.error(`Invalid payment method: ${method}`)
    throw new Error(`Invalid payment method: ${method}`)
  }
  console.log(`Payment method: ${method}, Mapped: ${mappedMethod}`)
  return mappedMethod
}

// Get order items from cart packs
export function getOrderItems(packs: CartPack[]): {
  item_id: string
  quantity: number
  type: string
  pack_id: string
}[] {
  const orderItems: {
    item_id: string
    quantity: number
    type: string
    pack_id: string
  }[] = []

  packs.forEach((pack) => {
    pack.items.forEach((item) => {
      if (!validate(item.id)) {
        console.error(`Invalid UUID for item ID: ${item.id}. Skipping this item.`)
        return
      }
      orderItems.push({
        item_id: item.id,
        quantity: item.quantity,
        type: "menu",
        pack_id: pack.id,
      })
    })
  })

  return orderItems
}

// Format order details for receipt
export function formatOrderForReceipt(
  orderDetails: any,
  getSubtotal: () => number,
  getTotal: () => number,
  discount: number,
  contextAddress: string | null,
  displayedPaymentMethod: string,
  getPaymentMethod: (method: string) => string,
  businessName: string,
) {
  if (!orderDetails) return null

  // Map order items to the format expected by ReceiptModal
  const items =
    orderDetails.orderItems?.map((item: any) => ({
      id: item.id,
      name: item.name || `Item ${item.id.substring(0, 4)}`,
      quantity: item.quantity,
      price: item.price || 0,
    })) || []

  return {
    id: orderDetails.id,
    date: orderDetails.created_at || new Date().toISOString(),
    items,
    subtotal: orderDetails.subtotal || getSubtotal(),
    deliveryFee: orderDetails.deliveryFee || 0,
    serviceFee: orderDetails.serviceFee || 0,
    discount: orderDetails.discount || (discount > 0 ? (getSubtotal() * discount) / 100 : 0),
    total: orderDetails.totalAmount || getTotal(),
    paymentMethod: orderDetails.paymentMethod || getPaymentMethod(displayedPaymentMethod),
    deliveryAddress: orderDetails.deliveryAddress || contextAddress,
    transactionRef: orderDetails.transactionId,
    businessName: businessName,
  }
}
