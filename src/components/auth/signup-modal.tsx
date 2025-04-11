/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm, Controller } from "react-hook-form";
import { X, Mail } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";
import { useAuth } from "@/contexts/auth-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "react-toastify";
import SlidingModalWrapper from "../SlidingModalWrapper";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referralCode?: string;
  role: string;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const { signup } = useAuth();
  const { openModal } = useModal();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      referralCode: "",
      role: "user",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    if (!/^\d{10}$/.test(data.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      const phoneNumberWithPrefix = "234" + data.phoneNumber;
      await signup({
        fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        referralCode: data.referralCode,
        role: data.role || "user",
      });
      toast.success("OTP sent successfully!");
      onClose();
      openModal("otp", { phoneNumber: phoneNumberWithPrefix, source: "signup" });
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
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
        <h2 className="text-2xl font-bold text-center mb-2 text-black">Sign Up</h2>
        <p className="text-gray-500 text-center mb-6">Sign Up to continue.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-black">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                  errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#1A2E20]"
                }`}
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-black">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                  errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#1A2E20]"
                }`}
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-black">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-10 p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#1A2E20]"
                }`}
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-black">
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
                  hasError={!!errors.phoneNumber}
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium mb-1 text-black">
              Referral Code (Optional)
            </label>
            <input
              id="referralCode"
              type="text"
              placeholder="Enter referral code"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-[#1A2E20]"
              {...register("referralCode")}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A2E20] text-white cursor-pointer py-3 rounded-md hover:bg-[#FF6600] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Processing..." : "Next"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-500">
            Have an Account?{" "}
            <button
              type="button"
              className="text-[#FF6600] cursor-pointer font-medium hover:underline"
              onClick={() => {
                onClose();
                openModal("login");
              }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </SlidingModalWrapper>
  );
}