/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronRight, LogOut, Calendar } from "lucide-react";
import { VerifiedIcon } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user"; // Adjust the path as needed
import EditProfileModal from "@/components/modal/EditProfileModal"; // Adjust the path as needed
import WalletModal from "@/components/modal/WalletModal"; // Adjust the path as needed
import ReferralModal from "@/components/modal/ReferralModal"; // Adjust the path as needed
import OrdersModal from "@/components/modal/OrdersModal"; // Adjust the path as needed
import WeeklyMealPlanModal from "@/components/modal/WeeklyMealPlanModal";
import SavedMealPlansModal from "@/components/modal/SavedMealPlansModal"; // Import the new modal

interface ProfileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false); // State for ReferralModal
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false); // New state for OrdersModal

  const [isWeeklyMealPlanModalOpen, setIsWeeklyMealPlanModalOpen] =
    useState(false);
  const [isSavedMealPlansModalOpen, setIsSavedMealPlansModalOpen] =
    useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const { user, logout } = useAuth();
  // console.log("user", user);

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

  const accountDetailsVariants = {
    hidden: { height: 0, opacity: 0, overflow: "hidden" },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  const defaultAvatar = "/default-avatar.png";

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

                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-[#292d32]">
                    Profile
                  </h2>
                  <button
                    className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <X
                      size={24}
                      className="transition-transform group-hover:scale-110"
                    />
                    <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  </button>
                </div>

                {/* Profile Header Section */}
                <div className="p-4 flex flex-col items-center border-b border-gray-200">
                  <div className="relative">
                    <Image
                      src={user?.avatar || defaultAvatar}
                      alt="User Avatar"
                      width={80}
                      height={80}
                      className="rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultAvatar;
                      }}
                    />
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                      <span className="text-sm">😊</span>
                    </div>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-[#292d32]">
                    {user?.fullName || "User"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-[#FFF4E5] text-[#FF6600] rounded-full px-2 py-1 text-sm">
                      <span>★</span>
                      <span>1.0</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FFF4E5] text-[#FF6600] rounded-full px-2 py-1 text-sm">
                      <span>🪙</span>
                      <span>{user?.wallet_balance || 0}</span>
                    </div>
                  </div>
                  <div className="mt-2 bg-[#E5E5FF] text-[#6666FF] rounded-full px-4 py-1 text-sm">
                    {user?.wallet_no || "N/A"} | {user?.bank_name || "N/A"}
                  </div>
                </div>

                {/* Personal Section */}
                <div className="p-4">
                  <h4 className="text-md font-semibold text-[#292d32] mb-2">
                    Personal
                  </h4>
                  <ul className="space-y-2">
                    <li
                      onClick={() =>
                        setIsAccountDetailsOpen(!isAccountDetailsOpen)
                      }
                      className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">👤</span>
                        <span>Profile Details</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-500" />
                    </li>
                    <AnimatePresence>
                      {isAccountDetailsOpen && (
                        <motion.div
                          variants={accountDetailsVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="p-4 border-b border-gray-200"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-semibold text-[#292d32]">
                              Account Details
                            </h3>
                            <button
                              onClick={() => {
                                setIsEditModalOpen(true);
                                onClose();
                              }}
                              className="text-[#FF6600] text-sm font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div className="bg-gray-100 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Account name
                              </p>
                              <p className="text-[#292d32] font-medium">
                                {user?.fullName || "Shafi Akinropo"}
                              </p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Phone number
                                </p>
                                <p className="text-[#292d32] font-medium">
                                  +{user?.phoneNumber || "08145360866"}
                                </p>
                              </div>
                              <span className="text-green-500">
                                <VerifiedIcon />
                              </span>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-[#292d32] font-medium">
                                  {user?.email || "sakinropo@gmail.com"}
                                </p>
                              </div>
                              <span className="text-green-500">
                                <VerifiedIcon />
                              </span>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Date of birth
                                </p>
                                <p className="text-[#292d32] font-medium">
                                  {user?.dateOfBirth || "December 19th"}
                                </p>
                              </div>
                              <Calendar size={20} className="text-gray-500" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📍</span>
                        <span>Addresses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FF6600] text-white rounded-full px-2 py-0.5 text-xs">
                          1
                        </span>
                        <ChevronRight size={20} className="text-gray-500" />
                      </div>
                    </li>
                    <li
                      onClick={() => {
                        setIsOrdersModalOpen(true); // Open OrdersModal
                        onClose(); // Close ProfileDetailsModal
                      }}
                      className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📦</span>
                        <span>My Orders</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-500" />
                    </li>
                    {/* <li
                      onClick={() => {
                        setIsWeeklyMealPlanModalOpen(true);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📅</span>
                        <span>Weekly Meal Plan</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-500" />
                    </li> */}
                    <Link
                      href="/meal-plan"
                      className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer"
                    >
                      {/* <button className="py-2 px-4 bg-[#FF6600] text-white rounded-lg"> */}
                      Create Weekly Meal Plan
                      {/* </button> */}
                    </Link>
                    <li
                      onClick={() => {
                        setIsSavedMealPlansModalOpen(true);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">💾</span>
                        <span>Saved Meal Plans</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-500" />
                    </li>
                    <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-[#6666FF]">✦</span>
                        <span>Beta Bonus</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-500" />
                    </li>
                    <li
                      onClick={() => {
                        setIsWalletModalOpen(true);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">💳</span>
                        <span>Wallet</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-500" />
                    </li>
                  </ul>
                </div>

                {/* Services Section */}
                <div className="p-4">
                  <h4 className="text-md font-semibold text-[#292d32] mb-2">
                    Services
                  </h4>
                  <ul className="space-y-2">
                    <li
                      onClick={() => {
                        setIsReferralModalOpen(true); // Open ReferralModal
                        onClose(); // Close ProfileDetailsModal
                      }}
                      className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">🎁</span>
                        <span>Referrals</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-500" />
                    </li>
                    <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                      <button
                        onClick={() => {
                          logout();
                          if (onLogout) onLogout();
                        }}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut size={20} className="text-gray-500" />
                          <span>Logout</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-500" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Referral Modal */}
      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />

      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        onBack={() => {
          setIsOrdersModalOpen(false); // Close OrdersModal
          onClose(); // Reopen ProfileDetailsModal (handled by parent)
        }}
      />

      <WeeklyMealPlanModal
        isOpen={isWeeklyMealPlanModalOpen}
        onClose={() => setIsWeeklyMealPlanModalOpen(false)}
        onBack={() => {
          setIsWeeklyMealPlanModalOpen(false);
          onClose();
        }}
      />
      <SavedMealPlansModal
        isOpen={isSavedMealPlansModalOpen}
        onClose={() => setIsSavedMealPlansModalOpen(false)}
        onBack={() => {
          setIsSavedMealPlansModalOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default ProfileDetailsModal;
