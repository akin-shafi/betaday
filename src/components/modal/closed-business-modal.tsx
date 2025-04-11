"use client";

import { X } from "lucide-react";

interface ClosedBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClosedBusinessModal({
  isOpen,
  onClose,
}: ClosedBusinessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md relative md:max-w-md mobile-modal">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4  cursor-pointer   text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full z-60"
        >
          <X size={20} />
        </button>

        <div className="p-6 mt-10">
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            Unable to Place Order
          </h2>
          <p className="text-gray-600 text-center mb-6">
            You cannot place an order from a closed business. Please try again
            when the business is open.
          </p>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#FF6600] text-white rounded hover:bg-[#e65c00] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
