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
import { User } from "@/types/user"; // Adjust the path as needed

interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  referralCode?: string;
  role?: string;
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
  login: (phoneNumber: string) => Promise<void>;
  verifyOTP: (
    phoneNumber: string,
    otp: string,
    source: "login" | "signup"
  ) => Promise<void>;
  resendOTP: (phoneNumber: string, source: "login" | "signup") => Promise<void>;
  logout: () => void;
  edit: (data: EditUserData) => Promise<void>; // Add edit function
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
        } catch (error) {
          console.error("Token decode/validation error:", error);
          removeAuthToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Invalid token");
      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Token validation error:", error);
      removeAuthToken();
      setUser(null);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const { fullName, email, phoneNumber, referralCode, role } = data;
      const response = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          referralCode,
          role,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }
    } catch (error) {
      throw new Error("Failed to create account");
    }
  };

  const login = async (phoneNumber: string) => {
    try {
      const response = await fetch(`${baseUrl}/users/login/phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }
    } catch (error) {
      throw error;
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
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid OTP");
      }
      const data = await response.json();
      const token = data.token;

      setAuthToken(token);
      await validateToken(token);
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const edit = async (data: EditUserData) => {
    try {
      const token = getAuthToken();
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
      setUser(updatedUser); // Update the user state in the context
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
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
    logout,
    edit, // Add edit to the context value
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