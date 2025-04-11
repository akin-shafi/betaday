// src/components/modal/OrdersModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OngoingOrders from "@/components/orders/OngoingOrders";
import DeliveredOrders from "@/components/orders/DeliveredOrders";

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"Ongoing" | "Delivered">(
    "Ongoing"
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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

              {/* Tabs for Ongoing and Delivered */}
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-3 text-center text-sm font-medium ${
                    activeTab === "Ongoing"
                      ? "bg-[#1A3C34] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Ongoing")}
                >
                  Ongoing
                </button>
                <button
                  className={`flex-1 py-3 text-center text-sm font-medium ${
                    activeTab === "Delivered"
                      ? "bg-[#1A3C34] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Delivered")}
                >
                  Delivered
                </button>
              </div>

              {/* Render the appropriate component based on the active tab */}
              {activeTab === "Ongoing" ? (
                <OngoingOrders />
              ) : (
                <DeliveredOrders />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrdersModal;
