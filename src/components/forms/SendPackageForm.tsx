/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unescaped-entities */
"use client"
import { MapPin, Check, Info } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import AddressSelectionModal from "@/components/modal/address-selection-modal"

interface SendPackageFormProps {
  onBack: () => void
}

interface SendFormData {
  pickupAddress: string
  dropoffAddress: string
  senderName: string
  senderPhone: string
  recipientName: string
  recipientPhone: string
  recipientEmail: string
  packageType: string
  otherPackageType: string
  packageProtection: boolean
  packageWorth: string
  useAccountInfo: boolean
}

const packageTypes = ["Food", "Clothes", "Books", "Medicine", "Phone", "Documents", "Other", "Prefer not to say"]

export function SendPackageForm({ onBack }: SendPackageFormProps) {
  const { user, isAuthenticated } = useAuth()
  const [showInfoMessage, setShowInfoMessage] = useState(false)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [addressModalType, setAddressModalType] = useState<"pickup" | "dropoff">("pickup")

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
    packageWorth: "",
    useAccountInfo: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle "Use my account information" toggle - only populate when user clicks
  useEffect(() => {
    if (formData.useAccountInfo && isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        senderName: user.fullName || "",
        senderPhone: user.phoneNumber || "",
      }))
    } else if (!formData.useAccountInfo) {
      // Clear fields when unchecked
      setFormData((prev) => ({
        ...prev,
        senderName: "",
        senderPhone: "",
      }))
    }
  }, [formData.useAccountInfo, user, isAuthenticated])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!formData.pickupAddress) newErrors.pickupAddress = "Pickup address is required"
    if (!formData.dropoffAddress) newErrors.dropoffAddress = "Drop off address is required"
    if (!formData.senderName) newErrors.senderName = "Sender name is required"
    if (!formData.senderPhone) newErrors.senderPhone = "Phone is required"
    if (!formData.recipientName) newErrors.recipientName = "Receiver name is required"
    if (!formData.recipientPhone) newErrors.recipientPhone = "Phone is required"
    if (formData.packageType === "Other" && !formData.otherPackageType) {
      newErrors.otherPackageType = "Please specify the package type"
    }
    if (formData.packageProtection && !formData.packageWorth) {
      newErrors.packageWorth = "Package worth is required for protection"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const packageData = {
        ...formData,
        userId: user?.id || null,
        finalPackageType: formData.packageType === "Other" ? formData.otherPackageType : formData.packageType,
      }

      console.log("Send package data:", packageData)
      // Handle form submission - navigate to payment
    }
  }

  const updateFormData = (field: keyof SendFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Calculate protection fee (2% of package worth)
  const packageWorthNumber = Number.parseFloat(formData.packageWorth.replace(/,/g, "")) || 0
  const protectionFee = formData.packageProtection ? Math.round(packageWorthNumber * 0.02) : 0
  const baseDeliveryFee = 500 // Base delivery fee
  const totalDeliveryFee = baseDeliveryFee + protectionFee

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Handle package worth input formatting
  const handlePackageWorthChange = (value: string) => {
    // Remove non-numeric characters except commas
    const numericValue = value.replace(/[^\d]/g, "")
    // Format with commas
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    updateFormData("packageWorth", formattedValue)
  }

  // Handle address field clicks
  const handleAddressFieldClick = (type: "pickup" | "dropoff") => {
    setAddressModalType(type)
    setAddressModalOpen(true)
  }

  // Handle address selection from modal
  const handleAddressSelect = (address: string) => {
    if (addressModalType === "pickup") {
      updateFormData("pickupAddress", address)
    } else {
      updateFormData("dropoffAddress", address)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 px-4 pt-2">
        <button onClick={onBack} className="flex items-center font-small text-sm">
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
          </svg>
          Send a package
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Pickup Address */}
        <div className="space-y-2">
          <label className="block text-sm font-small text-gray-900">Pick up address</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="w-4 h-4 text-[#1A2E20]" />
            </div>
            <input
              type="text"
              value={formData.pickupAddress}
              onClick={() => handleAddressFieldClick("pickup")}
              readOnly
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm cursor-pointer"
              placeholder="Enter pickup address"
            />
          </div>
          {errors.pickupAddress && <p className="text-xs text-[#1A2E20]">{errors.pickupAddress}</p>}
        </div>

        {/* Drop off Address */}
        <div className="space-y-2">
          <label className="block text-sm font-small text-gray-900">Drop off address</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="w-4 h-4 text-[#1A2E20]" />
            </div>
            <input
              type="text"
              value={formData.dropoffAddress}
              onClick={() => handleAddressFieldClick("dropoff")}
              readOnly
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm cursor-pointer"
              placeholder="Enter drop off address"
            />
          </div>
          {errors.dropoffAddress && <p className="text-xs text-[#1A2E20]">{errors.dropoffAddress}</p>}
        </div>

        {/* Sender Information */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Sender information</h3>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">Name</label>
            <input
              type="text"
              value={formData.senderName}
              onChange={(e) => updateFormData("senderName", e.target.value)}
              disabled={formData.useAccountInfo && isAuthenticated}
              className={`w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm ${
                errors.senderName ? "border-red-500 bg-red-50" : ""
              } ${formData.useAccountInfo && isAuthenticated ? "opacity-60 cursor-not-allowed" : ""}`}
              placeholder="Enter your name"
            />
            {errors.senderName && <p className="text-xs text-[#1A2E20]">{errors.senderName}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">Phone number*</label>
            <div className="phone-input-container">
              <PhoneInput
                international
                defaultCountry="NG"
                value={formData.senderPhone}
                onChange={(value) => updateFormData("senderPhone", value || "")}
                disabled={formData.useAccountInfo && isAuthenticated}
                className={`phone-input ${errors.senderPhone ? "phone-input-error" : ""} ${
                  formData.useAccountInfo && isAuthenticated ? "phone-input-disabled" : ""
                }`}
              />
            </div>
            {errors.senderPhone && <p className="text-xs text-[#1A2E20]">{errors.senderPhone}</p>}
          </div>

          {/* Use Account Info Checkbox - Only show if user is authenticated */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => updateFormData("useAccountInfo", !formData.useAccountInfo)}
                className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                  formData.useAccountInfo ? "bg-[#135d29] border-[#135d29]" : "border-gray-300 bg-white"
                }`}
              >
                {formData.useAccountInfo && <Check className="w-2.5 h-2.5 text-white" />}
              </button>
              <label className="text-sm text-gray-900">Use my account information</label>
            </div>
          )}
        </div>

        {/* Receiver Information */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Receiver information</h3>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">Name</label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => updateFormData("recipientName", e.target.value)}
              className={`w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm ${
                errors.recipientName ? "border-red-500 bg-red-50" : ""
              }`}
              placeholder="Enter recipient's name"
            />
            {errors.recipientName && <p className="text-xs text-[#1A2E20]">{errors.recipientName}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">Phone number*</label>
            <div className="phone-input-container">
              <PhoneInput
                international
                defaultCountry="NG"
                value={formData.recipientPhone}
                onChange={(value) => updateFormData("recipientPhone", value || "")}
                className={`phone-input ${errors.recipientPhone ? "phone-input-error" : ""}`}
              />
            </div>
            {errors.recipientPhone && <p className="text-xs text-[#1A2E20]">{errors.recipientPhone}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-small text-gray-900">Email</label>
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
          <h3 className="text-base font-semibold text-gray-900">What's in the package?</h3>
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
              <label className="block text-sm font-small text-gray-900">Please specify</label>
              <input
                type="text"
                value={formData.otherPackageType}
                onChange={(e) => updateFormData("otherPackageType", e.target.value)}
                className={`w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:bg-white focus:border-green-600 transition-all text-sm ${
                  errors.otherPackageType ? "border-red-500 bg-red-50" : ""
                }`}
                placeholder="Describe your package"
              />
              {errors.otherPackageType && <p className="text-xs text-[#1A2E20]">{errors.otherPackageType}</p>}
            </div>
          )}
        </div>

        {/* Package Protection */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Package protection</h3>
          <button
            type="button"
            onClick={() => updateFormData("packageProtection", !formData.packageProtection)}
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
                    className={`w-4 h-4 ${formData.packageProtection ? "text-green-600" : "text-gray-500"}`}
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
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">Apply package protection</h4>
                  <p className="text-xs text-gray-600">
                    Use our insurance to safeguard your packages against any incidents. We've got you covered!
                  </p>
                </div>
              </div>
              <div className="flex items-center ml-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.packageProtection ? "bg-green-600 border-green-600" : "border-gray-300 bg-white"
                  }`}
                >
                  {formData.packageProtection && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </div>
            </div>
          </button>

          {/* Package Worth Input - Show when protection is selected */}
          {formData.packageProtection && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center space-x-2">
                <label className="block text-sm font-small text-gray-900">How much is this package worth?</label>
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
                      <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11h14V7l-7-5z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-pink-900 text-xs mb-1">Why we need to know?</h5>
                      <p className="text-xs text-pink-800">
                        Don't fret! The cost of the protection fee is determined by the worth of your package.
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
              {errors.packageWorth && <p className="text-xs text-[#1A2E20]">{errors.packageWorth}</p>}
            </div>
          )}
        </div>

        {/* Fee Summary */}
        <div className="space-y-3">
          {formData.packageProtection && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Protection fee:</span>
              <span className="text-sm font-medium text-[#1A2E20]">₦{formatNumber(protectionFee)}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-700">Delivery fee:</span>
            <span className="text-sm font-medium text-[#1A2E20]">₦{formatNumber(baseDeliveryFee)}</span>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-900">Total:</span>
              <span className="text-xl font-bold text-[#1A2E20]">₦{formatNumber(totalDeliveryFee)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#135d29] text-white py-3 rounded-lg font-semibold text-base hover:bg-green-800 transition-colors"
        >
          Go to payments ₦{formatNumber(totalDeliveryFee)}
        </button>
      </form>

      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onAddressSelect={handleAddressSelect}
        title={addressModalType === "pickup" ? "Select pickup address" : "Select drop-off address"}
        placeholder={addressModalType === "pickup" ? "Enter pickup address" : "Enter drop-off address"}
        requireVerification={addressModalType === "pickup"} // Only verify pickup addresses
        addressType={addressModalType} // Pass the address type
      />

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
  )
}
