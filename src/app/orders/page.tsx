/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getAuthToken } from "@/utils/auth"
import OngoingOrders from "@/components/orders/OngoingOrders"
import DeliveredOrders from "@/components/orders/DeliveredOrders"

export default function OrdersPage() {
  const { user } = useAuth()
  const token = getAuthToken()
  const searchParams = useSearchParams()
  const highlightOrderId = searchParams.get("highlight")

  const [activeTab, setActiveTab] = useState<"ongoing" | "delivered">("ongoing")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchOrders()
    }
  }, [user?.id])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.statusCode === 200) {
        setOrders(data.data.orders.orders || [])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const ongoingOrders = orders.filter(
    (order) => !["delivered", "cancelled", "completed"].includes(order.status?.toLowerCase()),
  )

  const deliveredOrders = orders.filter((order) => ["delivered", "completed"].includes(order.status?.toLowerCase()))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-16">Your Orders</h1>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "ongoing"
                    ? "border-[#ff6600] text-[#ff6600]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Ongoing Orders ({ongoingOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("delivered")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "delivered"
                    ? "border-[#ff6600] text-[#ff6600]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Delivered Orders ({deliveredOrders.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "ongoing" ? (
              <OngoingOrders orders={ongoingOrders} highlightOrderId={highlightOrderId} onRefresh={fetchOrders} />
            ) : (
              <DeliveredOrders orders={deliveredOrders} highlightOrderId={highlightOrderId} onRefresh={fetchOrders} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
