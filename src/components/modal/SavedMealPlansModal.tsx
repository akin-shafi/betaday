// src/components/modal/SavedMealPlansModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedMealPlans } from "@/hooks/useSavedMealPlans";
import ActivateScheduleModal from "@/components/modal/ActivateScheduleModal";

interface SavedMealPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

interface Meal {
  name: string;
  description: string;
  price: number;
}

interface DailyMeal {
  date: string;
  day: string;
  meal: Meal;
}

interface SavedMealPlan {
  id: string;
  mealPlan: { breakfast: DailyMeal[]; lunch: DailyMeal[] };
  totalCost: { breakfast: number; lunch: number };
  deliveryFees: { breakfast: number; lunch: number };
  deliveryAddress: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  numberOfPlates: number;
}

const SavedMealPlansModal: React.FC<SavedMealPlansModalProps> = ({
  isOpen,
  onClose,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"Breakfast" | "Lunch">(
    "Breakfast"
  );
  const [selectedPlan, setSelectedPlan] = useState<SavedMealPlan | null>(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const { savedPlans, loading, error, refetch } = useSavedMealPlans({
    enabled: isOpen,
  });

 

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

  const handleSelectPlan = (plan: SavedMealPlan) => {
    setSelectedPlan(plan);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
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
                    aria-label="Back to profile"
                  >
                    <ChevronLeft
                      size={24}
                      className="transition-transform group-hover:scale-110"
                    />
                    <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  </button>
                  <h2 className="text-lg font-semibold text-[#292d32]">
                    Saved Meal Plans
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
                  {/* Saved Plans List */}
                  {loading && (
                    <p className="text-center text-gray-500">Loading...</p>
                  )}
                  {error && (
                    <p className="text-center text-red-500">
                      {error.includes("No authentication token available")
                        ? "Please log in to view your saved meal plans."
                        : error}
                    </p>
                  )}
                  {!loading && !error && savedPlans.length === 0 && (
                    <p className="text-center text-gray-500">
                      No saved meal plans found.
                    </p>
                  )}
                  {!loading && !error && savedPlans.length > 0 && (
                    <div className="space-y-4">
                      {savedPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelectPlan(plan)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[#292d32]">
                              {formatDate(plan.startDate)} -{" "}
                              {formatDate(plan.endDate)}
                            </span>
                            <span
                              className={`text-sm ${
                                plan.status === "active"
                                  ? "text-green-500"
                                  : "orce text-red-500"
                              }`}
                            >
                              {plan.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-[#292d32] mt-1">
                            Address: {plan.deliveryAddress}
                          </p>
                          <p className="text-sm text-[#292d32] mt-1">
                            Total Cost: ₦
                            {(
                              plan.totalCost.breakfast +
                              plan.totalCost.lunch +
                              plan.deliveryFees.breakfast +
                              plan.deliveryFees.lunch
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected Plan Details */}
                  {selectedPlan && (
                    <>
                      {/* Tabs */}
                      <div className="flex border-b border-gray-200">
                        <button
                          className={`flex-1 py-3 text-center text-sm font-medium ${
                            activeTab === "Breakfast"
                              ? "bg-[#1A3C34] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          onClick={() => setActiveTab("Breakfast")}
                        >
                          Breakfast
                        </button>
                        <button
                          className={`flex-1 py-3 text-center text-sm font-medium ${
                            activeTab === "Lunch"
                              ? "bg-[#1A3C34] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          onClick={() => setActiveTab("Lunch")}
                        >
                          Lunch
                        </button>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-4">
                        {(activeTab === "Breakfast"
                          ? selectedPlan.mealPlan.breakfast
                          : selectedPlan.mealPlan.lunch
                        ).map((dailyMeal, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-[#292d32]">
                                {dailyMeal.day}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-[#292d32]">
                                {dailyMeal.meal.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {dailyMeal.meal.description}
                              </p>
                              <p className="text-sm text-[#292d32] mt-1">
                                ₦{dailyMeal.meal.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                          Summary
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">
                            Total Cost
                          </span>
                          <span className="text-sm text-[#292d32]">
                            ₦
                            {(
                              selectedPlan.totalCost.breakfast +
                              selectedPlan.totalCost.lunch +
                              selectedPlan.deliveryFees.breakfast +
                              selectedPlan.deliveryFees.lunch
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">
                            Delivery Address
                          </span>
                          <span className="text-sm text-[#292d32]">
                            {selectedPlan.deliveryAddress}
                          </span>
                        </div>
                        {selectedPlan.mealPlan.breakfast.length > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">
                              Breakfast Delivery Time
                            </span>
                            <span className="text-sm text-[#292d32]">
                              8:00 AM - 11:00 AM
                            </span>
                          </div>
                        )}
                        {selectedPlan.mealPlan.lunch.length > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">
                              Lunch Delivery Time
                            </span>
                            <span className="text-sm text-[#292d32]">
                              12:00 PM - 3:00 PM
                            </span>
                          </div>
                        )}
                        {selectedPlan.status === "inactive" && (
                          <button
                            className="w-full py-3 mt-2 bg-[#FF6600] text-white rounded-lg"
                            onClick={() => setIsActivateModalOpen(true)}
                          >
                            Activate Plan
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activate Schedule Modal for Saved Plans */}
      {selectedPlan && (
        <ActivateScheduleModal
          isOpen={isActivateModalOpen}
          onClose={() => setIsActivateModalOpen(false)}
          onBack={() => setIsActivateModalOpen(false)}
          mealPlan={selectedPlan.mealPlan}
          costs={selectedPlan.totalCost}
          deliveryFees={selectedPlan.deliveryFees}
          deliveryAddress={selectedPlan.deliveryAddress}
          startDate={selectedPlan.startDate}
          endDate={selectedPlan.endDate}
          onReset={() => {
            refetch();
            setIsActivateModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default SavedMealPlansModal;
