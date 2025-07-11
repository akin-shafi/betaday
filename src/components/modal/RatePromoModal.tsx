/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { message } from "antd";
import { getSessionToken } from "@/utils/session"; // Updated import

interface RatePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoCode: { id: number; code: string };
}

const RatePromoModal: React.FC<RatePromoModalProps> = ({
  isOpen,
  onClose,
  promoCode,
}) => {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = getSessionToken();

  const handleSubmitRating = async () => {
    if (rating < 1 || rating > 5) {
      message.error("Please select a rating between 1 and 5.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/promo/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          promoCodeId: promoCode.id,
          rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit rating.");
      }

      message.success("Thank you for your rating!");
      onClose();
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      message.error(error.message || "Failed to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#292d32]">
            Rate Promo Code: {promoCode.code}
          </h2>
          <button
            onClick={onClose}
            className="text-[#292d32] hover:text-[#ff6600] focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-[#292d32] mb-2">
            How would you rate this promo code?
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? "text-[#ff6600]" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmitRating}
          disabled={isSubmitting}
          className="w-full py-3 bg-[#ff6600] text-white rounded-md font-medium hover:bg-[#e65c00] disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
    </div>
  );
};

export default RatePromoModal;
