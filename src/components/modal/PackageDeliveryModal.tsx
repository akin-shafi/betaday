"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Truck } from "lucide-react";
import { useState } from "react";
import { SendPackageForm } from "../forms/SendPackageForm";
import { ReceivePackageForm } from "../forms/ReceivePackageForm";

interface PackageDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = "main" | "send-form" | "receive-form";

export function PackageDeliveryModal({
  isOpen,
  onClose,
}: PackageDeliveryModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>("main");

  const handleBack = () => {
    setCurrentStep("main");
  };

  const handleSendPackage = () => {
    setCurrentStep("send-form");
  };

  const handleReceivePackage = () => {
    setCurrentStep("receive-form");
  };

  const renderMainContent = () => (
    <div className="p-6 h-full flex flex-col">
      {/* Title Section - More compact like reference image */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1 leading-tight">
          Package delivery, <br />
          made simple with Jara
        </h1>
        <p className="text-gray-600 text-sm">
          Send and receive packages from friends, vendors, or loved ones.
        </p>
      </div>

      {/* Cards Container - Flex grow to fill available space */}
      <div className="flex-1 flex flex-col gap-3 min-h-0 m">
        {/* Send Package Card - Fully clickable */}
        <button
          onClick={handleSendPackage}
          className="bg-green-100 hover:bg-green-200 rounded-2xl p-6 transition-all duration-200 text-left flex-1 min-h-[140px] sm:min-h-[120px] flex items-center justify-between group border border-green-100"
        >
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Send a package
            </h2>
            <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors">
              <span className="text-sm">Get started</span>
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>

          {/* Package Illustration */}
          <div className="relative flex-shrink-0 ml-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-green-900 rounded-xl transform rotate-12 relative shadow-lg">
              <div className="absolute inset-2 border-2 border-yellow-300 rounded"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl transform -rotate-6 absolute -bottom-2 -left-2 shadow-lg">
              <div className="absolute inset-1.5 border-2 border-orange-400 rounded"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Package className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </button>

        {/* Receive Package Card - Fully clickable */}
        <button
          onClick={handleReceivePackage}
          className="bg-green-100 hover:bg-green-200 rounded-2xl p-6 transition-all duration-200 text-left flex-1 min-h-[140px] sm:min-h-[120px] flex items-center justify-between group border border-green-100"
        >
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Receive a package
            </h2>
            <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors">
              <span className="text-sm">Track delivery</span>
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>

          {/* Delivery Illustration */}
          <div className="relative flex-shrink-0 ml-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-green-900 rounded-full flex items-center justify-center shadow-lg">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <Package className="w-3 h-3 text-gray-900" />
            </div>
          </div>
        </button>
      </div>

      {/* Features - Simplified */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 flex-shrink-0 hidden">
        <div className="text-center flex-1">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-700 text-lg">⚡</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Fast</p>
        </div>
        <div className="text-center flex-1">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-700 text-lg">📍</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Tracked</p>
        </div>
        <div className="text-center flex-1">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-700 text-lg">🔒</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Secure</p>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-baseline space-x-1">
                <div className="text-2xl font-bold text-[#135d29]">Jara</div>
                <div className="text-xxs text-gray-500 font-normal">
                  by BetaDay
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content - Flex grow to fill remaining space */}
            <div className="flex-1 min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {currentStep === "main" && renderMainContent()}
                  {currentStep === "send-form" && (
                    <SendPackageForm onBack={handleBack} />
                  )}
                  {currentStep === "receive-form" && (
                    <ReceivePackageForm onBack={handleBack} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
