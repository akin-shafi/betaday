import React from "react";
import { GooglePlayIcon, AppStoreIcon, WhatsAppIcon } from "./icons";
import Link from "next/link";
export default function OrderDirectly() {
  return (
    <div className="mt-8 space-y-4 max-w-md mx-auto md:mx-0 animate-fadeInUp">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* <Link
                href="/store"
                className="bg-[#f15736] hover:bg-[#d8432c] text-white rounded-lg px-6 py-4 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
              > */}
        <Link
          href="/store"
          className="bg-[#210603] hover:bg-[#3a0d07] text-white rounded-lg px-6 py-4 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
        >
          <span className="font-semibold">ORDER NOW</span>
          <span className="hidden sm:inline">→</span>
        </Link>

        <a
          href="https://wa.me/+1234567890?text=Hi%2C%20I'd%20like%20to%20place%20an%20order"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1da851] text-white rounded-lg px-6 py-4 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="font-semibold">Chat to Order</span>
        </a>
      </div>

      <div className="hidden flex flex-col sm:flex-row gap-2">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://play.google.com/store/apps/details?id=com.palapolo.com"
          className="bg-[#210603] hover:bg-[#3a0d07] text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm flex-1"
        >
          <GooglePlayIcon className="h-5 w-5" />
          <span className="flex flex-col items-start">
            <span className="text-[10px]">Get it on</span>
            <span>Google Play</span>
          </span>
        </a>

        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://apps.apple.com/us/app/palapolo/id1530676379"
          className="bg-[#210603] hover:bg-[#3a0d07] text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm flex-1"
        >
          <AppStoreIcon className="h-5 w-5" />
          <span className="flex flex-col items-start">
            <span className="text-[10px]">Download on</span>
            <span>App Store</span>
          </span>
        </a>
      </div>
    </div>
  );
}
