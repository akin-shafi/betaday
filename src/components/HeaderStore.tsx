/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import SignupModal from "./auth/signup-modal";
import LoginModal from "./auth/login-modal";
import CartBadge from "./cart/cart-badge";
import AddressSearchModal from "./modal/address-search-modal";
import JoinWaitlistModal from "./modal/join-waitlist-modal";
import ProfileDetailsModal from "./modal/ProfileDetailsModal"; // Import the new modal
import Link from "next/link";
import { useAddress } from "@/contexts/address-context";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";
import { useHeaderStore } from "@/stores/header-store";

const HeaderStore: React.FC = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // New state for ProfileDetailsModal
  const [undeliverableAddress, setUndeliverableAddress] = useState("");

  const { setCartOpen } = useHeaderStore();

  const {
    address: contextAddress,
    isAddressValid,
    isLoading,
    error,
    addressSource,
  } = useAddress();
  const { isAuthenticated, logout } = useAuth();

  const openSignupModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const openLoginModal = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileModalOpen(true); // Open the ProfileDetailsModal
    } else {
      openLoginModal();
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileModalOpen(false); // Close the modal on logout
    toast.success("Logout successful");
  };

  const toggleCart = () => setCartOpen(true);

  const renderAddressText = () => {
    if (isLoading) return "Getting your location...";
    if (error) return "Set your location";
    if (isAddressValid && contextAddress) {
      const sourceIndicator = {
        localStorage: (
          <svg
            className="inline-block h-4 w-4 mr-1"
            fill="gray"
            stroke="gray"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        ),
        currentLocation: "📍",
        manual: (
          <svg
            className="inline-block h-4 w-4 mr-1"
            fill="black"
            stroke="black"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        ),
        none: "⚪",
      }[addressSource];
      return (
        <>
          {sourceIndicator} {contextAddress}{" "}
        </>
      );
    }
    return "Set your location";
  };

  // Skeleton Loader for Header
  if (isLoading) {
    return (
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 animate-pulse">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] bg-gray-200 rounded-lg" />
            <div className="flex items-center">
              <div className="h-4 w-32 md:w-40 bg-gray-200 rounded" />
              <div className="h-4 w-4 ml-1 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] bg-gray-200 rounded-full" />
            <div className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="rounded-lg">
              <Image
                src="/icons/betaday-icon.svg"
                alt="betaday logo"
                width={30}
                height={30}
                className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] transition-all duration-300 object-contain"
                quality={55}
                priority
                sizes="(max-width: 640px) 16vw, (max-width: 768px) 20vw, (max-width: 1024px) 24vw, 28vw"
              />
            </Link>

            <div className="flex items-center text-gray-600">
              <span className="flex items-center ml-1 md:ml-0 mr-1">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex font-medium text-sm md:text-sm w-fit items-center leading-none"
                  disabled={isLoading}
                >
                  <span className="truncate max-w-[150px] md:max-w-[200px]">
                    {renderAddressText()}
                  </span>
                  <ChevronDown className="inline-block h-4 w-4 ml-1 text-gray-600" />
                </button>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={toggleCart}
                className="relative bg-[#1A2E20] hover:bg-[#1A2E20] cursor-pointer flex items-center text-[white] justify-center rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
              >
                <ShoppingCart size={20} />
                <CartBadge />
              </button>
            </div>

            <div className="relative">
              <button
                type="button"
                className="relative bg-[#FF6600] hover:bg-gray-400 cursor-pointer flex items-center text-white justify-center rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
                onClick={handleProfileClick}
              >
                <User className="h-5 w-5" />
                {isAuthenticated && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <AddressSearchModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onJoinWaitlist={(address: string) => {
          setUndeliverableAddress(address);
          setIsAddressModalOpen(false);
          setIsWaitlistModalOpen(true);
        }}
      />

      <JoinWaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => {
          setIsWaitlistModalOpen(false);
          setUndeliverableAddress("");
        }}
        address={undeliverableAddress}
      />

      <ProfileDetailsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={() => handleLogout()}
      />
    </>
  );
};

export default HeaderStore;
