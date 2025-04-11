/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { X } from "lucide-react";
import SlidingModalWrapper from "../SlidingModalWrapper";
import { useAuth } from "@/contexts/auth-context";

interface ReferralHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralHistoryModal({
  isOpen,
  onClose,
}: ReferralHistoryModalProps) {
  const { user } = useAuth();

  // Placeholder data for referral history (replace with actual data from your backend)
  const totalCashEarned = user?.referralEarnings?.cash || 0;
  const totalBetascoreEarned = user?.referralEarnings?.betascore || 0;

  return (
    <SlidingModalWrapper isOpen={isOpen} onClose={onClose}>
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full z-60"
      >
        <X size={20} />
      </button>

      {/* Modal Content */}
      <div className="text-center p-6 mt-10">
        <h2 className="text-2xl font-bold text-[#1A2E20] mb-4">
          Referral History
        </h2>

        {/* Total Cash Earned */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 uppercase">
            Total Cash Earned
          </p>
          <p className="text-3xl font-bold text-[#FF6600]">
            ₦{totalCashEarned}
          </p>
        </div>

        {/* Total Betascore Earned */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 uppercase">
            Total Betascore Earned
          </p>
          <p className="text-3xl font-bold text-[#FF6600]">
            {totalBetascoreEarned}
          </p>
        </div>

        {/* Info Text */}
        <p className="text-sm text-gray-600">
          Earn 3 points when a friend signs up with your referral code & 1 point
          every time they place an order!
        </p>
      </div>
    </SlidingModalWrapper>
  );
}
