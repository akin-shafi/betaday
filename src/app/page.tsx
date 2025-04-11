"use client";
// app/page.tsx
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DealsSection from "@/components/DealsSection";
import CategoriesSection from "@/components/CategoriesSection";
// import CategoriesInStore from "@/components/CategoriesInStore";
import FeaturesSection from "@/components/FeaturesSection";
// import AppShowCaseSection from "@/components/AppShowCaseSection";
// import CTASection from "@/components/CTASection";
// import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeroSection />
      <CategoriesSection />
      {/* <CategoriesInStore /> */}
      <DealsSection />
      <FeaturesSection />
      {/* <AppShowCaseSection /> */}
      {/* <CTASection /> */}
      {/* <Ticker /> */}
      <Footer />
    </div>
  );
}
