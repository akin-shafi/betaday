/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toast } from "react-toastify";
import { getAuthToken } from "@/utils/auth";
import RestoreMismatchModal from "@/components/modal/RestoreMismatchModal";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

interface SavedCart {
  id: string;
  userId: string;
  vendorId: string;
  cart: {
    packs: {
      id: string;
      items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
        businessId?: string;
        businessName?: string;
      }[];
    }[];
    activePackId: string | null;
    brownBagQuantity: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SavedCartModalProps {
  onClose: () => void;
}

const SavedCartModal: React.FC<SavedCartModalProps> = ({ onClose }) => {
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);
  const [selectedSavedCart, setSelectedSavedCart] = useState<SavedCart | null>(
    null
  );
  const [clearAfterRestore, setClearAfterRestore] = useState(false);

  const token = getAuthToken();
  const { state, dispatch } = useCart();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchSavedCarts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/save-for-later`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch saved carts");
        }

        const data = await response.json();
        setSavedCarts(data.savedCarts || []);
      } catch (error: any) {
        console.error("Error fetching saved carts:", error);
        toast.error("Failed to load saved carts");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCarts();
  }, [token, baseUrl]);

  const checkVendorMismatch = (savedCart: SavedCart) => {
    if (state.packs.length === 0) return false;
    const currentBusinessId = state.packs[0].items[0]?.businessId;
    return currentBusinessId && currentBusinessId !== savedCart.vendorId;
  };

  const handleRestoreCart = (
    savedCart: SavedCart,
    clearAfterRestore: boolean = false
  ) => {
    if (state.packs.length > 0 && checkVendorMismatch(savedCart)) {
      setSelectedSavedCart(savedCart);
      setClearAfterRestore(clearAfterRestore);
      setIsMismatchModalOpen(true);
      return;
    }
    performRestore(savedCart, clearAfterRestore);
  };

  const performRestore = (savedCart: SavedCart, clearAfterRestore: boolean) => {
    try {
      dispatch({ type: "RESTORE_CART", payload: savedCart.cart });
      toast.success("Cart restored successfully!");
      if (clearAfterRestore) {
        handleDeleteSavedCart(savedCart.id);
      }
      onClose();
    } catch (error: any) {
      console.error("Error restoring cart:", error);
      toast.error("Failed to restore cart");
    }
  };

  const handleClearAndRestore = () => {
    if (selectedSavedCart) {
      dispatch({ type: "CLEAR_CART" });
      performRestore(selectedSavedCart, clearAfterRestore);
    }
    setIsMismatchModalOpen(false);
    setSelectedSavedCart(null);
  };

  const handleCloseMismatchModal = () => {
    setIsMismatchModalOpen(false);
    setSelectedSavedCart(null);
  };

  const handleDeleteSavedCart = async (cartId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/save-for-later/${cartId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete saved cart");
      }

      const updatedCarts = savedCarts.filter((cart) => cart.id !== cartId);
      setSavedCarts(updatedCarts);
      toast.success("Saved cart deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting saved cart:", error);
      toast.error("Failed to delete saved cart");
    }
  };

  const calculatePackTotal = (pack: SavedCart["cart"]["packs"][0]) => {
    return pack.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString("en-NG")}`;
  };

  const getCurrentVendorName = () => {
    return state.packs.length > 0 && state.packs[0].items[0]?.businessName
      ? state.packs[0].items[0].businessName
      : "the current vendor";
  };

  const getSavedVendorName = (savedCart: SavedCart) => {
    return savedCart.cart.packs.length > 0 &&
      savedCart.cart.packs[0].items[0]?.businessName
      ? savedCart.cart.packs[0].items[0].businessName
      : "another vendor";
  };

  // Animation variants for slide-in from the right
  const modalVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "tween", duration: 0.3 } },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { type: "tween", duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full md:w-[480px] bg-white h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#292d32]">
              Saved Carts
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading...</p>
            ) : savedCarts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No saved carts found
              </p>
            ) : (
              <div className="space-y-4">
                {savedCarts.map((savedCart) => (
                  <div
                    key={savedCart.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-[#292d32]">
                          Saved Cart #{savedCart.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(savedCart.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSavedCart(savedCart.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {savedCart.cart.packs.map((pack, index) => (
                        <div key={pack.id} className="border-b pb-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-[#292d32]">
                              Pack: {index + 1}{" "}
                              {formatPrice(calculatePackTotal(pack))}
                            </h4>
                          </div>
                          {pack.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center mt-2"
                            >
                              <div>
                                <p className="text-sm text-[#292d32]">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[#292d32]">
                                  {item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => handleRestoreCart(savedCart, false)}
                        className="text-[#ff6600] text-sm font-medium cursor-pointer"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleRestoreCart(savedCart, true)}
                        className="text-[#ff6600] text-sm font-medium cursor-pointer"
                      >
                        Restore & Clear
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {selectedSavedCart && (
          <RestoreMismatchModal
            isOpen={isMismatchModalOpen}
            currentVendorName={getCurrentVendorName()}
            savedVendorName={getSavedVendorName(selectedSavedCart)}
            onClearAndRestore={handleClearAndRestore}
            onClose={handleCloseMismatchModal}
            onParentClose={onClose}
          />
        )}
      </div>
    </AnimatePresence>
  );
};

export default SavedCartModal;
