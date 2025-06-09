/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSessionToken } from "@/utils/session"

interface OrderItem {
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface Order {
  id: string
  userId: string
  businessId: string
  orderItems: OrderItem[]
  totalAmount: number
  status: string
  deliveryAddress: string
  deliveredAt?: string
  createdAt: string
  business?: {
    name: string
    phone?: string
  }
}

export const useOrder = () => {
  const { user, isAuthenticated } = useAuth()
  const [ongoingOrders, setOngoingOrders] = useState<Order[]>([])
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id && isAuthenticated) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user?.id, isAuthenticated])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get token from the new session system
      const token = getSessionToken()

      if (!token) {
        setError("No authentication token found")
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please login again.")
          // You might want to trigger a logout here
          return
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        const orders = data.data.orders || []

        // Separate ongoing and delivered orders
        const ongoing = orders.filter(
          (order: Order) => !["delivered", "cancelled", "completed"].includes(order.status.toLowerCase()),
        )
        const delivered = orders.filter((order: Order) =>
          ["delivered", "completed"].includes(order.status.toLowerCase()),
        )

        setOngoingOrders(ongoing)
        setDeliveredOrders(delivered)
      } else {
        setError(data.message || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const refetchOrders = () => {
    if (user?.id && isAuthenticated) {
      fetchOrders()
    }
  }

  return {
    ongoingOrders,
    deliveredOrders,
    loading,
    error,
    refetchOrders,
  }
}
