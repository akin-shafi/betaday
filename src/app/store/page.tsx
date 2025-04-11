"use client";

// import HeaderStore from "@/components/HeaderStore";
// import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore-v2";
import FeaturedStore from "@/components/FeaturedStore";
import RecomendationSection from "@/components/RecomendationSection";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { useState } from "react";

export default function Store() {
  const [activeBusinessType] = useState<string>("Restaurants"); // Default business type
  const [selectedSubCategory] = useState<string | null>(null);

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fff5f2] to-white"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(241,87,54,0.03)_0%,rgba(255,255,255,0)_100%)]"></div>

        <div className="relative">
          {/* <HeaderStore /> */}
          <main className="max-w-6xl mx-auto px-4 pt-1 pb-8">
            <Suspense fallback={<div>Loading categories...</div>}>
              <CategoriesInStore />
            </Suspense>

            <Suspense fallback={<div>Loading recommendations...</div>}>
              <RecomendationSection
                activeBusinessType={activeBusinessType}
                selectedSubCategory={selectedSubCategory}
              />
            </Suspense>

            <Suspense fallback={<div>Loading featured stores...</div>}>
              <FeaturedStore
                activeBusinessType={activeBusinessType}
                selectedSubCategory={selectedSubCategory}
              />
            </Suspense>
          </main>
          {/* <FooterStore /> */}
        </div>
      </div>
    </ErrorBoundary>
  );
}
