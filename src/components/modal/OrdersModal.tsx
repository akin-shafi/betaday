/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OngoingOrders from "@/components/orders/OngoingOrders";
import DeliveredOrders from "@/components/orders/DeliveredOrders";
import { useAuth } from "@/contexts/auth-context";
import { getAuthToken } from "@/utils/auth";
import Link from "next/link";
import LoginModal from "@/components/auth/login-modal";

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  highlightOrderId?: string | null | undefined; // Add highlightOrderId prop
}

const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  onBack,
  highlightOrderId, // Receive highlightOrderId
}) => {
  const { user } = useAuth();
  const token = getAuthToken();
  const [activeTab, setActiveTab] = useState<"ongoing" | "delivered">("ongoing");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false); // Stop loading if no user ID
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
        throw new Error(`Unexpected response: ${data.message || "Unknown error"}`);
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
      !["delivered", "cancelled", "completed"].includes(order.status?.toLowerCase())
  );

  const deliveredOrders = orders.filter((order) =>
    ["delivered", "completed"].includes(order.status?.toLowerCase())
  );

  // Get the business details from the first order (if available)
 

 

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-end"
            onClick={handleBackdropClick}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-[480px] bg-white h-full fixed top-0 right-0 md:w-[480px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-full overflow-y-auto flex items-center justify-center"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your orders...</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  if (error) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-end"
            onClick={handleBackdropClick}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-[480px] bg-white h-full fixed top-0 right-0 md:w-[480px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-full overflow-y-auto flex items-center justify-center"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-end"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-[480px] bg-white h-full fixed top-0 right-0 md:w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-full overflow-y-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* Header with Back Arrow and Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button
                  className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={onBack}
                  aria-label="Back to profile"
                >
                  <ChevronLeft
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
                <h2 className="text-lg font-semibold text-[#292d32]">
                  My Orders
                </h2>
                <button
                  className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
              </div>

              

              {/* Tab Navigation */}
              <div className="bg-white border-b border-gray-200">
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
                    highlightOrderId={highlightOrderId} // Pass highlightOrderId
                    onRefresh={fetchOrders}
                  />
                ) : (
                  <DeliveredOrders
                    orders={deliveredOrders}
                    highlightOrderId={highlightOrderId} // Pass highlightOrderId
                    onRefresh={fetchOrders}
                  />
                )}
              </div>
              {!user?.id && (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="mt-4 mx-6 inline-block bg-[#ff6600] text-white px-6 py-2 rounded-md hover:bg-[#e55c00]"
                >
                  Log In
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </AnimatePresence>
  );
};

export default OrdersModal;