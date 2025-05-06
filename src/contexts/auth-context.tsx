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
  login: (identifier: string, password?: string) => Promise<void>;
  verifyOTP: (
    phoneNumber: string,
    otp: string,
    source: "login" | "signup"
  ) => Promise<void>;
  resendOTP: (phoneNumber: string, source: "login" | "signup") => Promise<void>;
  logout: () => void;
  edit: (data: EditUserData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      console.log("AuthContext: Initial token:", token);
      if (token) {
        try {
          const decoded: { exp: number; id: string; role: string } =
            jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            console.log("AuthContext: Token expired, removing...");
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
      } else {
        console.log("AuthContext: No token found on initialization");
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const validateToken = async (token: string) => {
    try {
      console.log("AuthContext: Validating token:", token);
      const response = await fetch(`${baseUrl}/auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Invalid token");
      const userData: User = await response.json();
      console.log("AuthContext: User data fetched:", userData);
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
    } catch (error) {
      console.error("AuthContext: Login error:", error);
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
      console.log("AuthContext: Verifying OTP for:", phoneNumber);
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
      console.log("AuthContext: OTP verified, setting token:", token);
      setAuthToken(token);
      const storedToken = getAuthToken();
      console.log(
        "AuthContext: Token after setAuthToken (verifyOTP):",
        storedToken
      );
      await validateToken(token);
    } catch (error) {
      console.error("AuthContext: OTP verification error:", error);
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
    edit,
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
