"use client";

import type { ReactNode } from "react";
import { AddressProvider } from "@/contexts/address-context";
import { CartProvider } from "@/contexts/cart-context";
import { ShoppingListProvider } from "@/contexts/shopping-list-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ModalProvider } from "@/contexts/modal-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd"; // Import Ant Design's ConfigProvider
import { ToastContainer } from "react-toastify"; // Already in your original setup

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
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            // Customize Ant Design's theme tokens
            colorPrimary: "#1A2E20", // Match your app's theme color (from layout.tsx)
            fontFamily: "var(--font-dm-sans), sans-serif", // Use DM Sans for Ant Design components
            borderRadius: 8, // Slightly rounded corners
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
  );
}
