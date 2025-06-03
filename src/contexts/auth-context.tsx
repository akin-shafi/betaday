/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/user";
import { GoogleCredentialResponse } from "@react-oauth/google";

interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  referralCode?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}

interface EditUserData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (identifier: string, password?: string) => Promise<void>;
  verifyOTP: (
    phoneNumber: string,
    otp: string,
    source: "login" | "signup"
  ) => Promise<void>;
  resendOTP: (phoneNumber: string, source: "login" | "signup") => Promise<void>;
  forgotPassword: (identifier: string) => Promise<void>;
  resetPassword: (
    identifier: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
  logout: () => void;
  edit: (data: EditUserData) => Promise<void>;
  googleLogin: (credentialResponse: GoogleCredentialResponse) => Promise<void>;
  googleSignup: (
    credentialResponse: GoogleCredentialResponse,
    additionalData: Omit<SignupData, "email" | "fullName">
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const decoded: { exp: number; id: string; role: string } =
            jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            removeAuthToken();
            setUser(null);
          } else {
            await validateToken(token);
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error("Token decode/validation error:", errorMessage);
          removeAuthToken();
          setUser(null);
        }
      } else {
        console.log("AuthContext: No token found on initialization");
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const validateToken = async (token: string) => {
    try {
      // console.log("AuthContext: Validating token:", token);
      const response = await fetch(`${baseUrl}/auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Invalid token");
      const userData: User = await response.json();
      // console.log("AuthContext: User data fetched:", userData);
      setUser(userData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Token validation error:", errorMessage);
      removeAuthToken();
      setUser(null);
      throw new Error(errorMessage);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const {
        fullName,
        email,
        phoneNumber,
        referralCode,
        role,
        password,
        confirmPassword,
      } = data;

      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (!password || password.length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }
      }

      const response = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          referralCode,
          role,
          password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const responseData = await response.json();
      const token = responseData.token;
      const userData: User = responseData.user;
      setAuthToken(token);
      setUser(userData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";
      throw new Error(errorMessage);
    }
  };

  const login = async (identifier: string, password?: string) => {
    try {
      let response;
      if (password) {
        console.log(
          "AuthContext: Attempting email/password login for:",
          identifier
        );
        response = await fetch(`${baseUrl}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        });
      } else {
        console.log("AuthContext: Attempting phone login for:", identifier);
        response = await fetch(`${baseUrl}/users/login/phone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: identifier }),
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || errorData.message || "Login failed";
        throw new Error(errorMessage);
      }
      if (!password) {
        console.log("AuthContext: Phone login successful, OTP sent");
        return;
      }
      const data = await response.json();
      const token = data.token;
      const userData: User = data.user;
      console.log(
        "AuthContext: Email/password login successful, setting token:",
        token
      );
      setAuthToken(token);
      const storedToken = getAuthToken();
      console.log("AuthContext: Token after setAuthToken:", storedToken);
      setUser(userData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      console.error("AuthContext: Login error:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const forgotPassword = async (identifier: string) => {
    try {
      const response = await fetch(`${baseUrl}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to send password reset request"
        );
      }
      console.log("AuthContext: Password reset request sent for:", identifier);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send password reset request";
      console.error("AuthContext: Password reset error:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (
    identifier: string,
    otp: string,
    newPassword: string
  ) => {
    try {
      const response = await fetch(`${baseUrl}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }
      console.log("AuthContext: Password reset successfully for:", identifier);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";
      console.error("AuthContext: Password reset error:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const googleLogin = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      const response = await fetch(`${baseUrl}/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Google login failed");
      }

      const data = await response.json();
      const token = data.token;
      const userData: User = data.user;
      setAuthToken(token);
      setUser(userData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to login with Google";
      throw new Error(errorMessage);
    }
  };

  const googleSignup = async (
    credentialResponse: GoogleCredentialResponse,
    additionalData: Omit<SignupData, "email" | "fullName">
  ) => {
    try {
      const response = await fetch(`${baseUrl}/users/google-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          additionalData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Google signup failed");
      }

      const data = await response.json();
      const token = data.token;
      const userData: User = data.user;
      setAuthToken(token);
      setUser(userData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to signup with Google";
      throw new Error(errorMessage);
    }
  };

  const verifyOTP = async (
    phoneNumber: string,
    otp: string,
    source: "login" | "signup"
  ) => {
    try {
      const endpoint =
        source === "login"
          ? `${baseUrl}/users/login/phone`
          : `${baseUrl}/users/verify-otp`;
      console.log("AuthContext: Verifying OTP for:", phoneNumber);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp, source }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid OTP");
      }
      const data = await response.json();
      const token = data.token;
      console.log("AuthContext: OTP verified, setting token:", token);
      setAuthToken(token);
      const storedToken = getAuthToken();
      console.log(
        "AuthContext: Token after setAuthToken (verifyOTP):",
        storedToken
      );
      await validateToken(token);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP verification failed";
      console.error("AuthContext: OTP verification error:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resendOTP = async (phoneNumber: string, source: "login" | "signup") => {
    try {
      if (source === "login") {
        const response = await fetch(`${baseUrl}/users/login/phone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to resend OTP");
        }
      } else if (source === "signup") {
        const response = await fetch(`${baseUrl}/users/resend-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to resend OTP");
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend OTP";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    console.log("AuthContext: Logging out, removing token");
    removeAuthToken();
    setUser(null);
  };

  const edit = async (data: EditUserData) => {
    try {
      const token = getAuthToken();
      console.log("AuthContext: Editing user with token:", token);
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${baseUrl}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const updatedUser: User = await response.json();
      setUser(updatedUser);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      console.error("Error updating user:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    logout,
    edit,
    googleLogin,
    googleSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
