/* eslint-disable @typescript-eslint/no-explicit-any */
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500" // Update this to your actual backend URL

export interface PaymentInitializeRequest {
  amount: number
  currency: string
  email: string
  phone?: string
  provider: "paystack" | "opay"
  paymentMethod: string
  reference?: string // Make it optional since we'll generate if not provided
  metadata?: any
  callbackUrl?: string
  returnUrl?: string
}

export interface WalletFundRequest {
  userId: string
  amount: number
  reference: string
  provider: "paystack" | "opay"
  paymentMethod: string
  email?: string
  phone?: string
  callbackUrl?: string
  returnUrl?: string
  metadata?: any
}

export interface ProcessOrderRequest {
  orderId: string
  userId: string
  paymentReference: string
  provider: "paystack" | "opay" | "wallet" | "cash"
  paymentMethod: string
}

class UnifiedPaymentService {
  private getAuthHeaders(token: string) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  async initializePayment(data: PaymentInitializeRequest, token: string) {
    try {
      // Generate reference if not provided
      const paymentData = {
        ...data,
        reference: data.reference || this.generateReference("pay"),
      }

      const response = await fetch(`${baseUrl}/api/payments/initialize`, {
        method: "POST",
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to initialize payment")
      }

      return result
    } catch (error: any) {
      console.error("Payment initialization error:", error)
      throw error
    }
  }

  async verifyPayment(reference: string, provider: "paystack" | "opay", token: string) {
    try {
      const response = await fetch(`${baseUrl}/api/payments/verify`, {
        method: "POST",
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ reference, provider }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to verify payment")
      }

      return result
    } catch (error: any) {
      console.error("Payment verification error:", error)
      throw error
    }
  }

  async processOrder(data: ProcessOrderRequest, token: string) {
    try {
      const response = await fetch(`${baseUrl}/api/payments/process-order`, {
        method: "POST",
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to process order")
      }

      return result
    } catch (error: any) {
      console.error("Order processing error:", error)
      throw error
    }
  }

  async fundWallet(data: WalletFundRequest, token: string) {
    try {
      const response = await fetch(`${baseUrl}/api/payments/fund-wallet`, {
        method: "POST",
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to fund wallet")
      }

      return result
    } catch (error: any) {
      console.error("Wallet funding error:", error)
      throw error
    }
  }

  async getWalletBalance(userId: string, token: string) {
    try {
      const response = await fetch(`${baseUrl}/api/payments/wallet/balance/${userId}`, {
        method: "GET",
        headers: this.getAuthHeaders(token),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to get wallet balance")
      }

      return result
    } catch (error: any) {
      console.error("Get wallet balance error:", error)
      throw error
    }
  }

  async getWalletDetails(userId: string, token: string) {
    try {
      const response = await fetch(`${baseUrl}/api/payments/wallet/${userId}`, {
        method: "GET",
        headers: this.getAuthHeaders(token),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to get wallet details")
      }

      return result
    } catch (error: any) {
      console.error("Get wallet details error:", error)
      throw error
    }
  }

  async getPaymentHistory(userId: string, token: string) {
    try {
      const response = await fetch(`${baseUrl}/api/payments/history/${userId}`, {
        method: "GET",
        headers: this.getAuthHeaders(token),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to get payment history")
      }

      return result
    } catch (error: any) {
      console.error("Get payment history error:", error)
      throw error
    }
  }

  // Generate a unique reference for payments
  generateReference(prefix = "pay"): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
  }

  // Helper method to determine provider based on payment method
  getProviderFromPaymentMethod(paymentMethod: string): "paystack" | "opay" {
    const opayMethods = ["opay_card", "opay_bank", "opay_wallet", "opay_ussd"]
    return opayMethods.includes(paymentMethod) ? "opay" : "paystack"
  }

  // Helper method to map frontend payment methods to backend format
  mapPaymentMethod(method: string): string {
    const methodMap: { [key: string]: string } = {
      "Pay with Card": "card",
      "Pay with Bank Transfer": "bank_transfer",
      "Pay with USSD": "ussd",
      "Pay with QR Code": "qr",
      "Opay Card": "opay_card",
      "Opay Bank Transfer": "opay_bank",
      "Opay Wallet": "opay_wallet",
      "Opay USSD": "opay_ussd",
      Wallet: "wallet",
    }
    return methodMap[method] || method.toLowerCase().replace(/\s+/g, "_")
  }
}

export const unifiedPaymentService = new UnifiedPaymentService()


