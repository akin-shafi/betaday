/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { Package, User, MapPin, Info } from "lucide-react";
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
  packageProtection: boolean;
  packageWorth: string;
}

export function ReceivePackageForm({ onBack }: ReceivePackageFormProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const [formData, setFormData] = useState<ReceiveFormData>({
    trackingCode: "",
    recipientName: "",
    recipientPhone: "",
    pickupAddress: "",
    preferredTime: "",
    idNumber: "",
    packageProtection: false,
    packageWorth: "",
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
    if (formData.packageProtection && !formData.packageWorth) {
      newErrors.packageWorth = "Package worth is required for protection";
    }

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

  // Calculate protection fee (2% of package worth)
  const packageWorthNumber =
    Number.parseFloat(formData.packageWorth.replace(/,/g, "")) || 0;
  const protectionFee = formData.packageProtection
    ? Math.round(packageWorthNumber * 0.02)
    : 0;

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Handle package worth input formatting
  const handlePackageWorthChange = (value: string) => {
    // Remove non-numeric characters except commas
    const numericValue = value.replace(/[^\d]/g, "");
    // Format with commas
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    updateFormData("packageWorth", formattedValue);
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

        {/* Package Protection */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            Package protection
          </h3>
          <button
            type="button"
            onClick={() =>
              updateFormData("packageProtection", !formData.packageProtection)
            }
            className="w-full border border-gray-200 rounded-lg p-4 transition-all hover:border-green-300 hover:bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    formData.packageProtection ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      formData.packageProtection
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">
                    Apply package protection
                  </h4>
                  <p className="text-xs text-gray-600">
                    Use our insurance to safeguard your packages against any
                    incidents. We've got you covered!
                  </p>
                </div>
              </div>
              <div className="flex items-center ml-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.packageProtection
                      ? "bg-green-600 border-green-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {formData.packageProtection && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Package Worth Input - Show when protection is selected */}
          {formData.packageProtection && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center space-x-2 relative">
                <label className="block text-sm font-small text-gray-900">
                  How much is this package worth?
                </label>
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="relative"
                >
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  {showTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-pink-100 border border-pink-200 rounded-lg shadow-lg z-10">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-pink-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 2L3 7v11h14V7l-7-5z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-pink-900 text-xs mb-1">
                            Why we need to know?
                          </h5>
                          <p className="text-xs text-pink-800">
                            Don't fret! The cost of the protection fee is
                            determined by the worth of your package.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-500 text-sm">₦</span>
                </div>
                <input
                  type="text"
                  value={formData.packageWorth}
                  onChange={(e) => handlePackageWorthChange(e.target.value)}
                  className={`w-full pl-8 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm ${
                    errors.packageWorth ? "border-red-500 bg-red-50" : ""
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.packageWorth && (
                <p className="text-xs text-[#1A2E20]">{errors.packageWorth}</p>
              )}
            </div>
          )}
        </div>

        {/* Fee Summary */}
        {formData.packageProtection && (
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Protection fee:</span>
              <span className="text-sm font-medium text-[#1A2E20]">
                ₦{formatNumber(protectionFee)}
              </span>
            </div>
          </div>
        )}

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

      <style jsx global>{`
        .phone-input-container .PhoneInput {
          background: rgb(249 250 251);
          border: 1px solid rgb(229 231 235);
          border-radius: 0.5rem;
          padding: 0.75rem;
          transition: all 0.2s;
        }

        .phone-input-container .PhoneInput:focus-within {
          background: white;
          border-color: rgb(22 163 74);
          box-shadow: 0 0 0 2px rgb(22 163 74 / 0.2);
        }

        .phone-input-container .PhoneInput input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: rgb(17 24 39);
        }

        .phone-input-container .PhoneInput input::placeholder {
          color: rgb(107 114 128);
        }

        .phone-input-container .PhoneInputCountrySelect {
          background: transparent;
          border: none;
          outline: none;
        }

        .phone-input-error .PhoneInput {
          border-color: rgb(239 68 68);
          background: rgb(254 242 242);
        }

        .phone-input-disabled .PhoneInput {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
