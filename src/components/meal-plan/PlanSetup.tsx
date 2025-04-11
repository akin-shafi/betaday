/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAddressVerification } from "@/hooks/useAddressVerification";
import Image from "next/image";
import JoinWaitlistModal from "@/components/modal/join-waitlist-modal"; // Adjust the import path as needed

interface PlanSetupProps {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  input: string;
  setInput: (input: string) => void;
  suggestions: {
    description: string;
    details: {
      formattedAddress: string;
      state?: string;
      localGovernment?: string;
      locality?: string;
    } | null;
  }[];
  addressLoading: boolean;
  addressError: string | null;
  handleGenerateMealPlan: () => Promise<void>;
  loading: boolean;
  router: { push: (path: string) => void };
}

const PlanSetup: React.FC<PlanSetupProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  deliveryAddress,
  setDeliveryAddress,
  input,
  setInput,
  suggestions,
  addressLoading,
  addressError,
  handleGenerateMealPlan,
  loading,
  router,
}) => {
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<{
    formattedAddress: string;
    state?: string;
    localGovernment?: string;
    locality?: string;
  } | null>(null);
  const {
    isDeliverable,
    error: verificationError,
    isVerifying,
    verifyAddress,
    reset,
  } = useAddressVerification();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMinEndDate = () => {
    if (!startDate) return new Date();
    const minEnd = new Date(startDate);
    minEnd.setDate(startDate.getDate() + 2);
    return minEnd;
  };

  const handleSelectAddress = (suggestion: {
    description: string;
    details: {
      formattedAddress: string;
      state?: string;
      localGovernment?: string;
      locality?: string;
    } | null;
  }) => {
    const address =
      suggestion.details?.formattedAddress || suggestion.description;
    setDeliveryAddress(address); // Set address immediately
    setSelectedAddressDetails(
      suggestion.details || { formattedAddress: address }
    ); // Store details
    setInput(address);
    setIsAddressFormOpen(false);
  };

  const handleNextClick = async () => {
    if (!startDate || !endDate || !deliveryAddress || loading) return;

    // Verify address with stored details
    await verifyAddress(deliveryAddress, selectedAddressDetails || undefined);
    // If deliverable, handleGenerateMealPlan will be called automatically via useEffect
  };

  const handleJoinWaitlistClick = () => {
    setIsWaitlistModalOpen(true);
  };

  const handleCloseWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
  };

  const handleOpenAddressForm = () => {
    reset(); // Clear verification error when opening the form
    setIsAddressFormOpen(true);
  };

  // Automatically generate meal plan and move to next stage if verification succeeds
  useEffect(() => {
    const proceedToMealPlan = async () => {
      if (
        isDeliverable &&
        !isVerifying &&
        !loading &&
        startDate &&
        endDate &&
        deliveryAddress
      ) {
        await handleGenerateMealPlan();
      }
    };
    proceedToMealPlan();
  }, [
    isDeliverable,
    isVerifying,
    loading,
    startDate,
    endDate,
    deliveryAddress,
    handleGenerateMealPlan,
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#292d32] mb-4">
        Set Up Your Meal Plan
      </h2>

      {/* Start Date */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#292d32]">
            Start Date
          </span>
          <button
            className="flex items-center gap-2 text-[#FF6600]"
            onClick={() => setIsStartDatePickerOpen(true)}
          >
            <Calendar size={20} />
            <span>Select Date</span>
          </button>
        </div>
        {startDate && (
          <p className="mt-2 text-sm text-[#292d32]">{formatDate(startDate)}</p>
        )}
        {isStartDatePickerOpen && (
          <div className="mt-2">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setStartDate(date);
                  if (endDate && date) {
                    const minEnd = new Date(date);
                    minEnd.setDate(date.getDate() + 2);
                    if (endDate < minEnd) setEndDate(null);
                  }
                }
                setIsStartDatePickerOpen(false);
              }}
              minDate={new Date()}
              inline
              onClickOutside={() => setIsStartDatePickerOpen(false)}
            />
          </div>
        )}
      </div>

      {/* End Date */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#292d32]">End Date</span>
          <button
            className="flex items-center gap-2 text-[#FF6600]"
            onClick={() => setIsEndDatePickerOpen(true)}
          >
            <Calendar size={20} />
            <span>{endDate ? "Change Date" : "Select Date"}</span>
          </button>
        </div>
        {endDate && (
          <p className="mt-2 text-sm text-[#292d32]">{formatDate(endDate)}</p>
        )}
        {isEndDatePickerOpen && (
          <div className="mt-2">
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => {
                if (date) setEndDate(date);
                setIsEndDatePickerOpen(false);
              }}
              minDate={getMinEndDate()}
              inline
              onClickOutside={() => setIsEndDatePickerOpen(false)}
            />
          </div>
        )}
        {startDate && !endDate && (
          <p className="mt-2 text-sm text-gray-500">
            Please select an end date (minimum 3 days from start date).
          </p>
        )}
      </div>

      {/* Delivery Address */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#292d32]">
            Delivery Address
          </span>
          <button
            className="flex items-center gap-2 text-[#FF6600]"
            onClick={handleOpenAddressForm} // Updated to reset error
          >
            <MapPin size={20} />
            <span>{deliveryAddress ? "Change Address" : "Add Address"}</span>
          </button>
        </div>
        {deliveryAddress && (
          <p className="mt-2 text-sm text-[#292d32]">{deliveryAddress}</p>
        )}
        {isAddressFormOpen && (
          <div className="mt-4 space-y-2 relative">
            <input
              type="text"
              placeholder="Enter delivery address"
              className="w-full p-2 border border-gray-200 rounded-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectAddress(suggestion)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
            {addressLoading && (
              <p className="text-sm text-gray-500 mt-2">
                Loading suggestions...
              </p>
            )}
            {addressError && (
              <p className="text-sm text-red-500 mt-2">{addressError}</p>
            )}
            <button
              className="w-full py-2 bg-[#FF6600] text-white rounded-lg"
              onClick={() => {
                if (!deliveryAddress && input) {
                  setDeliveryAddress(input); // Set address immediately
                  setSelectedAddressDetails({ formattedAddress: input }); // Store minimal details
                }
                setIsAddressFormOpen(false);
              }}
              disabled={!input}
            >
              Save Address
            </button>
          </div>
        )}
        {isVerifying && (
          <p className="text-sm text-gray-500 mt-2">Verifying address...</p>
        )}
        {verificationError && !isVerifying && (
          <div className="flex flex-col items-center justify-center text-center my-4">
            <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
              <Image
                src="/icons/empty_box.png"
                alt="Delivery unavailable"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">
              We don't deliver to that location yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You can get notified when we are live in your city by joining our
              waitlist
            </p>
            <button
              type="button"
              onClick={handleJoinWaitlistClick}
              className="bg-[#f15736] text-white px-6 py-2 rounded-full hover:bg-[#d8432c] transition-colors"
            >
              Join the waitlist
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          className="flex-1 py-3 bg-gray-500 text-white rounded-lg"
          onClick={() => router.push("/store")}
        >
          Cancel
        </button>
        <button
          className={`flex-1 py-3 rounded-lg text-white ${
            startDate && endDate && deliveryAddress
              ? "bg-[#FF6600]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleNextClick}
          disabled={
            !startDate || !endDate || !deliveryAddress || loading || isVerifying
          }
        >
          {loading || isVerifying ? "Processing..." : "Next"}
        </button>
      </div>

      {/* Waitlist Modal */}
      <JoinWaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={handleCloseWaitlistModal}
        address={deliveryAddress}
      />
    </div>
  );
};

export default PlanSetup;
