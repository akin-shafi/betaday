// components/modal/RestoreMismatchModal.tsx
"use client";
import React from "react";
// import { useRouter } from "next/navigation";

interface RestoreMismatchModalProps {
  isOpen: boolean;
  currentVendorName: string;
  savedVendorName: string;
  onClearAndRestore: () => void;
  onClose: () => void;
  onParentClose: () => void;
}

const RestoreMismatchModal: React.FC<RestoreMismatchModalProps> = ({
  isOpen,
  currentVendorName,
  savedVendorName,
  onClearAndRestore,
  onClose,
  onParentClose,
}) => {
  //   const router = useRouter();

  if (!isOpen) return null;

  const handleGoToCheckout = () => {
    onClose(); // Close the mismatch modal
    onParentClose(); // Close the SavedCartModal
    // router.push("/checkout"); // Navigate to checkout
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-[#292d32] mb-4">
          Vendor Mismatch
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Your current cart contains items from {currentVendorName}. Restoring
          items from {savedVendorName} will clear your current cart.
          Alternatively, complete your checkout with {currentVendorName} first.
          What would you like to do?
        </p>
        <div className="flex justify-between gap-4">
          <button
            onClick={handleGoToCheckout}
            className="bg-gray-500 py-2 px-4 rounded-lg hover:bg-gray-700 text-white cursor-pointer"
          >
            Go to Checkout
          </button>
          <button
            onClick={onClearAndRestore}
            className="bg-[#ff6600] text-white py-2 px-4 rounded-lg hover:bg-[#e65c00] cursor-pointer"
          >
            Clear and Restore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreMismatchModal;
