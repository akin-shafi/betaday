/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { Package, User, MapPin } from "lucide-react";
import type React from "react";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.trackingCode)
      newErrors.trackingCode = "Tracking code is required";
    if (!formData.recipientName)
      newErrors.recipientName = "Full name is required";
    if (!formData.recipientPhone)
      newErrors.recipientPhone = "Phone number is required";
    if (!formData.pickupAddress)
      newErrors.pickupAddress = "Address is required";
    if (!formData.preferredTime)
      newErrors.preferredTime = "Preferred time is required";
    if (!formData.idNumber) newErrors.idNumber = "ID number is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Receive package data:", formData);
      // Handle form submission
    }
  };

  const updateFormData = (field: keyof ReceiveFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 px-4 pt-2">
        <button
          onClick={onBack}
          className="flex items-center font-small text-sm"
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="mr-2"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            ></path>
          </svg>
          Receive a package
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Tracking Information */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <Package className="w-4 h-4 mr-2 text-[#1A2E20]" />
            Package Tracking
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              Tracking Code
            </label>
            <input
              type="text"
              value={formData.trackingCode}
              onChange={(e) => updateFormData("trackingCode", e.target.value)}
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm"
              placeholder="Enter tracking code (e.g., RLY123456789)"
            />
            {errors.trackingCode && (
              <p className="text-xs text-[#1A2E20]">{errors.trackingCode}</p>
            )}
            <p className="text-xs text-gray-500">
              You can find this code in your confirmation email or SMS
            </p>
          </div>
        </div>

        {/* Recipient Verification */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <User className="w-4 h-4 mr-2 text-[#1A2E20]" />
            Recipient Verification
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              Full Name
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => updateFormData("recipientName", e.target.value)}
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm"
              placeholder="Enter your full name"
            />
            {errors.recipientName && (
              <p className="text-xs text-[#1A2E20]">{errors.recipientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              Phone Number*
            </label>
            <div className="phone-input-container">
              <PhoneInput
                international
                defaultCountry="NG"
                value={formData.recipientPhone}
                onChange={(value) =>
                  updateFormData("recipientPhone", value || "")
                }
                className={`phone-input ${
                  errors.recipientPhone ? "phone-input-error" : ""
                }`}
              />
            </div>
            {errors.recipientPhone && (
              <p className="text-xs text-[#1A2E20]">{errors.recipientPhone}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              ID Number
            </label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => updateFormData("idNumber", e.target.value)}
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm"
              placeholder="National ID, Driver's License, etc."
            />
            {errors.idNumber && (
              <p className="text-xs text-[#1A2E20]">{errors.idNumber}</p>
            )}
            <p className="text-xs text-gray-500">
              Required for package verification and security
            </p>
          </div>
        </div>

        {/* Delivery Preferences */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-[#1A2E20]" />
            Delivery Preferences
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              Pickup/Delivery Address
            </label>
            <textarea
              value={formData.pickupAddress}
              onChange={(e) => updateFormData("pickupAddress", e.target.value)}
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm resize-none"
              placeholder="Enter your address for package delivery"
              rows={3}
            />
            {errors.pickupAddress && (
              <p className="text-xs text-[#1A2E20]">{errors.pickupAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              Preferred Time
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => updateFormData("preferredTime", e.target.value)}
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm"
            >
              <option value="">Select preferred time</option>
              <option value="morning">Morning (8AM - 12PM)</option>
              <option value="afternoon">Afternoon (12PM - 5PM)</option>
              <option value="evening">Evening (5PM - 8PM)</option>
              <option value="anytime">Anytime (8AM - 8PM)</option>
            </select>
            {errors.preferredTime && (
              <p className="text-xs text-[#1A2E20]">{errors.preferredTime}</p>
            )}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-1 text-sm">
            Important Notes:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Please have your ID ready for verification</li>
            <li>• Ensure someone is available at the delivery address</li>
            <li>• You'll receive SMS updates about delivery status</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#135d29] text-white py-3 rounded-lg font-semibold text-base hover:bg-green-800 transition-colors"
        >
          Confirm Delivery Details
        </button>
      </form>
    </div>
  );
}
