"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Truck } from "lucide-react";

interface PackageDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PackageDeliveryModal({
  isOpen,
  onClose,
}: PackageDeliveryModalProps) {
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
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-purple-600">Jara</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  by BetaDay
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Easy package delivery with Jara
                </h1>
                <p className="text-gray-600 text-lg">
                  Send and receive packages from friends, vendors, or loved
                  ones.
                </p>
              </div>

              {/* Send Package Section */}
              <div className="mb-8">
                <div className="bg-pink-50 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Send a package
                      </h2>
                      <button className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-full font-medium transition-colors flex items-center space-x-2">
                        <span>Get started</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Package Illustration */}
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg transform rotate-12 relative">
                        <div className="absolute inset-2 border-2 border-yellow-300 rounded"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-6 h-6 bg-yellow-300 rounded-full"></div>
                        </div>
                      </div>
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg transform -rotate-6 absolute -bottom-4 -left-4">
                        <div className="absolute inset-2 border-2 border-orange-400 rounded"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receive Package Section */}
              <div className="mb-8">
                <div className="bg-blue-50 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Receive a package
                      </h2>
                      <button className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-full font-medium transition-colors flex items-center space-x-2">
                        <span>Track delivery</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Delivery Illustration */}
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                        <Truck className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-900" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Real-time tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Secure delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    Same-day delivery available
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
