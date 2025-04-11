"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function BetaPackagePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* African pattern background */}
      <div className="absolute inset-0 bg-[#fff9f5] -z-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6600' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Decorative curved shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ff6600]/10 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ff6600]/5 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="relative max-w-6xl mx-auto px-4 py-12 pt-32">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 relative">
              {/* African pattern border */}
              <div
                className="absolute -inset-4 bg-gradient-to-r from-[#ff6600]/20 to-[#ff8533]/20 rounded-2xl -z-10 
                before:absolute before:inset-0 before:bg-[url('/patterns/adinkra.svg')] before:opacity-10 before:bg-repeat"
              ></div>

              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#ff6600] to-[#ff8533] bg-clip-text text-transparent">
                BetaPackage
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Experience the convenience of food delivery with BetaPackage.
                Order from your favorite restaurants and enjoy quick, reliable
                delivery right to your doorstep.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100/50 transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-[#ff6600] to-[#ff8533] p-3 rounded-lg">
                    <Image
                      src="/icons/delivery.svg"
                      alt="Fast Delivery"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Fast & Reliable Delivery
                    </h3>
                    <p className="text-sm text-gray-600">
                      Swift delivery to your location
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100/50 transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-[#ff6600] to-[#ff8533] p-3 rounded-lg">
                    <Image
                      src="/icons/restaurant.svg"
                      alt="Restaurant Selection"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Wide Restaurant Selection
                    </h3>
                    <p className="text-sm text-gray-600">
                      Local and continental cuisine
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100/50 transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-[#ff6600] to-[#ff8533] p-3 rounded-lg">
                    <Image
                      src="/icons/tracking.svg"
                      alt="Real-time Tracking"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Real-time Order Tracking
                    </h3>
                    <p className="text-sm text-gray-600">
                      Monitor your delivery progress
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Image container with decorative elements */}
              <div className="relative">
                {/* African pattern frame */}
                <div
                  className="absolute -inset-4 bg-gradient-to-br from-[#ff6600]/10 to-[#ff8533]/10 rounded-2xl -z-10 
                  before:absolute before:inset-0 before:bg-[url('/patterns/adinkra.svg')] before:opacity-10 before:bg-repeat"
                ></div>

                <Image
                  src="/betapackage-hero.png"
                  alt="BetaPackage Service"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500"
                />

                {/* Decorative dots */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#ff6600]/10 rounded-full"></div>
                <div className="absolute -left-4 -top-4 w-16 h-16 bg-[#ff8533]/10 rounded-full"></div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
