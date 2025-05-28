/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from "antd"
import { getPaymentMethod } from "@/utils/cart-utils"
import type { Dispatch } from "react"
import type { CartAction } from "@/contexts/cart-context"
import type { LocationDetails, Coordinates } from "@/contexts/address-context"

export interface PaymentConfig {
  reference: string
  email: string
  amount: number
  publicKey: string
  channels?: string[]
  label?: string
  metadata?: {
    custom_fields: Array<{
      display_name: string
      variable_name: string
      value: string
    }>
  }
  embed?: boolean
}

export async function processWalletPayment(
  baseUrl: string,
  token: string | null,
  displayedPaymentMethod: string,
  getTotal: () => number,
  processOrder: (paymentMethod: string, transactionRef: string | null) => Promise<void>,
  setIsSubmitting: (value: boolean) => void,
): Promise<boolean> {
  try {
    if (!token) {
      message.error("Authentication required for wallet payment")
      setIsSubmitting(false)
      return false
    }

    // Check wallet balance
    const walletResponse = await fetch(`${baseUrl}/api/wallet/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!walletResponse.ok) {
      const errorData = await walletResponse.json()
      throw new Error(errorData.message || "Failed to check wallet balance")
    }

    const walletData = await walletResponse.json()
    console.log("Wallet balance response:", walletData)

    // Access the balance from the correct path in the response
    if (!walletData.data || typeof walletData.data.balance !== "number") {
      throw new Error("Invalid wallet balance data received")
    }

    const walletBalance = walletData.data.balance
    const orderTotal = getTotal()

    console.log(`Wallet balance: ${walletBalance}, Order total: ${orderTotal}`)

    if (walletBalance < orderTotal) {
      setIsSubmitting(false)
      message.error(
        `Insufficient wallet balance. You have ₦${walletBalance.toFixed(2)} but the order total is ₦${orderTotal.toFixed(
          2,
        )}`,
      )
      return false
    }

    // Generate a unique transaction reference for wallet payment
    const walletTransactionRef = `wallet_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

    // Process wallet payment directly
    await processOrder("wallet", walletTransactionRef)
    return true
  } catch (error: any) {
    console.error("Error processing wallet payment:", error)
    message.error(error.message || "Failed to process wallet payment. Please try again.")
    setIsSubmitting(false)
    return false
  }
}

export function configurePaystack(
  displayedPaymentMethod: string,
  getTotal: () => number,
  email: string,
  businessName: string,
  deliveryFee: number,
  serviceFee: number,
): PaymentConfig | null {
  try {
    // Generate a unique reference
    const reference = `order_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

    // Configure Paystack based on payment method
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""
    const paymentMethod = getPaymentMethod(displayedPaymentMethod)

    let channels: string[] = []
    switch (paymentMethod) {
      case "card":
        channels = ["card"]
        break
      case "bank_transfer":
        channels = ["bank_transfer"]
        break
      case "ussd":
        channels = ["ussd"]
        break
      case "qr":
        channels = ["qr"]
        break
      default:
        channels = ["card", "bank_transfer"]
    }

    // Get the Paystack public key from environment variables
    if (!paystackKey) {
      console.error("Paystack public key is missing!")
      message.error("Payment configuration error. Please contact support.")
      return null
    }

    // Set Paystack configuration
    return {
      reference,
      email,
      amount: getTotal() * 100, // Paystack amount is in kobo (multiply by 100)
      publicKey: paystackKey,
      channels,
      label: `Order from ${businessName}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Originally Selected Method",
            variable_name: "originally_selected_method",
            value: paymentMethod,
          },
          {
            display_name: "Delivery Fee",
            variable_name: "delivery_fee",
            value: deliveryFee.toString(),
          },
          {
            display_name: "Service Fee",
            variable_name: "service_fee",
            value: serviceFee.toString(),
          },
        ],
      },
      embed: true, // Enable embedded checkout UI
    }
  } catch (error) {
    console.error("Error configuring Paystack:", error)
    return null
  }
}

export async function processOrder(
  baseUrl: string,
  token: string | null,
  paymentMethod: string,
  transactionRef: string | null,
  user: any,
  businessInfo: any,
  getOrderItems: () => any[],
  getTotal: () => number,
  deliveryFee: number,
  serviceFee: number,
  contextAddress: string,
  locationDetails: LocationDetails | null,
  coordinates: Coordinates | null,
  deliveryInstructions: string[],
  vendorInstructions: string,
  promoCodes: string[],
  setOrderId: (id: string) => void,
  dispatch: Dispatch<CartAction>,
  onClose?: () => void,
  setIsReceiptModalOpen?: (isOpen: boolean) => void,
  setIsSubmitting?: (isSubmitting: boolean) => void,
  setPaystackConfig?: (config: PaymentConfig | null) => void,
): Promise<void> {
  try {
    if (!token) {
      throw new Error("Authentication token is required to place an order")
    }

    // Use locationDetails from address context for city and state
    const city = locationDetails?.locality || locationDetails?.localGovernment || "Unknown"
    const state = locationDetails?.state || "Unknown"

    // Convert coordinates to the format expected by the API
    const addressCoordinates = coordinates
      ? {
          lat: coordinates.latitude || 0,
          lng: coordinates.longitude || 0,
        }
      : undefined

    console.log("Using location details for order:", { city, state, coordinates: addressCoordinates })
    console.log(`Processing order with payment method: ${paymentMethod}, transaction ref: ${transactionRef}`)

    // Determine payment status based on payment method
    let paymentStatus = "pending"

    if (paymentMethod === "wallet") {
      paymentStatus = "completed" // Wallet payments are considered completed immediately
    } else if (paymentMethod === "cash_on_delivery") {
      paymentStatus = "pending" // COD payments are pending until delivery
    } else if (transactionRef) {
      paymentStatus = "completed" // Online payments with transaction ref are completed
    }

    const orderPayload = {
      userId: user?.id,
      businessId: businessInfo?.id || "unknown",
      items: getOrderItems(),
      totalAmount: getTotal(),
      deliveryFee: deliveryFee,
      serviceFee: serviceFee,
      deliveryAddress: {
        street: contextAddress,
        city: city,
        state: state,
        coordinates: addressCoordinates,
      },
      deliveryInstructions,
      vendorInstructions,
      promo_codes: promoCodes,
      paymentDetails: {
        method: paymentMethod,
        status: paymentStatus,
        transactionId: transactionRef,
        paymentDate: new Date(),
      },
      sendReceipt: true,
    }

    console.log("Order payload:", JSON.stringify(orderPayload, null, 2))

    const orderResponse = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      throw new Error(errorData.message || "Failed to place order")
    }

    const orderData = await orderResponse.json()
    console.log("Order placed successfully:", orderData)

    // Fix: Access the order ID from the correct path in the response
    if (orderData && orderData.data && orderData.data.order && orderData.data.order.id) {
      setOrderId(orderData.data.order.id)

      // Show different success messages based on payment method
      if (paymentMethod === "wallet") {
        message.success("Order placed successfully! Payment completed using your wallet balance.")
      } else if (paymentMethod === "cash_on_delivery") {
        message.success("Order placed successfully! You'll pay when your order is delivered.")
      } else {
        message.success("Order placed successfully! Payment completed.")
      }

      dispatch({ type: "CLEAR_CART" })

      // Close the cart modal after a successful order
      if (onClose) {
        onClose()
      }

      // Show receipt modal after a short delay
      if (setIsReceiptModalOpen) {
        setTimeout(() => {
          setIsReceiptModalOpen(true)
        }, 500)
      }
    } else {
      console.error("Order ID not found in response:", orderData)
      message.success("Order placed successfully, but order details are incomplete.")
      dispatch({ type: "CLEAR_CART" })

      // Close the cart modal even if order details are incomplete
      if (onClose) {
        onClose()
      }
    }
  } catch (error: any) {
    console.error("Error creating order:", error)
    message.error(error.message || "Failed to create order. Please try again.")
  } finally {
    if (setIsSubmitting) {
      setIsSubmitting(false)
    }
    if (setPaystackConfig) {
      setPaystackConfig(null)
    }
  }
}

