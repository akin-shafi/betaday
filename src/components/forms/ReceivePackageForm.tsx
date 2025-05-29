/* eslint-disable react/no-unescaped-entities */
"use client";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";
import type React from "react";

import { useState } from "react";

interface ReceivePackageFormProps {
  onBack: () => void;
}

interface ReceiveFormData {
  trackingCode: string;
  recipientName: string;
  recipientPhone: string;
  pickupAddress: string;
  preferredTime: string;
  idNumber: string;
}

export function ReceivePackageForm({ onBack }: ReceivePackageFormProps) {
  const [formData, setFormData] = useState<ReceiveFormData>({
    trackingCode: "",
    recipientName: "",
    recipientPhone: "",
    pickupAddress: "",
    preferredTime: "",
    idNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle receive package form submission
    console.log("Receive package data:", formData);
    // You can add API call here
    // Example: await trackPackageAPI(formData);
  };

  const updateFormData = (field: keyof ReceiveFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          Track & Receive Package
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tracking Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Package Tracking
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tracking Code
            </label>
            <input
              type="text"
              value={formData.trackingCode}
              onChange={(e) => updateFormData("trackingCode", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter tracking code (e.g., RLY123456789)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You can find this code in your confirmation email or SMS
            </p>
          </div>
        </div>

        {/* Recipient Verification */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Recipient Verification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) =>
                  updateFormData("recipientName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.recipientPhone}
                onChange={(e) =>
                  updateFormData("recipientPhone", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="+234 xxx xxx xxxx"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number
            </label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => updateFormData("idNumber", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="National ID, Driver's License, etc."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for package verification and security
            </p>
          </div>
        </div>

        {/* Delivery Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Delivery Preferences
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup/Delivery Address
            </label>
            <textarea
              value={formData.pickupAddress}
              onChange={(e) => updateFormData("pickupAddress", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Enter your address for package delivery"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => updateFormData("preferredTime", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            >
              <option value="">Select preferred time</option>
              <option value="morning">Morning (8AM - 12PM)</option>
              <option value="afternoon">Afternoon (12PM - 5PM)</option>
              <option value="evening">Evening (5PM - 8PM)</option>
              <option value="anytime">Anytime (8AM - 8PM)</option>
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Please have your ID ready for verification</li>
            <li>• Ensure someone is available at the delivery address</li>
            <li>• You'll receive SMS updates about delivery status</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Confirm Delivery Details
        </button>
      </form>
    </div>
  );
}
