// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1A2E20] py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-white text-sm mb-4">
            One cannot <strong>think well, love well, sleep well,</strong> if
            one has not dined well.
          </p>

          <div className="flex justify-center mb-6">
            <Image
              src="/betaday-white.png" // Removed query params for clarity
              alt="Palapolo Logo"
              width={90}
              height={90}
              className="mr-2 h-auto w-auto" // Ensure aspect ratio is preserved
              priority // Optional: Preload important images
            />
          </div>

          <div className="flex justify-center space-x-4">
            <Link href="#" className="text-white text-sm">
              WhatsApp
            </Link>
            <Link href="#" className="text-white text-sm">
              Instagram
            </Link>
          </div>
        </div>

        <div className="border-t border-[#1A2E20] pt-4">
          <p className="text-white text-xs text-center">
            ©2025 BetaDay by Palapolo. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
