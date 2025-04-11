// components/modal/BusinessMismatchModal.tsx
"use client";
import React from "react";
import Link from "next/link";

interface BusinessMismatchModalProps {
  isOpen: boolean;
  currentVendorName: string;
  currentVendorId: string; // Add currentVendorId
  newVendorName: string;
  onConfirm: () => void;
  onCancel: () => void; // Still needed to close modal after navigation
}

const BusinessMismatchModal: React.FC<BusinessMismatchModalProps> = ({
  isOpen,
  currentVendorName,
  currentVendorId,
  newVendorName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-[#292d32] mb-4">
          Different Vendor Detected
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Your cart currently contains items from another vendor{" "}
          <strong>{currentVendorName}</strong>. Adding items from{" "}
          <strong>{newVendorName}</strong> will move your current cart items to{" "}
          <strong>{`"Saved Items"`}</strong> and start a new cart.
          <br />
          <strong>Do you want to proceed?</strong>
        </p>
        <Link
          href={`/store/${currentVendorId}`}
          className="text-gray-500 hover:text-gray-700 underline block text-center mb-4"
        >
          Go back to {currentVendorName}
        </Link>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-dark py-2 px-4 rounded-lg hover:bg-[#e65c00] cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-[#ff6600] text-white py-2 px-4 rounded-lg hover:bg-[#e65c00] cursor-pointer"
          >
            Save and Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessMismatchModal;
