/* eslint-disable react/no-unescaped-entities */
"use client";
import { ArrowLeft, MapPin, Check } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

interface SendPackageFormProps {
  onBack: () => void;
}

interface SendFormData {
  pickupAddress: string;
  dropoffAddress: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  packageType: string;
  otherPackageType: string;
  packageProtection: boolean;
  useAccountInfo: boolean;
}

const packageTypes = [
  "Food",
  "Clothes",
  "Books",
  "Medicine",
  "Phone",
  "Documents",
  "Other",
  "Prefer not to say",
];

export function SendPackageForm({ onBack }: SendPackageFormProps) {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<SendFormData>({
    pickupAddress: "",
    dropoffAddress: "",
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    packageType: "",
    otherPackageType: "",
    packageProtection: false,
    useAccountInfo: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle "Use my account information" toggle - only populate when user clicks
  useEffect(() => {
    if (formData.useAccountInfo && isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        senderName: user.fullName || "",
        senderPhone: user.phoneNumber || "",
      }));
    } else if (!formData.useAccountInfo) {
      // Clear fields when unchecked
      setFormData((prev) => ({
        ...prev,
        senderName: "",
        senderPhone: "",
      }));
    }
  }, [formData.useAccountInfo, user, isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.pickupAddress)
      newErrors.pickupAddress = "Pickup address is required";
    if (!formData.dropoffAddress)
      newErrors.dropoffAddress = "Drop off address is required";
    if (!formData.senderName) newErrors.senderName = "Sender name is required";
    if (!formData.senderPhone) newErrors.senderPhone = "Phone is required";
    if (!formData.recipientName)
      newErrors.recipientName = "Receiver name is required";
    if (!formData.recipientPhone)
      newErrors.recipientPhone = "Phone is required";
    if (formData.packageType === "Other" && !formData.otherPackageType) {
      newErrors.otherPackageType = "Please specify the package type";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const packageData = {
        ...formData,
        userId: user?.id || null,
        finalPackageType:
          formData.packageType === "Other"
            ? formData.otherPackageType
            : formData.packageType,
      };

      console.log("Send package data:", packageData);
      // Handle form submission - navigate to payment
    }
  };

  const updateFormData = (
    field: keyof SendFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const deliveryFee = formData.packageProtection ? 500 : 0;

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Send a package</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Pickup Address */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Pick up address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="w-4 h-4 text-red-500" />
            </div>
            <input
              type="text"
              value={formData.pickupAddress}
              onChange={(e) => updateFormData("pickupAddress", e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-100 border border-transparent rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-sm"
              placeholder="Enter address"
            />
          </div>
          {errors.pickupAddress && (
            <p className="text-xs text-red-500">{errors.pickupAddress}</p>
          )}
        </div>

        {/* Drop off Address */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Drop off address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="w-4 h-4 text-red-500" />
            </div>
            <input
              type="text"
              value={formData.dropoffAddress}
              onChange={(e) => updateFormData("dropoffAddress", e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-100 border border-transparent rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-sm"
              placeholder="Enter address"
            />
          </div>
          {errors.dropoffAddress && (
            <p className="text-xs text-red-500">{errors.dropoffAddress}</p>
          )}
        </div>

        {/* Delivery Fee Display */}
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Delivery fee:
            </span>
            <span className="text-lg font-semibold text-red-500">
              ₦{deliveryFee.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sender Information */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            Sender information
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Name
            </label>
            <input
              type="text"
              value={formData.senderName}
              onChange={(e) => updateFormData("senderName", e.target.value)}
              disabled={formData.useAccountInfo && isAuthenticated}
              className={`w-full px-3 py-3 bg-gray-100 border border-transparent rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-sm ${
                errors.senderName ? "border-red-500 bg-red-50" : ""
              } ${
                formData.useAccountInfo && isAuthenticated
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
              placeholder="Enter your name"
            />
            {errors.senderName && (
              <p className="text-xs text-red-500">{errors.senderName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Phone number*
            </label>
            <div
              className={`flex bg-gray-100 rounded-lg border border-transparent focus-within:ring-2 focus-within:ring-purple-500 focus-within:bg-white focus-within:border-purple-500 transition-all ${
                errors.senderPhone ? "border-red-500 bg-red-50" : ""
              } ${
                formData.useAccountInfo && isAuthenticated ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center px-3 py-3 border-r border-gray-300">
                <div className="w-5 h-3 bg-green-600 mr-2 flex items-center justify-center rounded-sm">
                  <div className="w-3 h-2 bg-white rounded-sm"></div>
                </div>
                <span className="text-gray-900 font-medium text-sm">234</span>
              </div>
              <input
                type="tel"
                value={formData.senderPhone}
                onChange={(e) => updateFormData("senderPhone", e.target.value)}
                disabled={formData.useAccountInfo && isAuthenticated}
                className={`flex-1 px-3 py-3 bg-transparent border-0 text-gray-900 placeholder-gray-400 focus:outline-none text-sm ${
                  formData.useAccountInfo && isAuthenticated
                    ? "cursor-not-allowed"
                    : ""
                }`}
                placeholder="08012345678"
              />
            </div>
            {errors.senderPhone && (
              <p className="text-xs text-red-500">{errors.senderPhone}</p>
            )}
          </div>

          {/* Use Account Info Checkbox - Only show if user is authenticated */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() =>
                  updateFormData("useAccountInfo", !formData.useAccountInfo)
                }
                className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                  formData.useAccountInfo
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {formData.useAccountInfo && (
                  <Check className="w-2.5 h-2.5 text-white" />
                )}
              </button>
              <label className="text-sm text-gray-900">
                Use my account information
              </label>
            </div>
          )}
        </div>

        {/* Receiver Information */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            Receiver information
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Name
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => updateFormData("recipientName", e.target.value)}
              className={`w-full px-3 py-3 bg-gray-100 border border-transparent rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-sm ${
                errors.recipientName ? "border-red-500 bg-red-50" : ""
              }`}
              placeholder="Enter recipient's name"
            />
            {errors.recipientName && (
              <p className="text-xs text-red-500">{errors.recipientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Phone number*
            </label>
            <div
              className={`flex bg-gray-100 rounded-lg border border-transparent focus-within:ring-2 focus-within:ring-purple-500 focus-within:bg-white focus-within:border-purple-500 transition-all ${
                errors.recipientPhone ? "border-red-500 bg-red-50" : ""
              }`}
            >
              <div className="flex items-center px-3 py-3 border-r border-gray-300">
                <div className="w-5 h-3 bg-green-600 mr-2 flex items-center justify-center rounded-sm">
                  <div className="w-3 h-2 bg-white rounded-sm"></div>
                </div>
                <span className="text-gray-900 font-medium text-sm">234</span>
              </div>
              <input
                type="tel"
                value={formData.recipientPhone}
                onChange={(e) =>
                  updateFormData("recipientPhone", e.target.value)
                }
                className="flex-1 px-3 py-3 bg-transparent border-0 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                placeholder="08012345678"
              />
            </div>
            {errors.recipientPhone && (
              <p className="text-xs text-red-500">{errors.recipientPhone}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              value={formData.recipientEmail}
              onChange={(e) => updateFormData("recipientEmail", e.target.value)}
              className="w-full px-3 py-3 bg-gray-100 border border-transparent rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-sm"
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Package Type */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            What's in the package?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {packageTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateFormData("packageType", type)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                  formData.packageType === type
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Other Package Type Input */}
          {formData.packageType === "Other" && (
            <div className="space-y-2 mt-3">
              <label className="block text-sm font-medium text-gray-900">
                Please specify
              </label>
              <input
                type="text"
                value={formData.otherPackageType}
                onChange={(e) =>
                  updateFormData("otherPackageType", e.target.value)
                }
                className={`w-full px-3 py-3 bg-gray-100 border border-transparent rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-500 transition-all text-sm ${
                  errors.otherPackageType ? "border-red-500 bg-red-50" : ""
                }`}
                placeholder="Describe your package"
              />
              {errors.otherPackageType && (
                <p className="text-xs text-red-500">
                  {errors.otherPackageType}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Package Protection */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            Package protection
          </h3>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1 text-sm">
                  Apply package protection
                </h4>
                <p className="text-xs text-gray-600">
                  Use our insurance to safeguard your packages against any
                  incidents. We've got you covered!
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateFormData(
                    "packageProtection",
                    !formData.packageProtection
                  )
                }
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 transition-colors ${
                  formData.packageProtection
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {formData.packageProtection && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Final Delivery Fee */}
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-gray-900">
              Delivery fee:
            </span>
            <span className="text-xl font-bold text-red-500">
              ₦{deliveryFee.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-800 text-white py-3 rounded-lg font-semibold text-base hover:bg-purple-900 transition-colors"
        >
          Go to payments ₦{deliveryFee.toLocaleString()}
        </button>
      </form>
    </div>
  );
}
