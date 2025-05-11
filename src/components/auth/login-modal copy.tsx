/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";
import { useAuth } from "@/contexts/auth-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "react-toastify";
import SlidingModalWrapper from "../SlidingModalWrapper";
import { GoogleLogin, GoogleCredentialResponse } from "@react-oauth/google";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormValues {
  emailOrPhone: string;
  password: string;
  phoneNumber: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, googleLogin } = useAuth();
  const { openModal } = useModal();
  const [loginMethod, setLoginMethod] = useState("email"); // Default to Email & Password

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    defaultValues: { emailOrPhone: "", password: "", phoneNumber: "" },
  });

  useEffect(() => {
    reset({ emailOrPhone: "", password: "", phoneNumber: "" });
  }, [loginMethod, reset]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (loginMethod === "phone") {
        if (!/^\+234\d{10}$/.test(data.phoneNumber)) {
          toast.error("Please enter a valid 10-digit phone number");
          return;
        }
        await login(data.phoneNumber);
        toast.success("OTP sent successfully!");
        onClose();
        openModal("otp", { phoneNumber: data.phoneNumber, source: "login" });
      } else {
        if (!data.emailOrPhone || !data.password) {
          toast.error("Email/Phone and Password are required");
          return;
        }
        await login(data.emailOrPhone, data.password);
        toast.success("Logged in successfully!");
        onClose();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process login. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      await googleLogin(credentialResponse);
      toast.success("Google login successful!");
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Google login failed";
      toast.error(errorMessage);
    }
  };

  const handlePhoneBlur = (value: string) => {
    if (value && !/^\+234\d{10}$/.test(value)) {
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
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Log In with
        </h2>
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-2 rounded-lg ${
              loginMethod === "email"
                ? "bg-[#FF6600] text-white"
                : "bg-gray-100"
            } hover:bg-gray-200 transition-colors`}
          >
            Email & Password
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 py-2 rounded-lg ${
              loginMethod === "phone"
                ? "bg-[#FF6600] text-white"
                : "bg-gray-100"
            } hover:bg-gray-200 transition-colors`}
          >
            Phone Only
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loginMethod === "email" ? (
            <>
              <div>
                <label
                  htmlFor="emailOrPhone"
                  className="block text-sm font-medium mb-1 text-black"
                >
                  Email or Phone Number
                </label>
                <Controller
                  name="emailOrPhone"
                  control={control}
                  rules={{
                    required: "Email or Phone number is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <input
                      id="emailOrPhone"
                      type="text"
                      value={value || ""}
                      onChange={onChange}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                        errors.emailOrPhone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[#1A2E20]"
                      }`}
                      placeholder="Enter your email or phone"
                    />
                  )}
                />
                {errors.emailOrPhone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.emailOrPhone.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1 text-black"
                >
                  Password
                </label>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <input
                      id="password"
                      type="password"
                      value={value || ""}
                      onChange={onChange}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[#1A2E20]"
                      }`}
                      placeholder="Enter your password"
                    />
                  )}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          ) : (
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
                    value: /^\+234\d{10}$/,
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
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#1A2E20] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-black">
            Don’t have an Account?{" "}
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
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => toast.error("Google login failed")}
            text="signin_with"
            theme="filled_blue"
            size="large"
            width="400px"
          />
        </div>
      </div>
    </SlidingModalWrapper>
  );
}