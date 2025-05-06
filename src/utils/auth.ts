// @/utils/auth.ts
const TOKEN_KEY = "auth_token";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    console.log("getAuthToken: No window object (server-side), returning null");
    return null;
  }

  let token: string | null = null;
  try {
    token = localStorage.getItem(TOKEN_KEY);
    console.log("getAuthToken: Retrieved token from localStorage:", token);
    if (token) return token;
  } catch (error) {
    console.error("getAuthToken: Failed to get token from localStorage:", error);
  }

  // Fallback to sessionStorage if localStorage fails
  try {
    token = sessionStorage.getItem(TOKEN_KEY);
    console.log("getAuthToken: Retrieved token from sessionStorage:", token);
    if (token) return token;
  } catch (error) {
    console.error("getAuthToken: Failed to get token from sessionStorage:", error);
  }

  console.log("getAuthToken: No token found in any storage");
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") {
    console.log("setAuthToken: No window object (server-side), skipping storage");
    return;
  }

  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("setAuthToken: Token stored in localStorage:", token);
  } catch (error) {
    console.error("setAuthToken: Failed to store token in localStorage:", error);
    // Fallback to sessionStorage if localStorage fails
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
      console.log("setAuthToken: Token stored in sessionStorage:", token);
    } catch (error) {
      console.error("setAuthToken: Failed to store token in sessionStorage:", error);
      console.warn("setAuthToken: No storage available, token not saved:", token);
    }
  }
};

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") {
    console.log("removeAuthToken: No window object (server-side), skipping removal");
    return;
  }

  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log("removeAuthToken: Token removed from localStorage");
  } catch (error) {
    console.error("removeAuthToken: Failed to remove token from localStorage:", error);
  }

  try {
    sessionStorage.removeItem(TOKEN_KEY);
    console.log("removeAuthToken: Token removed from sessionStorage");
  } catch (error) {
    console.error("removeAuthToken: Failed to remove token from sessionStorage:", error);
  }
};