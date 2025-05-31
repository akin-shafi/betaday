/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Package, MapPin, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getAuthToken } from "@/utils/auth";

interface OrderDetails {
  id: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  estimatedDeliveryTime?: string;
  orderItems: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  business?: {
    name: string;
    phone?: string;
  };
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const token = getAuthToken();

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("orderId");

    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrderDetails(data.data.order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = () => {
    // Navigate to orders page with tracking
    router.push(`/orders?track=${orderDetails?.id}`);
  };

  const handleViewAllOrders = () => {
    router.push("/orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll start preparing it right away.
          </p>

          {orderDetails && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 mb-1">
                <strong>Order ID:</strong> {orderDetails.id}
              </p>
              <p className="text-sm text-green-800">
                <strong>Total Amount:</strong> ₦
                {orderDetails.totalAmount.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Order Details
            </h2>

            <div className="space-y-3 mb-6">
              {orderDetails.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      {item.productName}
                    </span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    ₦{(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ₦{orderDetails.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Information */}
        {orderDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Delivery Information
            </h2>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Delivery Address</span>
                <p className="text-gray-900">{orderDetails.deliveryAddress}</p>
              </div>

              {orderDetails.estimatedDeliveryTime && (
                <div>
                  <span className="text-sm text-gray-500">
                    Estimated Delivery
                  </span>
                  <p className="text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(
                      orderDetails.estimatedDeliveryTime
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <span className="text-sm text-gray-500">Status</span>
                <p className="text-gray-900 capitalize">
                  {orderDetails.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTrackOrder}
            className="w-full bg-[#ff6600] text-white py-4 rounded-lg font-medium hover:bg-[#e65c00] transition-colors flex items-center justify-center"
          >
            Track Your Order
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>

          <button
            onClick={handleViewAllOrders}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            View All Orders
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
