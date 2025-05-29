/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";
import { useAuth } from "@/contexts/auth-context";
import { useModal } from "@/contexts/modal-context";
import { message } from "antd";
import SlidingModalWrapper from "../SlidingModalWrapper";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgotPasswordFormValues {
  identifier: string;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const { forgotPassword } = useAuth();
  const { openModal } = useModal();
  const [isPhone, setIsPhone] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { identifier: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      if (isPhone && !/^\+234\d{10}$/.test(data.identifier)) {
        message.error("Please enter a valid 10-digit phone number");
        return;
      }
      await forgotPassword(data.identifier);
      message.success("Password reset OTP sent successfully!");
      onClose();
      openModal("reset-password", { identifier: data.identifier });
      reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send password reset request.";
      message.error(errorMessage);
    }
  };

  const handleIdentifierBlur = (value: string) => {
    if (isPhone && value && !/^\+234\d{10}$/.test(value)) {
      message.error("Please enter a valid 10-digit phone number");
    }
  };

  return (
    <SlidingModalWrapper isOpen={isOpen} onClose={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full z-60"
      >
        <X size={20} />
      </button>
      <div className="p-6 mt-2">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Reset Password
        </h2>
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setIsPhone(false)}
            className={`flex-1 py-2 rounded-lg ${
              !isPhone ? "bg-[#FF6600] text-white" : "bg-gray-100"
            } hover:bg-gray-200 transition-colors`}
          >
            Email
          </button>
          <button
            onClick={() => setIsPhone(true)}
            className={`flex-1 py-2 rounded-lg ${
              isPhone ? "bg-[#FF6600] text-white" : "bg-gray-100"
            } hover:bg-gray-200 transition-colors`}
          >
            Phone
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium mb-1 text-black"
            >
              {isPhone ? "Phone Number" : "Email"}
            </label>
            <Controller
              name="identifier"
              control={control}
              rules={{
                required: isPhone
                  ? "Phone number is required"
                  : "Email is required",
                pattern: isPhone
                  ? {
                      value: /^\+234\d{10}$/,
                      message: "Please enter a valid 10-digit phone number",
                    }
                  : {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
              }}
              render={({ field: { onChange, value } }) =>
                isPhone ? (
                  <PhoneNumberInput
                    value={value || ""}
                    onChange={onChange}
                    onFocus={() => console.log("Phone input focused")}
                    onBlur={handleIdentifierBlur}
                    hasError={!!errors.identifier}
                  />
                ) : (
                  <input
                    id="identifier"
                    type="email"
                    value={value || ""}
                    onChange={onChange}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                      errors.identifier
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2E20]"
                    }`}
                    placeholder="Enter your email"
                  />
                )
              }
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#1A2E20] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send Reset OTP"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-black">
            Back to{" "}
            <button
              type="button"
              className="text-[#FF6600] cursor-pointer font-medium hover:underline"
              onClick={() => {
                onClose();
                openModal("login");
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </SlidingModalWrapper>
  );
}
