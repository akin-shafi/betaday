/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { toast } from "react-toastify";

interface RateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}

const RateOrderModal: React.FC<RateOrderModalProps> = ({
  isOpen,
  onClose,
  orderId,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/order-rating/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          orderId,
          rating,
          feedback: feedback.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit rating.");
      }

      toast.success("Thank you for your feedback!");
      onClose();
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error(error.message || "Failed to submit rating.");
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
            Rate Your Ordering Experience
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
            How would you rate your ordering experience?
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

        <div className="mb-4">
          <p className="text-sm text-[#292d32] mb-2">
            Any feedback? (Optional)
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-2 text-sm text-gray-700 bg-[#f8f9fa] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6600] resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleSubmitRating}
          disabled={isSubmitting}
          className="w-full py-3 bg-[#ff6600] text-white rounded-md font-medium hover:bg-[#e65c00] disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

export default RateOrderModal;
