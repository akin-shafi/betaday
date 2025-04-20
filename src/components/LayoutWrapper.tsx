"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CartModal from "@/components/cart/CartModal";
import ModalContainer from "@/components/auth/modal-container"; // If needed
import InstallAppPrompt from "@/components/InstallAppPrompt"; // If needed
import { ToastContainer } from "react-toastify"; // If needed
import { useHeaderStore } from "@/stores/header-store";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isCartOpen, setCartOpen } = useHeaderStore();

  // Check if the current route is /store or /store/[id]
  const isStoreRoute = pathname === "/store" || pathname.startsWith("/store/");
  // ||
  // pathname.startsWith("/meal-planner");

  return (
    <>
      {isStoreRoute ? <HeaderStore /> : <Header />}
      {children}
      <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <ModalContainer />
      <InstallAppPrompt />
      <ToastContainer position="top-right" autoClose={1000} />
      {isStoreRoute ? <FooterStore /> : <Footer />}
    </>
  );
}
