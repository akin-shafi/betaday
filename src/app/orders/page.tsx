/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getSessionToken } from "@/utils/session"; // Updated import
import OngoingOrders from "@/components/orders/OngoingOrders";
import DeliveredOrders from "@/components/orders/DeliveredOrders";
import LoginModal from "@/components/auth/login-modal";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const token = getSessionToken();
  const searchParams = useSearchParams();
  const highlightOrderId = searchParams.get("highlight");
  const [activeTab, setActiveTab] = useState<"ongoing" | "delivered">(
    "ongoing"
  );
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false); // Stop loading if no user ID, but don't open modal
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.statusCode === 200) {
        setOrders(data.data.orders.orders || []);
      } else {
        throw new Error(
          `Unexpected response: ${data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const ongoingOrders = orders.filter(
    (order) =>
      !["delivered", "cancelled", "completed"].includes(
        order.status?.toLowerCase()
      )
  );

  const deliveredOrders = orders.filter((order) =>
    ["delivered", "completed"].includes(order.status?.toLowerCase())
  );

  // Get the business details from the first order (if available)
  const firstOrderBusiness = orders.length > 0 ? orders[0].business : null;

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
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Error</h1>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 inline-block bg-[#ff6600] text-white px-6 py-2 rounded-md hover:bg-[#e55c00]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back to Business Link */}
        {firstOrderBusiness && (
          <Link
            href={`/store`}
            className="flex items-center text-[#ff6600] hover:text-[#e55c00] mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Businesses</span>
          </Link>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

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
              <OngoingOrders
                orders={ongoingOrders}
                highlightOrderId={highlightOrderId}
                onRefresh={fetchOrders}
              />
            ) : (
              <DeliveredOrders
                orders={deliveredOrders}
                highlightOrderId={highlightOrderId}
                onRefresh={fetchOrders}
              />
            )}
          </div>
        </div>
        {!user?.id && (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="mt-4 inline-block bg-[#ff6600] text-white px-6 py-2 rounded-md hover:bg-[#e55c00]"
          >
            Log In
          </button>
        )}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    </div>
  );
}
