/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Mail, Eye, EyeOff } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";
import { useAuth } from "@/contexts/auth-context";
import { useModal } from "@/contexts/modal-context";
import { message } from "antd";
import SlidingModalWrapper from "../SlidingModalWrapper";
import { GoogleLogin, GoogleCredentialResponse } from "@react-oauth/google";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormValues {
  identifier: string;
  password: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, googleLogin } = useAuth();
  const { openModal } = useModal();
  const [isPhone, setIsPhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (isPhone && !/^\+234\d{10}$/.test(data.identifier)) {
        message.error("Please enter a valid 10-digit phone number");
        return;
      }
      if (!isPhone && !data.password) {
        message.error("Password is required for email login");
        return;
      }
      await login(data.identifier, isPhone ? undefined : data.password);
      message.success(isPhone ? "OTP sent successfully!" : "Login successful!");
      if (isPhone) {
        openModal("otp", { phoneNumber: data.identifier, source: "login" });
      }
      reset();
      if (!isPhone) onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to login.";
      message.error(errorMessage);
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google credential is missing");
      }
      await googleLogin(credentialResponse);
      message.success("Google login successful!");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Google login failed";
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
          Sign In
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
            <div className="relative">
              {!isPhone && (
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              )}
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
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                      className={`w-full p-3 ${
                        !isPhone ? "pl-10" : ""
                      } border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                        errors.identifier
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[#1A2E20]"
                      }`}
                      placeholder="Enter your email"
                    />
                  )
                }
              />
            </div>
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>
          {!isPhone && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-black"
              >
                Password
              </label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field: { onChange, value } }) => (
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={value || ""}
                      onChange={onChange}
                      className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[#1A2E20]"
                      }`}
                      placeholder="Enter your password"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
          {!isPhone && (
            <div className="text-right">
              <button
                type="button"
                className="text-[#FF6600] cursor-pointer font-medium hover:underline"
                onClick={() => {
                  onClose();
                  openModal("forgot-password");
                }}
              >
                Forgot Password?
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#1A2E20] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Processing..." : isPhone ? "Send OTP" : "Sign In"}
          </button>
        </form>
        <div className="mt-4 flex justify-center hidden">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => message.error("Google login failed")}
            text="signin_with"
            theme="filled_blue"
            size="medium"
            width="200px"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-black">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-[#FF6600] cursor-pointer font-medium hover:underline"
              onClick={() => {
                onClose();
                openModal("signup");
              }}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </SlidingModalWrapper>
  );
}
