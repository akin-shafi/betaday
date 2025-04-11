/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Copy, Share2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user"; // Adjust the path as needed
import ReferralHistoryModal from "@/components/modal/ReferralHistoryModal"; // Adjust the path as needed

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isReferralHistoryOpen, setIsReferralHistoryOpen] = useState(false); // State for ReferralHistoryModal

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
    navigator.clipboard
      .writeText(user?.referralCode || "CD-SHAFT2SL")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
  };

  const handleShare = async () => {
    const shareData = {
      title: "Join me on this app!",
      text: `Use my referral code ${
        user?.referralCode || "CD-SHAFT2SL"
      } to get ₦200 on your first order!`,
      url: window.location.origin, // You can replace this with a specific referral link
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error("Error sharing:", err);
      alert(
        "Sharing is not supported on this device. Please copy the code instead!"
      );
    }
  };

  return (
    <>
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
                      className="text-gray-200 hover:text-gray-800 transition-colors"
                      aria-label="Go back"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold text-[#1A2E20]">
                      Refer & Earn
                    </h2>
                  </div>
                </div>

                {/* Referral Illustration Section */}
                <div className="p-4 bg-[#1A2E20] flex flex-col items-center shadow-lg">
                  <div className="relative">
                    {/* Custom Trophy Illustration */}
                    <div className="w-32 h-32 bg-gradient-to-br from-[#FF6600] to-[#FF9900] rounded-full flex items-center justify-center border-4 border-white">
                      <span className="text-5xl">🏆</span>
                    </div>
                    {/* Sparkle effect */}
                    <div className="absolute top-0 left-0 right-0 flex justify-around">
                      <span className="text-2xl text-[#FF6600]">✨</span>
                      <span className="text-2xl text-[#FF6600]">✨</span>
                      <span className="text-2xl text-[#FF6600]">✨</span>
                    </div>
                  </div>

                  {/* Referral Code with Copy and Share Buttons */}
                  <div className="mt-4 flex items-center gap-2 bg-[#FF6600] text-white rounded-full px-4 py-2 shadow-md">
                    <span className="font-semibold">
                      {user?.referralCode || "CD-SHAFT2SL"}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                  {copied && (
                    <span className="mt-2 text-sm text-white">
                      Copied to clipboard!
                    </span>
                  )}
                </div>

                {/* Referral Rewards Section */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#1A2E20] mb-2">
                    Invite a Friend & Earn
                  </h3>
                  <div className="relative space-y-4">
                    {/* First Bullet with Connector */}
                    <div className="flex items-start gap-2">
                      <div className="relative flex items-center">
                        <span className="w-4 h-4 bg-[#FF6600] rounded-sm transform rotate-45 z-10"></span>
                        {/* Dotted Line Connector */}
                        <div className="absolute top-4 left-1.5 h-12 w-0.5 border-l-2 border-dashed border-[#FF6600]"></div>
                      </div>
                      <div>
                        <p className="text-[#1A2E20] font-semibold">₦200</p>
                        <p className="text-sm text-gray-500">
                          After their first order
                        </p>
                      </div>
                    </div>
                    {/* Second Bullet */}
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-[#FF6600] rounded-sm transform rotate-45"></span>
                      <div>
                        <p className="text-[#1A2E20] font-semibold">₦200</p>
                        <p className="text-sm text-gray-500">
                          After their second order
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A2E20] mt-4 mb-2">
                    Your Friend Earns
                  </h3>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 bg-[#FF6600] rounded-sm transform rotate-45"></span>
                    <div>
                      <p className="text-[#1A2E20] font-semibold">₦200</p>
                      <p className="text-sm text-gray-500">
                        On their first order
                      </p>
                    </div>
                  </div>
                </div>

                {/* Check Referral History Link */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsReferralHistoryOpen(true); // Open ReferralHistoryModal
                      onClose(); // Close ReferralModal
                    }}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-[#FF6600] font-semibold">
                      Check Referral History
                    </span>
                    <ChevronRight size={20} className="text-[#FF6600]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Referral History Modal */}
      <ReferralHistoryModal
        isOpen={isReferralHistoryOpen}
        onClose={() => setIsReferralHistoryOpen(false)}
      />
    </>
  );
};

export default ReferralModal;