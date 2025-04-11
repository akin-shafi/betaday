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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 py-4 border-b last:border-b-0"
    >
      <Image
        src={image || "/food_placeholder.jpg"}
        alt={name}
        width={80}
        height={80}
        className="rounded-md object-cover"
      />

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
            <span className="font-bold">{price}</span>
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
