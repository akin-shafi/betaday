import React, { useState } from "react";
import LoginModal from "@/components/auth/login-modal";
import { useAuth } from "@/contexts/auth-context";

interface DailyMeal {
  date: string;
  day: string;
  meal: { name: string; description: string; price: number };
}

interface MealPlan {
  breakfast: DailyMeal[];
  lunch: DailyMeal[];
}

interface SummaryActivationProps {
  mealPlan: MealPlan | null;
  costs: { breakfast: number; lunch: number };
  deliveryFees: { breakfast: number; lunch: number };
  selectedPlans: { breakfast: boolean; lunch: boolean };
  setSelectedPlans: React.Dispatch<
    React.SetStateAction<{ breakfast: boolean; lunch: boolean }>
  >;
  numberOfPlates: number;
  setNumberOfPlates: React.Dispatch<React.SetStateAction<number>>;
  paymentMethod: "wallet" | "online" | null;
  setPaymentMethod: (method: "wallet" | "online" | null) => void;
  deliveryAddress: string;
  startDate: Date | null;
  endDate: Date | null;
  handleSaveForLater: (userId: string) => Promise<void>;
  handleActivate: (userId: string) => Promise<void>;
  setStep: (step: number) => void;
  loading: boolean;
}

const SummaryActivation: React.FC<SummaryActivationProps> = ({
  // mealPlan,
  costs,
  deliveryFees,
  selectedPlans,
  setSelectedPlans,
  numberOfPlates,
  setNumberOfPlates,
  paymentMethod,
  setPaymentMethod,
  deliveryAddress,
  startDate,
  endDate,
  handleSaveForLater,
  handleActivate,
  setStep,
  loading,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSaveClick = () => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true);
    } else {
      handleSaveForLater(user.id);
    }
  };

  const handleActivateClick = () => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true);
    } else {
      handleActivate(user.id);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#292d32] mb-4">
        Summary & Activation
      </h2>

      {/* Select Plans */}
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
              {(costs.breakfast + deliveryFees.breakfast).toLocaleString()})
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
              Lunch (₦{(costs.lunch + deliveryFees.lunch).toLocaleString()})
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
            onClick={() => setNumberOfPlates((prev) => Math.max(1, prev - 1))}
            disabled={numberOfPlates <= 1}
          >
            -
          </button>
          <span className="text-sm text-[#292d32]">{numberOfPlates}</span>
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
        <h3 className="text-sm font-semibold text-[#292d32] mb-2">Summary</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Total Cost (for 1 plate)
          </span>
          <span className="text-sm text-[#292d32]">
            ₦
            {(
              (selectedPlans.breakfast
                ? costs.breakfast + deliveryFees.breakfast
                : 0) +
              (selectedPlans.lunch ? costs.lunch + deliveryFees.lunch : 0)
            ).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Number of Plates</span>
          <span className="text-sm text-[#292d32]">{numberOfPlates}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-[#292d32]">
            Total Cost
          </span>
          <span className="text-sm font-semibold text-[#292d32]">
            ₦
            {(
              ((selectedPlans.breakfast
                ? costs.breakfast + deliveryFees.breakfast
                : 0) +
                (selectedPlans.lunch ? costs.lunch + deliveryFees.lunch : 0)) *
              numberOfPlates
            ).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Delivery Address</span>
          <span className="text-sm text-[#292d32]">{deliveryAddress}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Date Range</span>
          <span className="text-sm text-[#292d32]">
            {startDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -
            {endDate?.toLocaleDateString("en-US", {
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
            <span className="text-sm text-[#292d32]">8:00 AM - 11:00 AM</span>
          </div>
        )}
        {selectedPlans.lunch && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Lunch Delivery Time</span>
            <span className="text-sm text-[#292d32]">12:00 PM - 3:00 PM</span>
          </div>
        )}
      </div>

      {/* Payment Method */}
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

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          className="flex-1 py-3 bg-gray-500 text-white cursor-pointer rounded-lg transition duration-200 hover:bg-gray-600 hover:shadow-md"
          onClick={() => setStep(2)}
        >
          Back
        </button>
        <button
          className="flex-1 py-3 bg-[#1A2E20] text-white cursor-pointer rounded-lg transition duration-200 hover:bg-[#2A4A34] hover:shadow-md disabled:opacity-50"
          onClick={handleSaveClick}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save for Later"}
        </button>
        <button
          className={`flex-1 py-3 rounded-lg text-white cursor-pointer transition duration-200 ${
            (selectedPlans.breakfast || selectedPlans.lunch) && paymentMethod
              ? "bg-[#FF6600] hover:bg-[#E65C00] hover:shadow-md"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleActivateClick}
          disabled={
            !(selectedPlans.breakfast || selectedPlans.lunch) ||
            !paymentMethod ||
            loading
          }
        >
          {loading ? "Activating..." : "Confirm Payment"}
        </button>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default SummaryActivation;
