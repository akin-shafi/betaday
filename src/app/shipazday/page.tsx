"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ShipazDayPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fdf6e9]">
      {/* Arabian geometric pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0l30 30L60 60l30 30-30 30-30-30 30-30L30 30zM0 60l30-30L0 0v120l30-30zm120-30L90 0v120l30-30V30z' fill='%23c17f59' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Desert dunes decorative shapes */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-[#ff6600]/5 to-transparent transform -skew-y-6"></div>
      <div className="absolute top-40 right-0 w-full h-96 bg-gradient-to-b from-[#c17f59]/5 to-transparent transform -skew-y-6"></div>

      <div className="relative z-10">
        <Header />

        <main className="relative max-w-6xl mx-auto px-4 py-12 pt-32">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 relative">
              {/* Arabian border design */}
              <div className="absolute -inset-6 border-2 border-[#c17f59]/20 rounded-2xl -z-10">
                <div className="absolute inset-0 border-2 border-[#ff6600]/10 rounded-xl m-2"></div>
                {/* Corner ornaments */}
                <div className="absolute -top-3 -left-3 w-6 h-6 border-2 border-[#c17f59] rounded-full bg-[#fdf6e9]"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 border-2 border-[#c17f59] rounded-full bg-[#fdf6e9]"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 border-2 border-[#c17f59] rounded-full bg-[#fdf6e9]"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-2 border-[#c17f59] rounded-full bg-[#fdf6e9]"></div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-6xl font-bold mb-6 text-[#2d1810]"
              >
                ShipazDay
                <span className="block text-lg font-normal text-[#c17f59] mt-2">
                  سريع وموثوق
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#5c4437] mb-12 text-lg leading-relaxed"
              >
                Your trusted same-day delivery service. ShipazDay connects you
                with reliable couriers to ensure your packages reach their
                destination as swift as desert winds and as reliable as an
                oasis.
              </motion.p>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#c17f59]/20 hover:border-[#c17f59]/40 transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#c17f59] rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-[#ff6600] to-[#c17f59] p-4 rounded-xl">
                      <Image
                        src="/icons/speed.svg"
                        alt="Same Day Delivery"
                        width={32}
                        height={32}
                        className="text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2d1810] text-xl mb-1">
                      Same Day Delivery
                    </h3>
                    <p className="text-[#5c4437]">Swift as the desert winds</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#c17f59]/20 hover:border-[#c17f59]/40 transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#c17f59] rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-[#ff6600] to-[#c17f59] p-4 rounded-xl">
                      <Image
                        src="/icons/secure.svg"
                        alt="Secure Handling"
                        width={32}
                        height={32}
                        className="text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2d1810] text-xl mb-1">
                      Secure Package Handling
                    </h3>
                    <p className="text-[#5c4437]">
                      Protected like precious cargo
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#c17f59]/20 hover:border-[#c17f59]/40 transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#c17f59] rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-[#ff6600] to-[#c17f59] p-4 rounded-xl">
                      <Image
                        src="/icons/tracking.svg"
                        alt="Live Tracking"
                        width={32}
                        height={32}
                        className="text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2d1810] text-xl mb-1">
                      Live Package Tracking
                    </h3>
                    <p className="text-[#5c4437]">Navigate with precision</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Arabian frame design */}
                <div className="absolute -inset-6 bg-gradient-to-br from-[#ff6600]/10 to-[#c17f59]/10 rounded-2xl -z-10">
                  <div className="absolute inset-0 border-2 border-[#c17f59]/20 rounded-xl m-2"></div>
                  {/* Decorative corners */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#c17f59]/40 rounded-tr-xl"></div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#c17f59]/40 rounded-tl-xl"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#c17f59]/40 rounded-br-xl"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#c17f59]/40 rounded-bl-xl"></div>
                </div>

                <Image
                  src="/shipazday-hero.png"
                  alt="ShipazDay Service"
                  width={500}
                  height={500}
                  className="rounded-xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                />

                {/* Decorative elements */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-[#ff6600]/10 to-[#c17f59]/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-8 -top-8 w-24 h-24 bg-gradient-to-br from-[#c17f59]/10 to-transparent rounded-full blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
