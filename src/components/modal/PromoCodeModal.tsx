/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAuthToken } from "@/utils/auth";

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPromo: (promoCode: string, discount: number) => void;
}

interface PromoCode {
  id: number;
  code: string;
  discount: number;
  usageCount: number;
}

const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
  isOpen,
  onClose,
  onApplyPromo,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
    null
  );
  const [availablePromoCodes, setAvailablePromoCodes] = useState<PromoCode[]>(
    []
  );
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const token = getAuthToken();

  useEffect(() => {
    if (isOpen) {
      const fetchPromoCodes = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${baseUrl}/api/promo/available`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch promo codes.");
          }

          const data = await response.json();
          setAvailablePromoCodes(data.promoCodes); // Updated to match backend response
        } catch (error: any) {
          console.error("Error fetching promo codes:", error);
          toast.error(error.message || "Failed to fetch promo codes.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPromoCodes();
    }
  }, [isOpen]);

  const handleRedeemPromoCode = async () => {
    if (!promoCodeInput.trim()) {
      toast.error("Please enter a promo code.");
      return;
    }

    setIsRedeeming(true);

    try {
      const response = await fetch(`${baseUrl}/api/promo/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ promoCode: promoCodeInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to redeem promo code.");
      }

      const data = await response.json();
      const redeemedPromoCode = data.promoCode; // Updated to match backend response

      setAvailablePromoCodes((prev) => {
        if (prev.some((promo) => promo.code === redeemedPromoCode.code)) {
          return prev;
        }
        return [...prev, redeemedPromoCode];
      });

      setSelectedPromoCode(redeemedPromoCode);
      setPromoCodeInput("");
      toast.success("Promo code redeemed successfully!");
    } catch (error: any) {
      console.error("Error redeeming promo code:", error);
      toast.error(error.message || "Failed to redeem promo code.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleApplyPromo = () => {
    if (!selectedPromoCode) {
      toast.error("Please select or redeem a promo code to apply.");
      return;
    }
    onApplyPromo(selectedPromoCode.code, selectedPromoCode.discount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mobile-modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#292d32]">Promo codes</h2>
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
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
            placeholder="Enter promo code here"
            className="flex-1 p-2 text-sm text-[#292d32] bg-[#f8f9fa] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
          />

          <button
            onClick={handleRedeemPromoCode}
            disabled={isRedeeming}
            className="px-4 py-2 bg-[#ff6600] text-white rounded-md font-medium hover:bg-[#e65c00] disabled:opacity-50"
          >
            {isRedeeming ? "Redeeming..." : "Redeem"}
          </button>
        </div>
        {/* Token: {token} */}
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading promo codes...</p>
        ) : availablePromoCodes.length === 0 ? (
          <p className="text-sm text-gray-500">No available promo codes.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {availablePromoCodes.map((promo) => (
              <div
                key={promo.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium text-[#292d32]">
                    {promo.discount}% off – {promo.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    ({promo.usageCount.toLocaleString()} uses)
                  </p>
                </div>
                <input
                  type="radio"
                  name="promoCode"
                  checked={selectedPromoCode?.id === promo.id}
                  onChange={() => setSelectedPromoCode(promo)}
                  className="accent-[#ff6600]"
                />
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleApplyPromo}
          className="w-full py-3 bg-[#ff6600] text-white rounded-md font-medium hover:bg-[#e65c00] transition-colors"
        >
          Apply promo
        </button>
      </div>
    </div>
  );
};

export default PromoCodeModal;
