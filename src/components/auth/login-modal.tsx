/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";
import { useAuth } from "@/contexts/auth-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "react-toastify";
import SlidingModalWrapper from "../SlidingModalWrapper";

interface LoginModalProps {
  isOpen: boolean; 
  onClose: () => void;
}

interface LoginFormValues {
  phoneNumber: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { openModal } = useModal();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { phoneNumber: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!/^\d{10}$/.test(data.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    const number = "234" + data.phoneNumber;
    try {
      await login(number);
      toast.success("OTP sent successfully!");
      onClose();
      openModal("otp", { phoneNumber: number, source: "login" });
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handlePhoneBlur = (value: string) => {
    if (value && !/^\d{10}$/.test(value)) {
      toast.error("Please enter a valid 10-digit phone number");
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
          Sign In
        </h2>
        <p className="text-black text-center mb-6">Sign In to continue.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium mb-1 text-black"
            >
              Phone Number
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <PhoneNumberInput
                  value={value || ""}
                  onChange={onChange}
                  onFocus={() => console.log("Phone input focused")}
                  onBlur={handlePhoneBlur}
                  hasError={!!errors.phoneNumber}
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#1A2E20] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Sending OTP..." : "Next"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-black">
            Don&lsquo;t have an Account?{" "}
            <button
              type="button"
              className="text-[#FF6600] cursor-pointer font-medium hover:underline"
              onClick={() => {
                onClose();
                openModal("signup");
              }}
            >
              Create One
            </button>
          </p>
        </div>
      </div>
    </SlidingModalWrapper>
  );
}
