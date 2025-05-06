"use client";

import React, { forwardRef } from "react";
import Image from "next/image";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: (value: string) => void;
  hasError?: boolean;
  autoFocus?: boolean;
}

const PhoneNumberInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  (
    { value, onChange, onFocus, onBlur, hasError = false, autoFocus = false },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.trim();
      // Remove all non-digit characters
      const cleanedValue = inputValue.replace(/\D/g, "");

      let newValue = cleanedValue;

      // Handle different input formats
      if (cleanedValue.length <= 10) {
        // If input is 10 digits or less, prepend +234
        newValue = "+234" + cleanedValue;
      } else if (cleanedValue.length <= 13) {
        // If input is 11-13 digits, check if it starts with 234
        if (cleanedValue.startsWith("234")) {
          newValue = "+234" + cleanedValue.slice(3);
        } else {
          // If it doesn't start with 234, prepend +234 and take last 10 digits
          newValue = "+234" + cleanedValue.slice(-10);
        }
      } else {
        // If longer than 13 digits, truncate to 13 (including +234)
        newValue = "+234" + cleanedValue.slice(-10);
      }

      // Ensure the value is either +234 followed by 10 digits
      if (newValue.length > 4 && !newValue.startsWith("+234")) {
        newValue = "+234" + newValue.slice(-10);
      }

      // console.log("Phone number changed:", newValue);
      onChange(newValue);
    };

    const handleBlurEvent = () => {
      if (onBlur) {
        onBlur(value);
      }
    };

    // Format the display value (remove +234 for display)
    const displayValue = value.startsWith("+234") ? value.slice(4) : value;

    return (
      <div
        className={`flex items-center w-full border rounded-md h-[38px] overflow-hidden ${
          hasError ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div className="flex items-center bg-gray-100 border-r border-gray-300 px-2 h-full">
          <Image
            src="/flags/ng.png"
            alt="Nigeria Flag"
            width={24}
            height={16}
            className="mr-1"
          />
          <span className="text-black font-medium">+234</span>
        </div>
        <input
          ref={ref}
          type="tel"
          value={displayValue}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={handleBlurEvent}
          autoFocus={autoFocus}
          placeholder="8023123456"
          className={`flex-1 h-full p-2 text-black focus:outline-none focus:ring-1 focus:ring-[#1A2E20] rounded-r-md ${
            hasError ? "border-red-500" : ""
          }`}
          maxLength={10} // Restrict to 10 digits for display
        />
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
