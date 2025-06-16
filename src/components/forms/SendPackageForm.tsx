/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { MapPin, Check, Info, Loader2, AlertTriangle } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import AddressSelectionModal from "@/components/modal/address-selection-modal";
import { useDeliveryFee } from "@/hooks/useDeliveryFee";

interface SendPackageFormProps {
  onBack: () => void;
}

interface AddressData {
  address: string;
  coordinates?: { lat: number; lng: number };
  localGovernmentId?: string;
}

interface SendFormData {
  pickupAddress: AddressData;
  dropoffAddress: AddressData;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  packageType: string;
  otherPackageType: string;
  packageProtection: boolean;
  packageWorth: string;
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
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressModalType, setAddressModalType] = useState<
    "pickup" | "dropoff"
  >("pickup");

  const {
    feeData,
    isCalculating,
    error: feeError,
    missingLocationError,
    calculateFee,
    clearFee,
  } = useDeliveryFee();

  const [formData, setFormData] = useState<SendFormData>({
    pickupAddress: { address: "" },
    dropoffAddress: { address: "" },
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    packageType: "",
    otherPackageType: "",
    packageProtection: false,
    packageWorth: "",
    useAccountInfo: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate delivery fee when both addresses are set - with proper dependency management
  useEffect(() => {
    const { pickupAddress, dropoffAddress } = formData;

    // Only calculate if we have complete address data
    if (
      pickupAddress.address &&
      dropoffAddress.address &&
      pickupAddress.coordinates &&
      dropoffAddress.coordinates &&
      pickupAddress.localGovernmentId &&
      dropoffAddress.localGovernmentId
    ) {
      console.log("Both addresses set, calculating fee...");
      calculateFee(
        {
          address: pickupAddress.address,
          coordinates: pickupAddress.coordinates,
          localGovernmentId: pickupAddress.localGovernmentId,
        },
        {
          address: dropoffAddress.address,
          coordinates: dropoffAddress.coordinates,
          localGovernmentId: dropoffAddress.localGovernmentId,
        }
      );
    } else {
      // Clear fee if addresses are incomplete
      clearFee();
    }
  }, [
    // Only depend on the actual address data that matters for calculation
    formData.pickupAddress.address,
    formData.pickupAddress.coordinates?.lat,
    formData.pickupAddress.coordinates?.lng,
    formData.pickupAddress.localGovernmentId,
    formData.dropoffAddress.address,
    formData.dropoffAddress.coordinates?.lat,
    formData.dropoffAddress.coordinates?.lng,
    formData.dropoffAddress.localGovernmentId,
    calculateFee,
    clearFee,
  ]);

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

    if (!formData.pickupAddress.address)
      newErrors.pickupAddress = "Pickup address is required";
    if (!formData.dropoffAddress.address)
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
    if (formData.packageProtection && !formData.packageWorth) {
      newErrors.packageWorth = "Package worth is required for protection";
    }

    // Check for missing location data
    if (missingLocationError) {
      if (missingLocationError.pickup) {
        newErrors.pickupAddress =
          "Please select a more specific pickup address";
      }
      if (missingLocationError.dropoff) {
        newErrors.dropoffAddress =
          "Please select a more specific drop-off address";
      }
    }

    // Check if fee calculation failed
    if (feeError) {
      newErrors.general =
        "Unable to calculate delivery fee. Please check your addresses.";
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
        deliveryFee: feeData?.deliveryFee || 0,
        feeBreakdown: feeData?.breakdown,
      };

      console.log("Send package data:", packageData);
      // Handle form submission - navigate to payment
    }
  };

  const updateFormData = (
    field: keyof SendFormData,
    value: string | boolean | AddressData
  ) => {
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
  const baseDeliveryFee = feeData?.deliveryFee || 0; // Use calculated fee or fallback
  const totalDeliveryFee = baseDeliveryFee + protectionFee;

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

  // Handle address field clicks
  const handleAddressFieldClick = (type: "pickup" | "dropoff") => {
    setAddressModalType(type);
    setAddressModalOpen(true);
  };

  // Handle address selection from modal
  const handleAddressSelect = (
    address: string,
    coordinates?: { lat: number; lng: number },
    localGovernmentId?: string
  ) => {
    console.log("Address selected:", {
      address,
      coordinates,
      localGovernmentId,
    });

    const addressData: AddressData = {
      address,
      coordinates,
      localGovernmentId,
    };

    if (addressModalType === "pickup") {
      console.log("Setting pickup address:", addressData);
      updateFormData("pickupAddress", addressData);
    } else {
      console.log("Setting dropoff address:", addressData);
      updateFormData("dropoffAddress", addressData);
    }

    // Close modal
    setAddressModalOpen(false);
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
          Send a package
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Pickup Address */}
        <div className="space-y-2">
          <label className="block text-sm font-small text-gray-900">
            Pick up address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="w-4 h-4 text-[#1A2E20]" />
            </div>
            <input
              type="text"
              value={formData.pickupAddress.address}
              onClick={() => handleAddressFieldClick("pickup")}
              readOnly
              className={`w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm cursor-pointer ${
                errors.pickupAddress ? "border-red-500 bg-red-50" : ""
              }`}
              placeholder="Enter pickup address"
            />
          </div>
          {errors.pickupAddress && (
            <p className="text-xs text-red-600">{errors.pickupAddress}</p>
          )}

          {/* Missing location warning for pickup */}
          {missingLocationError?.pickup && formData.pickupAddress.address && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-800 font-medium">
                    Address too general
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    This address doesn't provide enough location details for
                    accurate delivery fee calculation. Please select a more
                    specific address.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drop off Address */}
        <div className="space-y-2">
          <label className="block text-sm font-small text-gray-900">
            Drop off address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="w-4 h-4 text-[#1A2E20]" />
            </div>
            <input
              type="text"
              value={formData.dropoffAddress.address}
              onClick={() => handleAddressFieldClick("dropoff")}
              readOnly
              className={`w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm cursor-pointer ${
                errors.dropoffAddress ? "border-red-500 bg-red-50" : ""
              }`}
              placeholder="Enter drop off address"
            />
          </div>
          {errors.dropoffAddress && (
            <p className="text-xs text-red-600">{errors.dropoffAddress}</p>
          )}

          {/* Missing location warning for dropoff */}
          {missingLocationError?.dropoff && formData.dropoffAddress.address && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-800 font-medium">
                    Address too general
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    This address doesn't provide enough location details for
                    accurate delivery fee calculation. Please select a more
                    specific address.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Fee Display - Show immediately after addresses */}
        {(formData.pickupAddress.address ||
          formData.dropoffAddress.address) && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Delivery Fee
            </h3>

            {isCalculating && (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                <span className="text-sm text-gray-600">
                  Calculating delivery fee...
                </span>
              </div>
            )}

            {feeError && (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">
                  Error calculating fee: {feeError}
                </span>
              </div>
            )}

            {missingLocationError && (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700">
                  Please select more specific addresses to calculate delivery
                  fee
                </span>
              </div>
            )}

            {feeData && !isCalculating && !missingLocationError && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    Base delivery fee:
                  </span>
                  <span className="text-sm font-medium text-[#1A2E20]">
                    ₦{formatNumber(feeData.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Distance: {feeData.distanceInKm}km</span>
                  <span>
                    {feeData.pickupZone} → {feeData.dropoffZone}
                  </span>
                </div>
                {feeData.breakdown.isSurge && (
                  <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    ⚡ Surge pricing active
                  </div>
                )}
              </div>
            )}

            {!feeData &&
              !isCalculating &&
              !feeError &&
              !missingLocationError && (
                <div className="text-sm text-gray-500">
                  {!formData.pickupAddress.address &&
                  !formData.dropoffAddress.address
                    ? "Enter both addresses to calculate delivery fee"
                    : !formData.pickupAddress.address
                    ? "Enter pickup address"
                    : "Enter drop-off address"}
                </div>
              )}
          </div>
        )}

        {/* Rest of the form remains the same... */}
        {/* Sender Information */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            Sender information
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              Name
            </label>
            <input
              type="text"
              value={formData.senderName}
              onChange={(e) => updateFormData("senderName", e.target.value)}
              disabled={formData.useAccountInfo && isAuthenticated}
              className={`w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm ${
                errors.senderName ? "border-red-500 bg-red-50" : ""
              } ${
                formData.useAccountInfo && isAuthenticated
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
              placeholder="Enter your name"
            />
            {errors.senderName && (
              <p className="text-xs text-[#1A2E20]">{errors.senderName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              Phone number*
            </label>
            <div className="phone-input-container">
              <PhoneInput
                international
                defaultCountry="NG"
                value={formData.senderPhone}
                onChange={(value) => updateFormData("senderPhone", value || "")}
                disabled={formData.useAccountInfo && isAuthenticated}
                className={`phone-input ${
                  errors.senderPhone ? "phone-input-error" : ""
                } ${
                  formData.useAccountInfo && isAuthenticated
                    ? "phone-input-disabled"
                    : ""
                }`}
              />
            </div>
            {errors.senderPhone && (
              <p className="text-xs text-[#1A2E20]">{errors.senderPhone}</p>
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
                    ? "bg-[#135d29] border-[#135d29]"
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
            <label className="block text-sm font-small text-gray-900">
              Name
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => updateFormData("recipientName", e.target.value)}
              className={`w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm ${
                errors.recipientName ? "border-red-500 bg-red-50" : ""
              }`}
              placeholder="Enter recipient's name"
            />
            {errors.recipientName && (
              <p className="text-xs text-[#1A2E20]">{errors.recipientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">
              Phone number*
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
              Email
            </label>
            <input
              type="email"
              value={formData.recipientEmail}
              onChange={(e) => updateFormData("recipientEmail", e.target.value)}
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm"
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Package Type */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            What's in the package?
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {packageTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateFormData("packageType", type)}
                className={`px-2 py-2 rounded-full text-xxs font-medium transition-colors ${
                  formData.packageType === type
                    ? "bg-[#135d29] text-white"
                    : "bg-green-50 border border-green-200 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Other Package Type Input */}
          {formData.packageType === "Other" && (
            <div className="space-y-2 mt-3">
              <label className="block text-sm font-small text-gray-900">
                Please specify
              </label>
              <input
                type="text"
                value={formData.otherPackageType}
                onChange={(e) =>
                  updateFormData("otherPackageType", e.target.value)
                }
                className={`w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm ${
                  errors.otherPackageType ? "border-red-500 bg-red-50" : ""
                }`}
                placeholder="Describe your package"
              />
              {errors.otherPackageType && (
                <p className="text-xs text-[#1A2E20]">
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
          <button
            type="button"
            onClick={() =>
              updateFormData("packageProtection", !formData.packageProtection)
            }
            className="w-full border border-gray-200 rounded-lg p-4 transition-all hover:border-green-300 hover:bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
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
              <div className="flex items-center space-x-2">
                <label className="block text-sm font-small text-gray-900">
                  How much is this package worth?
                </label>
                <button
                  type="button"
                  onClick={() => setShowInfoMessage(!showInfoMessage)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Info Message Card - appears below when clicked */}
              {showInfoMessage && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 mb-2">
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
                        Don't fret! The cost of the protection fee is determined
                        by the worth of your package.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
        <div className="space-y-3">
          {formData.packageProtection && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Protection fee:</span>
              <span className="text-sm font-medium text-[#1A2E20]">
                ₦{formatNumber(protectionFee)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-700">Delivery fee:</span>
            <span className="text-sm font-medium text-[#1A2E20]">
              {isCalculating ? (
                <div className="flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Calculating...</span>
                </div>
              ) : (
                `₦${formatNumber(baseDeliveryFee)}`
              )}
            </span>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-900">
                Total:
              </span>
              <span className="text-xl font-bold text-[#1A2E20]">
                ₦{formatNumber(totalDeliveryFee)}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCalculating || missingLocationError !== null}
          className="w-full bg-[#135d29] text-white py-3 rounded-lg font-semibold text-base hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating
            ? "Calculating..."
            : missingLocationError
            ? "Please select specific addresses"
            : `Go to payments ₦${formatNumber(totalDeliveryFee)}`}
        </button>
      </form>

      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onAddressSelect={handleAddressSelect}
        title={
          addressModalType === "pickup"
            ? "Select pickup address"
            : "Select drop-off address"
        }
        placeholder={
          addressModalType === "pickup"
            ? "Enter pickup address"
            : "Enter drop-off address"
        }
        requireVerification={addressModalType === "pickup"} // Only verify pickup addresses
        addressType={addressModalType} // Pass the address type
      />

      {/* Sticky Fee Tracker at Bottom */}
      {feeData && !missingLocationError && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:hidden">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total delivery cost</p>
              <p className="text-xs text-gray-500">
                {feeData.distanceInKm}km • {feeData.pickupZone} →{" "}
                {feeData.dropoffZone}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#1A2E20]">
                ₦{formatNumber(totalDeliveryFee)}
              </p>
              {feeData.breakdown.isSurge && (
                <p className="text-xs text-orange-600">⚡ Surge active</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
