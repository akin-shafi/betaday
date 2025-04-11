// src/components/modal/ActivateScheduleModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMealPlan } from "@/hooks/useMealPlan";

interface ActivateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  mealPlan: any;
  costs: { breakfast: number; lunch: number };
  deliveryFees: { breakfast: number; lunch: number };
  deliveryAddress: string;
  startDate: string;
  endDate: string; // Add endDate
  onReset: () => void;
}

const ActivateScheduleModal: React.FC<ActivateScheduleModalProps> = ({
  isOpen,
  onClose,
  onBack,
  mealPlan,
  costs,
  deliveryFees,
  deliveryAddress,
  startDate,
  endDate,
  onReset,
}) => {
  const [selectedPlans, setSelectedPlans] = useState<{
    breakfast: boolean;
    lunch: boolean;
  }>({
    breakfast: false,
    lunch: false,
  });
  const [numberOfPlates, setNumberOfPlates] = useState<number>(1); // Add state for number of plates
  const [paymentMethod, setPaymentMethod] = useState<
    "wallet" | "online" | null
  >(null);
  const { activateSchedule, loading, error } = useMealPlan();

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

  // Calculate total cost based on selected plans and number of plates
  const baseTotalCost =
    (selectedPlans.breakfast ? costs.breakfast + deliveryFees.breakfast : 0) +
    (selectedPlans.lunch ? costs.lunch + deliveryFees.lunch : 0);
  const totalCost = baseTotalCost * numberOfPlates;

  const handleActivate = async () => {
    if (!selectedPlans.breakfast && !selectedPlans.lunch) return;
    const response = await activateSchedule({
      mealPlan: {
        breakfast: selectedPlans.breakfast ? mealPlan.breakfast : [],
        lunch: selectedPlans.lunch ? mealPlan.lunch : [],
      },
      totalCost,
      deliveryAddress,
      startDate,
      endDate,
      paymentMethod: paymentMethod || "wallet",
      numberOfPlates,
      userId: "",
    });
    if (response) {
      onReset();
      onClose();
    }
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

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button
                  className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={onBack}
                  aria-label="Back to meal plan"
                >
                  <ChevronLeft
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
                <h2 className="text-lg font-semibold text-[#292d32]">
                  Activate Meal Plan
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

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Selection */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                    Select Meal Plans
                  </h3>
                  {costs.breakfast > 0 && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPlans.breakfast}
                        onChange={() =>
                          setSelectedPlans((prev) => ({
                            ...prev,
                            breakfast: !prev.breakfast,
                          }))
                        }
                      />
                      <span className="text-sm text-[#292d32]">
                        Breakfast (₦
                        {(
                          costs.breakfast + deliveryFees.breakfast
                        ).toLocaleString()}
                        )
                      </span>
                    </label>
                  )}
                  {costs.lunch > 0 && (
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={selectedPlans.lunch}
                        onChange={() =>
                          setSelectedPlans((prev) => ({
                            ...prev,
                            lunch: !prev.lunch,
                          }))
                        }
                      />
                      <span className="text-sm text-[#292d32]">
                        Lunch (₦
                        {(costs.lunch + deliveryFees.lunch).toLocaleString()})
                      </span>
                    </label>
                  )}
                </div>

                {/* Number of Plates */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                    Number of Plates
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      onClick={() =>
                        setNumberOfPlates((prev) => Math.max(1, prev - 1))
                      }
                      disabled={numberOfPlates <= 1}
                    >
                      -
                    </button>
                    <span className="text-sm text-[#292d32]">
                      {numberOfPlates}
                    </span>
                    <button
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      onClick={() => setNumberOfPlates((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                    Summary
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      Total Cost (for 1 plate)
                    </span>
                    <span className="text-sm text-[#292d32]">
                      ₦{baseTotalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      Number of Plates
                    </span>
                    <span className="text-sm text-[#292d32]">
                      {numberOfPlates}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#292d32]">
                      Total Cost
                    </span>
                    <span className="text-sm font-semibold text-[#292d32]">
                      ₦{totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      Delivery Address
                    </span>
                    <span className="text-sm text-[#292d32]">
                      {deliveryAddress}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Date Range</span>
                    <span className="text-sm text-[#292d32]">
                      {new Date(startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      -
                      {new Date(endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {selectedPlans.breakfast && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Breakfast Delivery Time
                      </span>
                      <span className="text-sm text-[#292d32]">
                        8:00 AM - 11:00 AM
                      </span>
                    </div>
                  )}
                  {selectedPlans.lunch && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Lunch Delivery Time
                      </span>
                      <span className="text-sm text-[#292d32]">
                        12:00 PM - 3:00 PM
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                    Payment Method
                  </h3>
                  <button
                    className={`w-full py-2 mb-2 rounded-lg ${
                      paymentMethod === "wallet"
                        ? "bg-[#FF6600] text-white"
                        : "bg-gray-100 text-[#292d32]"
                    }`}
                    onClick={() => setPaymentMethod("wallet")}
                  >
                    Pay with Wallet
                  </button>
                  <button
                    className={`w-full py-2 rounded-lg ${
                      paymentMethod === "online"
                        ? "bg-[#FF6600] text-white"
                        : "bg-gray-100 text-[#292d32]"
                    }`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    Pay Online
                  </button>
                  {paymentMethod === "online" && (
                    <div className="mt-4 space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full p-2 border border-gray-200 rounded-lg"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Expiry (MM/YY)"
                          className="w-1/2 p-2 border border-gray-200 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-1/2 p-2 border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Button */}
                <button
                  className={`w-full py-3 rounded-lg text-white ${
                    (selectedPlans.breakfast || selectedPlans.lunch) &&
                    paymentMethod
                      ? "bg-[#FF6600]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  onClick={handleActivate}
                  disabled={
                    !(selectedPlans.breakfast || selectedPlans.lunch) ||
                    !paymentMethod ||
                    loading
                  }
                >
                  {loading ? "Activating..." : "Confirm Payment"}
                </button>

                {/* Error Display */}
                {error && (
                  <p className="text-center text-red-500 py-4">{error}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ActivateScheduleModal;
