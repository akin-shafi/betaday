"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import {
  getSession,
  setSession,
  clearSession,
  updateSessionUser,
  getSessionToken,
  updateLastActivity,
  shouldRefreshSession,
  getAuthToken, // For backward compatibility
  type User,
} from "@/utils/session";
import type { GoogleCredentialResponse } from "@react-oauth/google";

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
  login: (
    identifier: string,
    password?: string,
    rememberMe?: boolean
  ) => Promise<void>;
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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout duration (4 hours)
const SESSION_TIMEOUT = 4 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";

  const handleSessionTimeout = useCallback(() => {
    clearSession();
    setUser(null);
    // You can add a redirect or notification here
    console.log("Session expired. Please login again.");
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getSessionToken();
      if (!token) throw new Error("No auth token found");

      const existingSession = getSession();
      const rememberMe = existingSession?.rememberMe || false;

      const response = await fetch(`${baseUrl}/auth/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to refresh user data`);
      }

      const userData: User = await response.json();

      setUser(userData);
      setSession({
        user: userData,
        token,
        rememberMe,
      });
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [logout, baseUrl]);

  // Session timeout management with auto-refresh
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let refreshCheckId: NodeJS.Timeout | null = null;

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleSessionTimeout, SESSION_TIMEOUT);
    };

    const checkAndRefreshSession = async () => {
      if (user && shouldRefreshSession()) {
        try {
          await refreshUser();
          console.log("Session refreshed automatically");
        } catch (error) {
          console.error("Failed to auto-refresh session:", error);
        }
      }
    };

    const handleActivity = () => {
      if (user) {
        updateLastActivity();
        resetTimeout();
      }
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    if (user && isInitialized) {
      events.forEach((event) =>
        document.addEventListener(event, handleActivity, { passive: true })
      );
      resetTimeout();

      // Check for session refresh every hour
      refreshCheckId = setInterval(checkAndRefreshSession, 60 * 60 * 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (refreshCheckId) clearInterval(refreshCheckId);
      events.forEach((event) =>
        document.removeEventListener(event, handleActivity)
      );
    };
  }, [user, handleSessionTimeout, isInitialized, refreshUser]);

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // First try the new session system
        const session = getSession();
        if (session?.user && session?.token) {
          await validateToken(session.token);
        } else {
          // Fallback to old token system for backward compatibility
          const oldToken = getAuthToken();
          if (oldToken) {
            await validateToken(oldToken);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/auth/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or expired token");
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to validate token`);
      }

      const userData: User = await response.json();
      if (!userData?.id) {
        throw new Error("Invalid user data received");
      }

      // Create or update session
      const existingSession = getSession();
      const rememberMe = existingSession?.rememberMe || false;

      setSession({
        user: userData,
        token,
        rememberMe,
      });
      setUser(userData);
    } catch (error) {
      console.error("Token validation error:", error);
      clearSession();
      setUser(null);
      throw error;
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

      setSession({
        user: userData,
        token,
        rememberMe: false,
      });
      setUser(userData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";
      throw new Error(errorMessage);
    }
  };

  const login = async (
    identifier: string,
    password?: string,
    rememberMe = false
  ) => {
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

      setSession({
        user: userData,
        token,
        rememberMe,
      });
      setUser(userData);
      updateLastActivity();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      console.error("AuthContext: Login error:", errorMessage);
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
      const userData: User = data.user;

      setSession({
        user: userData,
        token,
        rememberMe: false,
      });
      setUser(userData);
      updateLastActivity();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP verification failed";
      console.error("AuthContext: OTP verification error:", errorMessage);
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

      setSession({
        user: userData,
        token,
        rememberMe: false,
      });
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

      setSession({
        user: userData,
        token,
        rememberMe: false,
      });
      setUser(userData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to signup with Google";
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

  const edit = async (data: EditUserData) => {
    try {
      const token = getSessionToken();
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
      updateSessionUser(updatedUser);
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
    refreshUser,
  };

  // Don't render children until context is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
