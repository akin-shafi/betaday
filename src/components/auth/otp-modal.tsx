/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { message } from "antd";
import SlidingModalWrapper from "../SlidingModalWrapper";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  source: "login" | "signup";
}

interface OTPFormValues {
  otp: string;
}

export default function OTPModal({
  isOpen,
  onClose,
  phoneNumber,
  source,
}: OTPModalProps) {
  const { verifyOTP, resendOTP } = useAuth();
  const [countdown, setCountdown] = useState(60); // 60-second countdown
  const [canResend, setCanResend] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OTPFormValues>({
    defaultValues: { otp: "" },
  });

  // Start countdown when modal opens or after resend
  useEffect(() => {
    if (!isOpen) return;

    setCountdown(60);
    setCanResend(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount or when modal closes
    return () => clearInterval(timer);
  }, [isOpen]);

  const onSubmit = async (data: OTPFormValues) => {
    try {
      await verifyOTP(phoneNumber, data.otp, source);
      message.success(
        `${source === "login" ? "Logged in" : "Signed up"} successfully!`
      );
      reset();
      onClose();
    } catch (error) {
      message.error("Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(phoneNumber, source);
      message.success("OTP resent successfully!");
      // Restart countdown
      setCountdown(60);
      setCanResend(false);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      message.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <SlidingModalWrapper isOpen={isOpen} onClose={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full z-60"
      >
        <X size={20} />
      </button>
      <div className="p-6 mt-10">
        <h2 className="text-2xl font-bold text-center mb-2 text-black">
          Enter OTP
        </h2>
        <p className="text-black text-center mb-6">
          Enter the OTP sent to your phone
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Controller
              name="otp"
              control={control}
              rules={{
                required: "OTP is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Please enter a valid 4-digit OTP",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      type="tel"
                      maxLength={1}
                      className={`w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6600] ${
                        errors.otp ? "border-red-500" : "border-gray-300"
                      }`}
                      value={value?.[index] || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (!/^\d*$/.test(newValue)) return;
                        const currentValue = value || "";
                        const newOtp = currentValue.split("");
                        newOtp[index] = newValue;
                        if (newValue && index < 3) {
                          const nextInput = document.querySelector(
                            `input[name="otp-${index + 1}"]`
                          ) as HTMLInputElement;
                          nextInput?.focus();
                        }
                        onChange(newOtp.join(""));
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !value?.[index] &&
                          index > 0
                        ) {
                          const prevInput = document.querySelector(
                            `input[name="otp-${index - 1}"]`
                          ) as HTMLInputElement;
                          prevInput?.focus();
                        }
                      }}
                      name={`otp-${index}`}
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500 text-center">
                {errors.otp.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#1A2E20] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-500">
            Didn’t receive an OTP?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || isSubmitting}
              className={`font-medium ${
                canResend && !isSubmitting
                  ? "text-[#FF6600] hover:underline"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              aria-label={
                canResend ? "Resend OTP" : `Resend OTP in ${countdown} seconds`
              }
            >
              {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
            </button>
          </p>
        </div>
      </div>
    </SlidingModalWrapper>
  );
}
