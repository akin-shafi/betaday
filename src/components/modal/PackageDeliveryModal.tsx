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
    <div className="p-4">
      {/* Title Section - More compact */}
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Easy package delivery with jara
        </h1>
        <p className="text-gray-600">
          Send and receive packages from friends, vendors, or loved ones.
        </p>
      </div>

      {/* Send Package Section - More compact */}
      <div className="mb-3">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 relative overflow-hidden border border-pink-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Send a package
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Quick and reliable delivery
              </p>
              <button
                onClick={handleSendPackage}
                className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
              >
                <span>Get started</span>
                <span>→</span>
              </button>
            </div>

            {/* Package Illustration - Smaller */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg transform rotate-12 relative shadow-lg">
                <div className="absolute inset-1 border-2 border-yellow-300 rounded"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg transform -rotate-6 absolute -bottom-2 -left-2 shadow-lg">
                <div className="absolute inset-1 border-2 border-orange-400 rounded"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Package className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receive Package Section - More compact */}
      <div className="mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 relative overflow-hidden border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Receive a package
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Track and schedule delivery
              </p>
              <button
                onClick={handleReceivePackage}
                className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
              >
                <span>Track delivery</span>
                <span>→</span>
              </button>
            </div>

            {/* Delivery Illustration - Smaller */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <Package className="w-3 h-3 text-gray-900" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features - More compact, horizontal layout */}
      <div className="flex justify-between mt-4 border-t pt-3">
        <div className="text-center flex-1">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <span className="text-green-600 text-sm">⚡</span>
          </div>
          <p className="text-xs font-medium text-gray-900">Fast Delivery</p>
        </div>
        <div className="text-center flex-1">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <span className="text-blue-600 text-sm">📍</span>
          </div>
          <p className="text-xs font-medium text-gray-900">Live Tracking</p>
        </div>
        <div className="text-center flex-1">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <span className="text-purple-600 text-sm">🔒</span>
          </div>
          <p className="text-xs font-medium text-gray-900">Secure</p>
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
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <div className="text-xl font-bold text-purple-600">Jara</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  by BetaDay
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
