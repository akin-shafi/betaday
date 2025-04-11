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
        // If input is 10 digits or less, treat as 10-digit number
        newValue = cleanedValue;
      } else if (cleanedValue.length <= 13) {
        // If input is 11-13 digits, check if it starts with 234
        if (cleanedValue.startsWith("234")) {
          newValue = cleanedValue;
        } else {
          // If it doesn't start with 234, prepend it
          newValue = "234" + cleanedValue;
        }
      } else {
        // If longer than 13 digits, truncate to 13
        newValue = cleanedValue.slice(0, 13);
      }

      // Ensure the value is either 10 or 13 digits
      if (newValue.length > 10 && !newValue.startsWith("234")) {
        newValue = "234" + newValue.slice(-10);
      }

      // console.log("Phone number changed:", newValue);
      onChange(newValue);
    };

    const handleBlurEvent = () => {
      if (onBlur) {
        onBlur(value);
      }
    };

    // Format the display value
    const displayValue = value.startsWith("234") ? value.slice(3) : value;

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
          placeholder="8098290445"
          className={`flex-1 h-full p-2 text-black focus:outline-none focus:ring-1 focus:ring-[#1A2E20] rounded-r-md ${
            hasError ? "border-red-500" : ""
          }`}
          maxLength={13}
        />
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
