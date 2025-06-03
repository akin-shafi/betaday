"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderStore from "@/components/HeaderStore";
// import FooterStore from "@/components/FooterStore";
import CartModal from "@/components/cart/CartModal";
import ModalContainer from "@/components/auth/modal-container";
import InstallAppPrompt from "@/components/InstallAppPrompt";
import { useHeaderStore } from "@/stores/header-store";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isCartOpen, setCartOpen } = useHeaderStore();

  const isStoreRoute = pathname === "/store" || pathname.startsWith("/store/") || pathname.startsWith("/orders");

  return (
    <>
      {isStoreRoute ? <HeaderStore /> : <Header />}
      {children}
      <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <ModalContainer />
      <InstallAppPrompt />
      {/* Removed ToastContainer */}
      {isStoreRoute ? "" : <Footer />}
    </>
  );
}
