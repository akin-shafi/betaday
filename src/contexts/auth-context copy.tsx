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

interface User {
  id: string;
  name?: string;
  email?: string;
  phoneNumber: string;
  role?: string;
}

interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  referralCode?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // src/contexts/auth-context.tsx
  const validateToken = async (token: string) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Invalid token");
      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Token validation error:", error);
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const { fullName, email, phoneNumber, referralCode } = data;
      const name = `${fullName}`;
      const response = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phoneNumber, referralCode }),
      });
      if (!response.ok) throw new Error("Signup failed");
      // Handle signup success (e.g., auto-login or redirect)
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
      throw error; // Propagates to LoginModal for toast display
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      const response = await fetch(`${baseUrl}/users/login/phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid OTP");
      }
      const data = await response.json();
      setAuthToken(data.token); // Store the JWT
      setUser({
        id: data.user.id,
        phoneNumber: data.user.phoneNumber,
        name: data.user.name, // Optional, if returned by backend
        email: data.user.email, // Optional
      });
    } catch (error) {
      throw error; // Propagates to OTPModal for toast display
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    verifyOTP,
    logout,
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
