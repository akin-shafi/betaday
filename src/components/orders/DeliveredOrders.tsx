"use client";

import { useState } from "react";
import { CheckCircle, MapPin, Star, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  deliveredAt?: string;
  orderItems: Array<{
    productName?: string;
    quantity: number;
    unitPrice?: number;
    name?: string;
    itemId?: string;
    price?: number;
  }>;
  business?: {
    name: string;
  };
  rating?: number;
}

interface DeliveredOrdersProps {
  orders: Order[];
  highlightOrderId?: string | null;
  onRefresh: () => void;
}

export default function DeliveredOrders({
  orders,
  highlightOrderId,
  onRefresh,
}: DeliveredOrdersProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(
    highlightOrderId || null
  );

  const handleReorder = (order: Order) => {
    // Implement reorder functionality
    console.log("Reordering:", order.id);
  };

  const handleRateOrder = (orderId: string) => {
    // Implement rating functionality
    console.log("Rating order:", orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No delivered orders
        </h3>
        <p className="text-gray-500">Your completed orders will appear here.</p>
        <button
          onClick={onRefresh}
          className="mt-4 text-[#ff6600] underline hover:text-[#e65c00]"
        >
          Refresh orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className="text-sm text-[#ff6600] hover:text-[#e65c00] flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
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
            onClick={() =>
              setExpandedOrder(expandedOrder === order.id ? null : order.id)
            }
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Order #{order.id.slice(-8)}
                </h3>
                <p className="text-sm text-gray-500">
                  Delivered on{" "}
                  {order.deliveredAt
                    ? new Date(order.deliveredAt).toLocaleDateString()
                    : new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Delivered
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm text-[#292d32] truncate-text max-w-[50%]">
                  {order.deliveryAddress}
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {formatPrice(order.totalAmount)}
              </span>
            </div>

            {order.business && (
              <p className="text-sm text-gray-600 mt-2">
                From {order.business.name}
              </p>
            )}
          </div>

          {expandedOrder === order.id && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-2 mb-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700">
                      {item.name ||
                        `Item ${item.itemId?.slice(-8) || "Unknown"}`}{" "}
                      x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {item.price
                        ? formatPrice(item.price * item.quantity)
                        : "Price not available"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {order.rating ? (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">
                        Rated {order.rating}/5
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRateOrder(order.id)}
                      className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200 transition-colors"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Rate Order
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleReorder(order)}
                  className="flex items-center px-3 py-1 bg-[#ff6600] text-white rounded-md text-sm hover:bg-[#e65c00] transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reorder
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
