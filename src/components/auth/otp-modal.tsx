/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";
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

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormValues>({
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: OTPFormValues) => {
    try {
      await verifyOTP(phoneNumber, data.otp, source);
      toast.success(
        `${source === "login" ? "Logged in" : "Signed up"} successfully!`
      );
      onClose();
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(phoneNumber, source);
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
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
                      className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
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
                    />
                  ))}
                </div>
              )}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
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
              className="text-[#FF6600] font-medium hover:underline"
              disabled={isSubmitting}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </SlidingModalWrapper>
  );
}
