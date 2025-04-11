// src/components/modal/online-payment-options-modal.tsx
import React, { useState } from "react";

interface OnlinePaymentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoBack: () => void;
  onChooseMethod: (method: string) => void;
}

const OnlinePaymentOptionsModal: React.FC<OnlinePaymentOptionsModalProps> = ({
  isOpen,
  onClose,
  onGoBack,
  onChooseMethod,
}) => {
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState<
    string | null
  >(null);

  if (!isOpen) return null;

  const handleSelect = (method: string) => {
    setSelectedOnlineMethod(method);
  };

  const handleChoose = () => {
    if (selectedOnlineMethod) {
      onChooseMethod(selectedOnlineMethod); // Pass the selected online method (e.g., "Pay with Card")
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative mobile-modal">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
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
        <h2 className="text-xl font-semibold mb-4 text-center">
          How would you like to pay?
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer">
            <div className="flex items-center gap-2">
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
                  d="M3 10h18M3 6h18M3 14h18M3 18h18"
                />
              </svg>
              <span>Pay with Card</span>
            </div>
            <input
              type="radio"
              name="onlinePaymentMethod"
              value="Pay with Card"
              checked={selectedOnlineMethod === "Pay with Card"}
              onChange={() => handleSelect("Pay with Card")}
              className="h-5 w-5 text-teal-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer">
            <div className="flex items-center gap-2">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>Pay with Bank Transfer</span>
            </div>
            <input
              type="radio"
              name="onlinePaymentMethod"
              value="Pay with Bank Transfer"
              checked={selectedOnlineMethod === "Pay with Bank Transfer"}
              onChange={() => handleSelect("Pay with Bank Transfer")}
              className="h-5 w-5 text-teal-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer">
            <div className="flex items-center gap-2">
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
                  d="M12 11c0-1.1.9-2 2-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span>Pay with USSD</span>
            </div>
            <input
              type="radio"
              name="onlinePaymentMethod"
              value="Pay with USSD"
              checked={selectedOnlineMethod === "Pay with USSD"}
              onChange={() => handleSelect("Pay with USSD")}
              className="h-5 w-5 text-teal-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer">
            <div className="flex items-center gap-2">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Pay with QR Code</span>
            </div>
            <input
              type="radio"
              name="onlinePaymentMethod"
              value="Pay with QR Code"
              checked={selectedOnlineMethod === "Pay with QR Code"}
              onChange={() => handleSelect("Pay with QR Code")}
              className="h-5 w-5 text-teal-500"
            />
          </label>
        </div>
        <button
          onClick={handleChoose}
          disabled={!selectedOnlineMethod}
          className="w-full mt-6 bg-[#FF6600]  cursor-pointer text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-[#1A2E20] disabled:opacity-50"
        >
          Choose method
        </button>
        <button
          onClick={onGoBack}
          className="w-full mt-2 text-[#FF6600] cursor-pointer text-center"
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default OnlinePaymentOptionsModal;
