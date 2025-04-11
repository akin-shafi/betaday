// components/FeaturesSection.tsx
import Link from "next/link";
import Image from "next/image";

export default function FooterStore() {
  return (
    <footer className="bg-[#1A2E20] border-t border-gray-200 mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <div className="p-3 rounded-lg">
              <Link href="/" className="flex items-center">
                <Image
                  src="/betaday-white.png"
                  alt="Palapolo Logo"
                  width={70}
                  height={70}
                  className="h-auto w-auto" // Ensure aspect ratio is preserved
                  priority // Optional: Preload important images
                />
              </Link>
            </div>
          </div>

          <div className="flex gap-6 text-gray-100">
            <Link href="#" className="hover:text-[#f15736]">
              About
            </Link>
            <Link href="#" className="hover:text-[#f15736]">
              Contact
            </Link>
            <Link href="#" className="hover:text-[#f15736]">
              Terms & Conditions
            </Link>
            <Link href="#" className="hover:text-[#f15736]">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-200 text-sm">
          <div className="flex gap-4 mb-4 md:mb-0">
            <Link href="#" className="flex items-center hover:text-[#f15736]">
              WhatsApp
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </Link>
            <Link href="#" className="flex items-center hover:text-[#f15736]">
              Instagram
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </Link>
          </div>

          <p>©2025 BetaDay by Palapolo. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
