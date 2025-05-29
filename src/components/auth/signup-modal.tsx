import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Mail, Eye, EyeOff } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";
import { useAuth } from "@/contexts/auth-context";
import { useModal } from "@/contexts/modal-context";
import { message } from "antd";
import SlidingModalWrapper from "../SlidingModalWrapper";
import { GoogleLogin, GoogleCredentialResponse } from "@react-oauth/google";

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
  password: string;
  confirmPassword: string;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const { signup, googleSignup } = useAuth();
  const { openModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    // reset,
    watch,
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      referralCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormValues) => {
    try {
      if (!data.email || !data.password || !data.confirmPassword) {
        message.error("Email, Password, and Confirm Password are required");
        return;
      }
      if (!/^\+234\d{10}$/.test(data.phoneNumber)) {
        message.error("Please enter a valid 10-digit phone number");
        return;
      }
      if (data.password !== data.confirmPassword) {
        message.error("Passwords do not match");
        return;
      }
      await signup({
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phoneNumber: data.phoneNumber,
        referralCode: data.referralCode,
        role: "user",
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      message.success("Signup successful!");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process signup. Please try again.";
      message.error(errorMessage);
    }
  };

  const handleGoogleSignupSuccess = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google credential is missing");
      }
      await googleSignup(credentialResponse, {
        phoneNumber: watch("phoneNumber"),
        referralCode: watch("referralCode"),
        role: "user",
        password: watch("password"),
        confirmPassword: watch("confirmPassword"),
      });
      message.success("Google signup successful!");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Google signup failed";
      message.error(errorMessage);
    }
  };

  const handlePhoneBlur = (value: string) => {
    if (value && !/^\+234\d{10}$/.test(value)) {
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
      <div className="p-6 mt-10 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Sign Up
        </h2>
        <div className="mt-4 flex justify-center mb-6 hidden">
          <GoogleLogin
            onSuccess={handleGoogleSignupSuccess}
            onError={() => message.error("Google signup failed")}
            text="signup_with"
            theme="filled_blue"
            size="medium"
            width="200px"
          />
        </div>
        <div className="my-2 flex items-center justify-center hidden">
          <div className="relative flex items-center w-full max-w-md or-divider">
            <span className="or-text px-4 text-gray-600 font-semibold text-md z-10 bg-white transition-transform duration-300">
              Or
            </span>
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent or-line"></div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-1 text-black"
              >
                First Name
              </label>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field: { onChange, value } }) => (
                  <input
                    id="firstName"
                    type="text"
                    value={value || ""}
                    onChange={onChange}
                    placeholder="Enter your first name"
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2E20]"
                    }`}
                  />
                )}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-1 text-black"
              >
                Last Name
              </label>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required" }}
                render={({ field: { onChange, value } }) => (
                  <input
                    id="lastName"
                    type="text"
                    value={value || ""}
                    onChange={onChange}
                    placeholder="Enter your last name"
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2E20]"
                    }`}
                  />
                )}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-black"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Controller
                name="email"
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field: { onChange, value } }) => (
                  <input
                    id="email"
                    type="email"
                    value={value || ""}
                    onChange={onChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2E20]"
                    }`}
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
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
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={value || ""}
                    onChange={onChange}
                    placeholder="Enter your password"
                    className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2E20]"
                    }`}
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
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1 text-black"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field: { onChange, value } }) => (
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={value || ""}
                    onChange={onChange}
                    placeholder="Confirm your password"
                    className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2E20]"
                    }`}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="referralCode"
              className="block text-sm font-medium mb-1 text-black"
            >
              Referral Code (Optional)
            </label>
            <Controller
              name="referralCode"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  id="referralCode"
                  type="text"
                  value={value || ""}
                  onChange={onChange}
                  placeholder="Enter referral code"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-[#1A2E20]"
                />
              )}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#1A2E20] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Processing..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-black">
            Have an Account?{" "}
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
