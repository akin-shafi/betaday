"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

interface ComboItem {
  productId: string;
  productName: string;
  price: string;
  quantity: number;
  required: boolean;
  selected?: boolean;
}

interface ItemModalProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string | null;
    popular?: boolean;
    businessId: string;
    businessName: string;
    isCombo?: boolean;
    items?: ComboItem[];
  };
  onClose: () => void;
  onAddToCart: (item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    businessId: string;
    businessName: string;
    selectedComboItems?: ComboItem[];
  }) => void;
  isLoading?: boolean;
}

// Helper function to format price with currency symbol
const formatPrice = (price: string | number): string => {
  const cleanPrice = typeof price === 'string' ? price.replace(/[₦$£€,]/g, "").trim() : price.toString();
  const numericPrice = Number.parseFloat(cleanPrice);
  if (isNaN(numericPrice)) return "₦0";
  return `₦${numericPrice.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

// Helper function to generate initials for placeholder
const generateInitials = (name: string): string => {
  const words = name
    .split(/[\s&+\-,/]+/)
    .filter((word) => word.length > 0)
    .map((word) => word.trim());
  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return words
    .slice(0, 3)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const ItemModal: React.FC<ItemModalProps> = ({
  item,
  onClose,
  onAddToCart,
  isLoading = false,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedComboItems, setSelectedComboItems] = useState<ComboItem[]>(
    item.isCombo && item.items
      ? item.items.map(item => ({ ...item, selected: true }))
      : []
  );
  const [totalBasePrice, setTotalBasePrice] = useState(
    item.isCombo ? 0 : Number.parseFloat(item.price)
  );

  // Recalculate total base price when combo items change
  useEffect(() => {
    if (item.isCombo && selectedComboItems.length > 0) {
      const comboPrice = selectedComboItems.reduce((sum, comboItem) => {
        if (!comboItem.selected) return sum;
        const itemPrice = Number.parseFloat(comboItem.price) * comboItem.quantity;
        return sum + (isNaN(itemPrice) ? 0 : itemPrice);
      }, 0);
      setTotalBasePrice(comboPrice);
    } else {
      setTotalBasePrice(Number.parseFloat(item.price));
    }
  }, [selectedComboItems, item.price, item.isCombo]);

  const handleToggleComboItem = (productId: string) => {
    setSelectedComboItems((prev) =>
      prev.map((comboItem) =>
        comboItem.productId === productId && !comboItem.required
          ? { ...comboItem, selected: !comboItem.selected }
          : comboItem
      )
    );
  };

  const handleComboItemQuantityChange = (productId: string, delta: number) => {
    setSelectedComboItems((prev) =>
      prev.map((comboItem) =>
        comboItem.productId === productId
          ? { ...comboItem, quantity: Math.max(1, comboItem.quantity + delta) }
          : comboItem
      )
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: item.id,
      name: item.name,
      price: totalBasePrice, // Pass base price without quantity multiplier
      quantity: quantity,
      image: item.image || "/images/food.png",
      businessId: item.businessId,
      businessName: item.businessName,
      selectedComboItems: item.isCombo
        ? selectedComboItems.filter((item) => item.selected)
        : undefined,
    });
    onClose();
  };

  const initials = generateInitials(item.name);
  const formattedTotalPrice = formatPrice(totalBasePrice * quantity);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto relative p-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full shadow-sm z-10"
          disabled={isLoading}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col">
          <div className="relative w-full h-48">
            {item.image ? (
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-lg flex items-center justify-center">
                <span className="text-white font-bold text-5xl drop-shadow-sm">
                  {initials}
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <>
                <div className="flex flex-col mb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#292d32]">
                      {item.name}
                    </h3>
                    <p className="text-lg font-semibold text-[#292d32]">
                      {formattedTotalPrice}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">By {item.businessName}</p>
                </div>
                <p className="text-gray-500 text-sm mb-4">{item.description}</p>

                {item.isCombo && selectedComboItems.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#292d32] mb-2">
                      Combo Items
                    </h4>
                    <div className="space-y-2">
                      {selectedComboItems.map((comboItem) => (
                        <div
                          key={comboItem.productId}
                          className="flex justify-between items-center text-sm text-gray-700 border-b pb-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#ff6600] text-xs font-semibold">
                              {comboItem.required ? "Required" : ""}
                            </span>
                            <span>{comboItem.productName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {!comboItem.required && (
                              <input
                                type="checkbox"
                                checked={comboItem.selected}
                                onChange={() => handleToggleComboItem(comboItem.productId)}
                                className="h-4 w-4 text-[#ff6600] focus:ring-[#ff6600] border-gray-300 rounded mr-2"
                              />
                            )}
                            {!comboItem.required && (
                              <>
                                <button
                                  onClick={() => handleComboItemQuantityChange(comboItem.productId, -1)}
                                  className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                                  disabled={!comboItem.selected}
                                >
                                  <Minus className="h-4 w-4 text-gray-700" />
                                </button>
                                <span className="text-sm">{comboItem.quantity}</span>
                                <button
                                  onClick={() => handleComboItemQuantityChange(comboItem.productId, 1)}
                                  className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                                  disabled={!comboItem.selected}
                                >
                                  <Plus className="h-4 w-4 text-gray-700" />
                                </button>
                              </>
                            )}
                            {comboItem.required && (
                              <span className="text-sm">{comboItem.quantity}</span>
                            )}
                            <span>{formatPrice(Number.parseFloat(comboItem.price) * comboItem.quantity)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                      disabled={isLoading}
                    >
                      <Minus className="h-4 w-4 text-gray-700" />
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="bg-black cursor-pointer text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Add to Order"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;