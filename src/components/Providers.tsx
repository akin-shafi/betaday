"use client";

import type { ReactNode } from "react";
import { AddressProvider } from "@/contexts/address-context";
import { CartProvider } from "@/contexts/cart-context";
import { ShoppingListProvider } from "@/contexts/shopping-list-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ModalProvider } from "@/contexts/modal-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default stale time
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection time
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined in environment variables"
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1A2E20",
              fontFamily: "var(--font-dm-sans), sans-serif",
              borderRadius: 8,
            },
          }}
        >
          <AuthProvider>
            <ModalProvider>
              <AddressProvider>
                <ShoppingListProvider>
                  <CartProvider>
                    {children}
                    <ToastContainer />
                  </CartProvider>
                </ShoppingListProvider>
              </AddressProvider>
            </ModalProvider>
          </AuthProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
