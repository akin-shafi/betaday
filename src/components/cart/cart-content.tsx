/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useRef } from "react";
import Image from "next/image";
import Pack from "./Pack";
import { formatPrice } from "@/lib/utils";
import { useAddress } from "@/contexts/address-context";
import { useAuth } from "@/contexts/auth-context";
import { useBusinessStore } from "@/stores/business-store";
import { useCartFees } from "@/hooks/useCartFees";
import {
  BROWN_BAG_PRICE,
  calculateSubtotal,
  calculateTotal,
} from "@/utils/cart-utils";
import { ShoppingBag } from "lucide-react";

interface CartContentProps {
  state: any;
  dispatch: any;
  onProceedToPayment: () => void;
  onSaveForLater: () => void;
  isSubmitting: boolean;
  isSavingForLater: boolean;
  cartError: string | null;
  addressError: string | null;
  deliveryInstructions: string[];
  setDeliveryInstructions: (instructions: string[]) => void;
  vendorInstructions: string;
  setVendorInstructions: (instructions: string) => void;
  promoCodes: string[];
  discount: number;
  onPromoChoose: () => void;
  onRemovePromo: () => void;
  showDeliveryTextarea: boolean[];
  setShowDeliveryTextarea: (show: boolean[]) => void;
  showVendorTextarea: boolean;
  setShowVendorTextarea: (show: boolean) => void;
  onAddDeliveryInstruction: () => void;
  onRemoveDeliveryInstruction: (index: number) => void;
  onDeliveryInstructionChange: (index: number, value: string) => void;
  onAddVendorInstruction: () => void;
  onRemoveVendorInstruction: () => void;
  onVendorInstructionChange: (value: string) => void;
  onBrownBagChange: (checked: boolean) => void;
  onBrownBagQuantityChange: (delta: number) => void;
  onAddressModalOpen: () => void;
  onClose?: () => void;
}

const CartContent: React.FC<CartContentProps> = ({
  state,
  dispatch,
  onProceedToPayment,
  onSaveForLater,
  isSubmitting,
  isSavingForLater,
  cartError,
  addressError,
  deliveryInstructions,
  setDeliveryInstructions,
  vendorInstructions,
  setVendorInstructions,
  promoCodes,
  discount,
  onPromoChoose,
  onRemovePromo,
  showDeliveryTextarea,
  setShowDeliveryTextarea,
  showVendorTextarea,
  setShowVendorTextarea,
  onAddDeliveryInstruction,
  onRemoveDeliveryInstruction,
  onDeliveryInstructionChange,
  onAddVendorInstruction,
  onRemoveVendorInstruction,
  onVendorInstructionChange,
  onBrownBagChange,
  onBrownBagQuantityChange,
  onAddressModalOpen,
  onClose,
}) => {
  const { businessInfo } = useBusinessStore();
  const {
    address: contextAddress,
    isAddressValid,
    isLoading,
    error,
    locationDetails,
    coordinates,
  } = useAddress();
  const { isAuthenticated } = useAuth();

  // Refs for scrolling
  const cartRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);

  // Calculate subtotal and total
  const getSubtotal = () => {
    return calculateSubtotal(state.packs, state.brownBagQuantity);
  };

  // Use the custom hook for fee calculation with proper coordinates and locationDetails
  const { deliveryFee, serviceFee, isCalculatingFees, feeError } = useCartFees(
    state,
    contextAddress,
    locationDetails, // Pass the actual locationDetails
    coordinates, // Pass the actual coordinates
    businessInfo?.id || "unknown",
    getSubtotal
  );

  // Calculate total with fees
  const getTotal = () => {
    return calculateTotal(getSubtotal(), discount, deliveryFee, serviceFee);
  };

  const renderAddressText = () => {
    if (isLoading) return "Getting your location...";
    if (error) return "Set your location";
    if (isAddressValid && contextAddress) return <>{contextAddress}</>;
    return "Set your location";
  };

  const isEmpty = state.packs.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
        <ShoppingBag className="h-16 w-16 mb-4 text-gray-300" />
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="text-sm">Add some delicious items to get started!</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className=" bg-white z-10">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#292d32]">
              {businessInfo?.name || "Your Cart"}
            </h3>
            <button
              onClick={() => dispatch({ type: "ADD_PACK" })}
              className="text-[#ff6600] cursor-pointer border border-gray-200 text-xs py-1 px-2 rounded-full flex items-center transition duration-300 hover:border-[#ff6600] hover:text-[#ff6600]"
            >
              + Add another pack
            </button>
          </div>
        </div>
        <div ref={addressRef} className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#292d32] truncate-text max-w-[70%]">
              {renderAddressText()}
            </span>
            <button
              onClick={onAddressModalOpen}
              className="text-[#ff6600] text-sm cursor-pointer hover:underline"
            >
              {contextAddress && isAddressValid ? "Change" : "Set"}
            </button>
          </div>
          {addressError && (
            <p className="text-red-500 text-xs mt-1 animate-flash">
              {addressError}
            </p>
          )}
        </div>
      </div>

      {/* Content - No internal scrolling */}
      <div className="flex-1">
        <div className="p-4 space-y-4">
          {state.packs.map((pack: any) => (
            <Pack
              key={pack.id}
              packId={pack.id}
              items={pack.items}
              isActive={pack.id === state.activePackId}
              onAddToThisPack={() =>
                dispatch({ type: "SET_ACTIVE_PACK", payload: pack.id })
              }
              onDuplicate={() =>
                dispatch({ type: "DUPLICATE_PACK", payload: pack.id })
              }
              onRemove={() =>
                dispatch({ type: "REMOVE_PACK", payload: pack.id })
              }
              onUpdateQuantity={(itemId: string, quantity: number) =>
                dispatch({
                  type: "UPDATE_ITEM_QUANTITY",
                  payload: { packId: pack.id, itemId, quantity },
                })
              }
            />
          ))}

          <div className="py-3 border-t border-b border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <Image
                src="/icons/bottle.png"
                alt="Water bottle"
                width={24}
                height={24}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#292d32]">
                      Need water?
                    </p>
                    <p className="text-xs text-gray-500">
                      Add a bottle of water to your order for just ₦200.00
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={state.brownBagQuantity > 0}
                    onChange={(e) => onBrownBagChange(e.target.checked)}
                    className="rounded-full accent-[#ff6600]"
                  />
                </div>
                {state.brownBagQuantity > 0 && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#292d32]">
                        How many bottles?
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onBrownBagQuantityChange(-1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-[#292d32] hover:bg-gray-300"
                        >
                          −
                        </button>
                        <span className="text-sm text-[#292d32]">
                          {state.brownBagQuantity}
                        </span>
                        <button
                          onClick={() => onBrownBagQuantityChange(1)}
                          className="w-8 h-8 flex items-center justify-center bg-[#ff6600] rounded-full text-white hover:bg-[#e65c00]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[#292d32]">
                      {formatPrice(state.brownBagQuantity * BROWN_BAG_PRICE)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Show fee error only if it's not about missing data when we have an empty cart */}
          {feeError && state.packs.length > 0 && (
            <p className="text-red-500 text-sm text-center mt-2 animate-flash">
              {feeError}
            </p>
          )}

          <div className="space-y-4 py-4 font-medium text-xs">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#292d32] truncate-text max-w-[70%]">
                  Promo Code: {promoCodes.length > 0 ? promoCodes[0] : "None"}
                  {discount > 0 && ` (${discount}% off)`}
                </span>
                <div className="flex items-center gap-2">
                  {promoCodes.length > 0 && (
                    <button
                      onClick={onRemovePromo}
                      className="text-red-500 text-sm cursor-pointer hover:underline flex items-center gap-1"
                    >
                      <svg
                        className="h-4 w-4"
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
                      Remove
                    </button>
                  )}
                  <button
                    onClick={onPromoChoose}
                    className="text-[#ff6600] text-sm cursor-pointer hover:underline"
                  >
                    {promoCodes.length > 0 ? "Change" : "Choose"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#292d32]">
                  Delivery Instructions
                </span>
                <button
                  onClick={onAddDeliveryInstruction}
                  className="text-[#ff6600] text-sm cursor-pointer hover:underline flex items-center gap-1"
                >
                  <svg
                    className="h-4 w-4"
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
                  Add
                </button>
              </div>
              {showDeliveryTextarea.map((show, index) => (
                <div key={index} className="mt-2">
                  <textarea
                    value={deliveryInstructions[index] || ""}
                    onChange={(e) =>
                      onDeliveryInstructionChange(index, e.target.value)
                    }
                    placeholder="e.g., Leave at front door"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <button
                    onClick={() => onRemoveDeliveryInstruction(index)}
                    className="text-red-500 text-xs mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#292d32]">
                  Vendor Instructions
                </span>
                {!showVendorTextarea && (
                  <button
                    onClick={onAddVendorInstruction}
                    className="text-[#ff6600] text-sm cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <svg
                      className="h-4 w-4"
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
                    Add
                  </button>
                )}
              </div>
              {showVendorTextarea && (
                <div className="mt-2">
                  <textarea
                    value={vendorInstructions}
                    onChange={(e) => onVendorInstructionChange(e.target.value)}
                    placeholder="e.g., No onions, please"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <button
                    onClick={onRemoveVendorInstruction}
                    className="text-red-500 text-xs mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between text-sm font-medium text-[#292d32] mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>Discount ({discount}%)</span>
                <span>-{formatPrice((getSubtotal() * discount) / 100)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-medium text-[#292d32] mb-2">
              <span>Delivery Fee</span>
              <span>
                {isCalculatingFees
                  ? "Calculating..."
                  : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium text-[#292d32] mb-2">
              <span>Service Fee</span>
              <span>
                {isCalculatingFees ? "Calculating..." : formatPrice(serviceFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#292d32]">
              <span>Total</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <button
          onClick={onSaveForLater}
          disabled={isSavingForLater}
          className="w-full mb-2 bg-gray-100 text-[#292d32] py-3 rounded-md font-medium transition-colors duration-200 hover:bg-gray-200 disabled:opacity-50"
        >
          {isSavingForLater ? "Saving..." : "Save for Later"}
        </button>
        {addressError ? (
          <button
            onClick={onAddressModalOpen}
            className="w-full bg-red-500 text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-red-600"
          >
            Fix Address
          </button>
        ) : isCalculatingFees ? (
          <div className="w-full text-center text-sm text-gray-500 py-3">
            Calculating fees, please wait...
          </div>
        ) : feeError ? (
          <div className="w-full text-center text-sm text-red-500 py-3">
            {feeError}
          </div>
        ) : (
          <button
            onClick={onProceedToPayment}
            disabled={isSubmitting}
            className="w-full bg-[#ff6600] text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-[#e65c00] disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CartContent;
