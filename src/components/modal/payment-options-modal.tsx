"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { getSessionToken } from "@/utils/session"; // Updated import

interface PaymentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: string) => void;
  selectedMethod: string | null;
  onChooseMethod: () => void;
}

const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({
  isOpen,
  onClose,
  onSelectMethod,
  selectedMethod,
  onChooseMethod,
}) => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!isOpen) return;

      const token = getSessionToken();
      if (!token) return;

      setIsLoadingBalance(true);
      setBalanceError(null);

      try {
        const response = await fetch(`${baseUrl}/api/wallet/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wallet balance");
        }

        const data = await response.json();
        console.log("Wallet balance response:", data.data.balance);

        if (data.data && typeof data.data.balance === "number") {
          setWalletBalance(data.data.balance);
        } else {
          console.warn("Unexpected wallet balance format:", data);
          setBalanceError("Could not retrieve balance");
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setBalanceError("Failed to load balance");
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchWalletBalance();
  }, [isOpen, baseUrl]);

  if (!isOpen) return null;

  const formatBalance = (balance: number) => {
    return `₦${balance.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 bg-brand-opacity flex items-center justify-center">
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
          Payment Options
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
              <div>
                <span>Wallet </span>
                {isLoadingBalance ? (
                  <span className="text-sm text-gray-500">(Loading...)</span>
                ) : balanceError ? (
                  <span className="text-sm text-red-500">({balanceError})</span>
                ) : (
                  <span className="text-sm font-medium">
                    ({formatBalance(walletBalance)})
                  </span>
                )}
              </div>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              value="Wallet"
              checked={selectedMethod === "Wallet"}
              onChange={() => onSelectMethod("Wallet")}
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
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              <span>Pay Online</span>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              value="Pay Online"
              checked={selectedMethod === "Pay Online"}
              onChange={() => onSelectMethod("Pay Online")}
              className="h-5 w-5 text-teal-500"
            />
          </label>
          {/* <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer">
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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Cash on Delivery</span>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={selectedMethod === "Cash on Delivery"}
              onChange={() => onSelectMethod("Cash on Delivery")}
              className="h-5 w-5 text-teal-500"
            />
          </label> */}
        </div>
        <button
          onClick={onChooseMethod}
          disabled={!selectedMethod}
          className="w-full mt-6 bg-[#FF6600] cursor-pointer text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-[#1A2E20] disabled:opacity-50"
        >
          Choose method
        </button>
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
