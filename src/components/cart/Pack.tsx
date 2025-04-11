"use client";
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

interface PackItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface PackProps {
  packId: string;
  items: PackItem[];
  isActive: boolean;
  onAddToThisPack: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const Pack: React.FC<PackProps> = ({
  packId,
  items,
  isActive,
  onAddToThisPack,
  onDuplicate,
  onRemove,
  onUpdateQuantity,
}) => {
  const handleQuantityChange = (
    itemId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      // This will trigger item removal in the reducer
      onUpdateQuantity(itemId, 0);
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const packTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`border rounded-lg p-4 mb-4  ${
        isActive
          ? "border-[#ff6600] border-dashed"
          : "border-gray-200 border-dashed"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#292d32]  font-medium">
          {" "}
          {packId}
          <span className="">:{formatPrice(packTotal)}</span>
        </h3>
        <button
          onClick={onRemove}
          className="text-[#ff6600] hover:text-[#292d32] cursor-pointer transition-colors duration-300"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {items.map((item) => (
        <div key={item.id} className="mb-4">
          <AnimatePresence>
            <div className="flex justify-between items-center">
              <div className="flex-1 text-xs text-gray-700 mr-3">
                <p className="block leading-tight first-letter:capitalize">
                  {item.name}
                </p>
                <p className="block text-xxs text-gray-400">
                  {formatPrice(item.price)}
                </p>
              </div>
              {/* flex items-center bg-gray-100 rounded-full overflow-hidden h-[25px] */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-full  text-xxs font-medium px-1">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity, -1)
                  }
                  className="p-2"
                >
                  <Minus size={10} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity, 1)
                  }
                  className="p-2"
                >
                  <Plus size={10} />
                </button>
              </div>
            </div>
          </AnimatePresence>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <button
          onClick={onAddToThisPack}
          className="text-[#292d32] cursor-pointer border border-gray-200 text-xxs py-1 px-2 rounded-full flex items-center transition duration-300 hover:border-[#ff6600] hover:text-[#ff6600]"
        >
          + Add to this pack
        </button>
        <button
          onClick={onDuplicate}
          className="text-[#292d32] cursor-pointer border border-gray-200 text-xxs py-1 px-2 rounded-md flex items-center transition duration-300 hover:border-[#ff6600] hover:text-[#ff6600]"
        >
          Duplicate pack
        </button>
      </div>
    </div>
  );
};

export default Pack;
