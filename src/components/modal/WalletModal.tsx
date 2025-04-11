/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user"; // Adjust the path as needed

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const { user } = useAuth();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
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

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.wallet_no || "9833973825").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
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
            <div
              className="h-full overflow-y-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* Header with Back Button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-lg font-semibold text-[#292d32]">
                    Wallet
                  </h2>
                </div>
                <button
                  className="text-[#00A343] text-sm font-medium"
                  onClick={() => alert("Add Money functionality coming soon!")} // Placeholder for Add Money functionality
                >
                  Add Money
                </button>
              </div>

              {/* Available Balance Section */}
              <div className="p-4">
                <div className="bg-black text-white rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm">Available Balance</p>
                    <p className="text-2xl font-semibold">₦{user?.wallet_balance || 0}</p>
                  </div>
                  <ChevronRight size={24} className="text-white" />
                </div>
              </div>

              {/* Virtual Account Section */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#00A343] rounded-full"></span>
                  <p className="text-sm text-gray-500">
                    Fund wallet with your virtual account number
                  </p>
                </div>
                <div className="flex justify-between items-center bg-[#E5E5FF] rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-500">Paystack-Titan</p>
                    <p className="text-lg font-semibold text-[#292d32]">
                      {user?.wallet_no || "9833973825"}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 bg-[#6666FF] text-white rounded-lg px-3 py-1 text-sm"
                  >
                    <Copy size={16} />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Manage Cards Section */}
              <div className="p-4 border-t border-gray-200">
                <h4 className="text-md font-semibold text-[#292d32] mb-2">
                  Manage Cards
                </h4>
                <button
                  onClick={() => alert("Add new debit card functionality coming soon!")} // Placeholder for Add Card functionality
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg w-full text-left hover:bg-gray-100"
                >
                  <span className="text-gray-500">➕</span>
                  <span>Add new debit card</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;