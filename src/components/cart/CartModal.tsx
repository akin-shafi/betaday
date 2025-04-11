/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeaderStore } from "@/stores/header-store";
import Cart from "./cart";
import SavedCartModal from "./SavedCartModal";
import { useAuth } from "@/contexts/auth-context";
import LoginModal from "@/components/auth/login-modal";
import { getAuthToken } from "@/utils/auth";
import { useBusinessStore } from "@/stores/business-store"; // Import the store

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [savedCartsCount, setSavedCartsCount] = useState<number>(0);

  const { isCartOpen, isShoppingListOpen, setCartOpen, toggleShoppingList } =
    useHeaderStore();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const token = getAuthToken();

  useEffect(() => {
    const fetchSavedCartsCount = async () => {
      if (!isAuthenticated || !token) {
        setSavedCartsCount(0);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/save-for-later/count`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch saved carts count");
        }

        const data = await response.json();
        setSavedCartsCount(data.count || 0);
      } catch (error: any) {
        console.error("Error fetching saved carts count:", error);
        setSavedCartsCount(0);
      }
    };

    fetchSavedCartsCount();
  }, [isAuthenticated, token, baseUrl]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleToggleShoppingList = () => {
    if (isAuthenticated) {
      toggleShoppingList();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const modalVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-end"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-[480px] bg-white h-full fixed top-0 right-0 md:w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#292d32]">Checkout</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleShoppingList}
                  className="flex items-center cursor-pointer gap-1 text-[#ff6600]"
                >
                  Saved Items:{" "}
                  <span className="bg-[#ff6600] text-white rounded-full px-2 py-0.5 text-xs">
                    {savedCartsCount}
                  </span>
                </button>
                <button
                  className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={() => {
                    setCartOpen(false);
                    onClose();
                  }}
                  aria-label="Close modal"
                >
                  <X
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
              </div>
            </div>
            <Cart />

            {/* Shopping List Modal */}
            {isShoppingListOpen && isAuthenticated && (
              <SavedCartModal onClose={toggleShoppingList} />
            )}

            {/* Login Modal */}
            {isLoginModalOpen && (
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
