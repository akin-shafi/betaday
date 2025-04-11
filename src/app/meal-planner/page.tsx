"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import PlanSetup from "@/components/meal-plan/PlanSetup";
import MealSelection from "@/components/meal-plan/MealSelection";
import SummaryActivation from "@/components/meal-plan/SummaryActivation";
import { useMealPlan, Meal, MealPlan } from "@/hooks/useMealPlan";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { useAuth } from "@/contexts/auth-context";
import LoginModal from "@/components/auth/login-modal";

const MealPlanner: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"Breakfast" | "Lunch">(
    "Breakfast"
  );
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [costs, setCosts] = useState<{ breakfast: number; lunch: number }>({
    breakfast: 0,
    lunch: 0,
  });
  const [deliveryFees, setDeliveryFees] = useState<{
    breakfast: number;
    lunch: number;
  }>({ breakfast: 0, lunch: 0 });
  const [selectedPlans, setSelectedPlans] = useState<{
    breakfast: boolean;
    lunch: boolean;
  }>({ breakfast: false, lunch: false });
  const [numberOfPlates, setNumberOfPlates] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "wallet" | "online" | null
  >(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const {
    generateMealPlan,
    calculateCost,
    activateSchedule,
    saveMealPlan,
    loading,
    error,
  } = useMealPlan();
  const {
    input,
    setInput,
    suggestions,
    loading: addressLoading,
    error: addressError,
  } = useAddressAutocomplete();

  const handleGenerateMealPlan = async () => {
    if (!startDate || !endDate || !deliveryAddress) return;
    const response = await generateMealPlan({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      deliveryAddress,
    });
    if (response) {
      setMealPlan(response.mealPlan);
      setStep(2);
    }
  };

  const handleCalculateCost = async (type: "breakfast" | "lunch") => {
    if (!mealPlan || !deliveryAddress) return;
    const response = await calculateCost({
      mealPlan: mealPlan[type],
      deliveryAddress,
    });
    if (response) {
      setCosts((prev) => ({ ...prev, [type]: Number(response.totalCost) }));
      setDeliveryFees((prev) => ({
        ...prev,
        [type]: Number(response.deliveryFee),
      }));
    }
  };

  const handleSwapMeal = async (
    type: "breakfast" | "lunch",
    index: number,
    newMeal: Meal
  ) => {
    if (!mealPlan || !mealPlan[type] || !mealPlan[type][index]) return;
    const updatedPlan: MealPlan = {
      breakfast: [...mealPlan.breakfast],
      lunch: [...mealPlan.lunch],
    };
    updatedPlan[type][index] = { ...updatedPlan[type][index], meal: newMeal };
    setMealPlan(updatedPlan);
    if (costs[type] > 0) await handleCalculateCost(type);
  };

  const handleNextToSummary = async () => {
    if (!mealPlan || !deliveryAddress) return;

    // Calculate costs for both breakfast and lunch if not already done
    if (costs.breakfast === 0 && mealPlan.breakfast.length > 0) {
      await handleCalculateCost("breakfast");
    }
    if (costs.lunch === 0 && mealPlan.lunch.length > 0) {
      await handleCalculateCost("lunch");
    }

    // Only proceed if at least one cost is calculated
    if (costs.breakfast > 0 || costs.lunch > 0) {
      if (!isAuthenticated) {
        setIsLoginModalOpen(true); // Show login modal if not authenticated
      } else {
        setStep(3); // Proceed to step 3 if authenticated
      }
    }
  };

  const handleSaveForLater = async (userId: string) => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!mealPlan || !startDate || !endDate || !deliveryAddress) return;
    const response = await saveMealPlan({
      userId,
      mealPlan,
      totalCost: costs,
      deliveryFees,
      deliveryAddress,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    if (response) {
      resetFields();
      // router.push("/profile");
    }
  };

  const handleActivate = async (userId: string) => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!selectedPlans.breakfast && !selectedPlans.lunch) return;
    const baseTotalCost: number =
      (selectedPlans.breakfast ? costs.breakfast + deliveryFees.breakfast : 0) +
      (selectedPlans.lunch ? costs.lunch + deliveryFees.lunch : 0);
    const totalCost: number = baseTotalCost * numberOfPlates;
    const response = await activateSchedule({
      userId,
      mealPlan: {
        breakfast: selectedPlans.breakfast ? mealPlan!.breakfast : [],
        lunch: selectedPlans.lunch ? mealPlan!.lunch : [],
      },
      totalCost,
      deliveryAddress,
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
      paymentMethod: paymentMethod || "wallet",
      numberOfPlates,
    });
    if (response) {
      resetFields();
      router.push("/profile");
    }
  };

  const resetFields = () => {
    setStep(1);
    setStartDate(new Date());
    setEndDate(null);
    setDeliveryAddress("");
    setInput("");
    setMealPlan(null);
    setCosts({ breakfast: 0, lunch: 0 });
    setDeliveryFees({ breakfast: 0, lunch: 0 });
    setSelectedPlans({ breakfast: false, lunch: false });
    setNumberOfPlates(1);
    setPaymentMethod(null);
  };

  return (
    // <div className="min-h-screen relative overflow-hidden bg-[#fdf6e9]">

    <div className="relative z-10 bg-[#fdf6e9]">
      {/* <Header /> */}
      <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
        <div className="p-4 bg-[#FF6600]/10 border-b border-gray-200 mb-4">
          <h3 className="text-lg font-semibold text-[#1A3C34] mb-2">
            Your Perfect Weekly Meal Plan Awaits! 🍽️
          </h3>
          <p className="text-sm text-[#292d32]">
            Say goodbye to meal planning stress! With our Weekly Meal Plan, you
            get a delicious, hassle-free menu for breakfast and lunch, tailored
            just for you. Pick your start date, set your delivery address, and
            we’ll deliver fresh meals straight to your door—saving you time and
            effort. Customize, save for later, or activate your plan today!
          </p>
        </div>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex justify-between items-center">
              {["Plan Setup", "Meal Selection", "Summary & Activation"].map(
                (label, index) => (
                  <div key={index} className="flex-1 text-center">
                    <div className="flex items-center justify-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= index + 1
                            ? "bg-[#FF6600] text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < 2 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            step > index + 1 ? "bg-[#FF6600]" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                    <p className="text-sm mt-2 text-[#292d32]">{label}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {step === 1 && (
              <PlanSetup
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                input={input}
                setInput={setInput}
                suggestions={suggestions}
                addressLoading={addressLoading}
                addressError={addressError}
                handleGenerateMealPlan={handleGenerateMealPlan}
                loading={loading}
                router={router}
              />
            )}
            {step === 2 && (
              <MealSelection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                mealPlan={mealPlan}
                costs={costs}
                deliveryFees={deliveryFees}
                deliveryAddress={deliveryAddress}
                handleCalculateCost={handleCalculateCost}
                handleSwapMeal={handleSwapMeal}
                setStep={setStep}
                loading={loading}
                handleNextToSummary={handleNextToSummary}
              />
            )}
            {step === 3 && (
              <SummaryActivation
                mealPlan={mealPlan}
                costs={costs}
                deliveryFees={deliveryFees}
                selectedPlans={selectedPlans}
                setSelectedPlans={setSelectedPlans}
                numberOfPlates={numberOfPlates}
                setNumberOfPlates={setNumberOfPlates}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                deliveryAddress={deliveryAddress}
                startDate={startDate}
                endDate={endDate}
                handleSaveForLater={handleSaveForLater}
                handleActivate={handleActivate}
                setStep={setStep}
                loading={loading}
              />
            )}
            {error && <p className="text-center text-red-500 py-4">{error}</p>}
          </div>
        </div>
      </main>
      {/* <Footer /> */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default MealPlanner;
