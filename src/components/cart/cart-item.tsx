"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/cart-context";

interface CartItemProps {
  id: string;
  packId: string;
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
}

// Helper function to format price consistently
const formatPrice = (price: string | number): string => {
  const numericPrice =
    typeof price === "string"
      ? Number.parseFloat(price.replace(/[₦,]/g, ""))
      : price;

  if (isNaN(numericPrice)) return "₦0";
  return `₦${numericPrice.toLocaleString("en-NG")}`;
};

// Helper function to generate initials for placeholder
const generateInitials = (name: string): string => {
  if (!name) return "??";

  const words = name.split(/[\s&+\-/,]+/).filter((word) => word.length > 0);

  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();

  const initials = words
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join("");
  return initials;
};

export default function CartItem({
  id,
  packId,
  name,
  description,
  price,
  image,
  quantity,
}: CartItemProps) {
  const { dispatch } = useCart();

  const initials = generateInitials(name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 py-4 border-b last:border-b-0"
    >
      {/* Image or Placeholder */}
      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        {image && image !== "/food_placeholder.jpg" ? (
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg drop-shadow-sm">
              {initials}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                dispatch({
                  type: "UPDATE_ITEM_QUANTITY",
                  payload: { packId, itemId: id, quantity: quantity - 1 },
                })
              }
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() =>
                dispatch({
                  type: "UPDATE_ITEM_QUANTITY",
                  payload: { packId, itemId: id, quantity: quantity + 1 },
                })
              }
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold">{formatPrice(price)}</span>
            <button
              onClick={() => dispatch({ type: "REMOVE_PACK", payload: packId })}
              className="p-1 text-red-500 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
