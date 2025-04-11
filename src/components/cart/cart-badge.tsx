"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/cart-context";

const CartBadge = () => {
  const { state } = useCart();

  const itemCount = state.packs.reduce((total, pack) => {
    return (
      total +
      pack.items.reduce((packTotal, item) => packTotal + item.quantity, 0)
    );
  }, 0);

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-2 -right-2 bg-[#ff6600] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {itemCount}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartBadge;
