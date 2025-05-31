"use client"

import { useState } from "react"
import { Clock, MapPin, Package, Phone, MessageCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface Order {
  id: string
  status: string
  totalAmount: number
  deliveryAddress: string
  createdAt: string
  estimatedDeliveryTime?: string
  orderItems: Array<{
    productName: string
    quantity: number
    unitPrice: number
  }>
  business?: {
    name: string
    phone?: string
  }
}

interface OngoingOrdersProps {
  orders: Order[]
  highlightOrderId?: string | null | undefined
  onRefresh: () => void
}

export default function OngoingOrders({ orders, highlightOrderId, onRefresh }: OngoingOrdersProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(highlightOrderId || null)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Order Pending"
      case "confirmed":
        return "Order Confirmed"
      case "preparing":
        return "Being Prepared"
      case "ready":
        return "Ready for Pickup"
      case "out_for_delivery":
        return "Out for Delivery"
      default:
        return status
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No ongoing orders</h3>
        <p className="text-gray-500">When you place an order, it will appear here.</p>
        <button onClick={onRefresh} className="mt-4 text-[#ff6600] underline hover:text-[#e65c00]">
          Refresh orders
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={onRefresh} className="text-sm text-[#ff6600] hover:text-[#e65c00] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 01-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Refresh
        </button>
      </div>
      {orders.map((order) => (
        <div
          key={order.id}
          className={`border rounded-lg transition-all duration-200 ${
            order.id === highlightOrderId
              ? "border-[#ff6600] bg-orange-50 shadow-md"
              : "border-gray-200 bg-white hover:shadow-sm"
          }`}
        >
          <div
            className="p-4 cursor-pointer"
            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate max-w-xs">{order.deliveryAddress}</span>
              </div>
              <span className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</span>
            </div>

            {order.estimatedDeliveryTime && (
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>Estimated delivery: {new Date(order.estimatedDeliveryTime).toLocaleString()}</span>
              </div>
            )}
          </div>

          {expandedOrder === order.id && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-2 mb-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {order.business && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.business.name}</p>
                    {order.business.phone && <p className="text-sm text-gray-500">{order.business.phone}</p>}
                  </div>
                  <div className="flex space-x-2">
                    {order.business.phone && (
                      <button className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </button>
                    )}
                    <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
