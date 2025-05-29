/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useModal } from "@/contexts/modal-context";
import { message } from "antd";
import SlidingModalWrapper from "../SlidingModalWrapper";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  identifier: string;
}

interface ResetPasswordFormValues {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  identifier,
}: ResetPasswordModalProps) {
  const { resetPassword } = useAuth();
  const { openModal } = useModal();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        message.error("Passwords do not match");
        return;
      }
      if (data.newPassword.length < 8) {
        message.error("Password must be at least 8 characters long");
        return;
      }

      await resetPassword(identifier, data.otp, data.newPassword);
      message.success("Password reset successfully!");
      onClose();
      openModal("login");
      reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password.";
      message.error(errorMessage);
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium mb-1 text-black"
            >
              OTP
            </label>
            <Controller
              name="otp"
              control={control}
              rules={{
                required: "OTP is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "OTP must be a 4-digit number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  id="otp"
                  type="text"
                  value={value || ""}
                  onChange={onChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                    errors.otp
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1A2E20]"
                  }`}
                  placeholder="Enter the OTP"
                />
              )}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium mb-1 text-black"
            >
              New Password
            </label>
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "New password is required",
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  id="newPassword"
                  type="password"
                  value={value || ""}
                  onChange={onChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                    errors.newPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1A2E20]"
                  }`}
                  placeholder="Enter your new password"
                />
              )}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1 text-black"
            >
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm password is required",
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  id="confirmPassword"
                  type="password"
                  value={value || ""}
                  onChange={onChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1A2E20]"
                  }`}
                  placeholder="Confirm your new password"
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#1A2E20] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
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
