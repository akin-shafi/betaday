// components/Header.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  Info,
  HelpCircle,
  Phone,
  Utensils,
  Package,
  Truck,
} from "lucide-react";
import { CartIcon } from "./icons";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const mobileMenuItems = [
    {
      name: "Products",
      icon: <Package size={24} className="text-purple-500" />,
      dropdown: ["BetaPackage", "ShipazDay"],
      href: "/products",
    },
    {
      name: "Know Us",
      icon: <Info size={24} className="text-blue-500" />,
      href: "/know-us",
    },
    {
      name: "FAQs",
      icon: <HelpCircle size={24} className="text-green-500" />,
      href: "/faqs",
    },
    {
      name: "Contact",
      icon: <Phone size={24} className="text-yellow-500" />,
      href: "/contact-us",
    },
    {
      name: "Meal Planner",
      icon: <Phone size={24} className="text-yellow-500" />,
      href: "/meal-planner",
    },

    {
      name: "Become a vendor",
      icon: <Utensils size={24} className="text-pink-500" />,
      href: "/become-a-vendor",
    },
    {
      name: "Become a Rider",
      icon: <Truck size={24} className="text-orange-500" />,
      href: "/become-a-rider",
    },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 bg-transparent px-4 sm:px-6 md:px-12 flex items-center justify-between">
      {/* Logo with dark background */}
      <div className="bg-[#1A2E20] hover:bg-[#1A2E20] cursor-pointer p-3 rounded-full">
        <Link href="/" className="flex items-center">
          <Image
            src="/icons/betaday-white.svg"
            alt="BetaDay Logo"
            width={100}
            height={100}
            className="object-contain rounded"
            quality={100}
            priority
            placeholder="blur"
            blurDataURL="/icons/betaday-white.svg" // Low-resolution image path
          />
        </Link>
      </div>

      {/* Navigation menu with white background */}
      <nav className="hidden md:flex bg-[#FFFFFF] rounded-full px-6 py-4 shadow-sm flex items-center gap-6">
        {/* Products Dropdown */}
        <div className="relative group">
          <button className="text-[#1A2E20] hover:text-[#f15736]  text-sm font-medium transition-colors flex items-center gap-1">
            Products
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {/* <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all delay-100"></div> */}
          <div className="absolute top-full left-0 mt-5 w-40 bg-white shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all delay-100">
            <Link
              href="/betapackage"
              className="block px-4 py-2 text-sm text-[#1A2E20] hover:bg-[#fff2f1] hover:text-[#f15736] "
            >
              BetaPackage
            </Link>
            <Link
              href="/shipazday"
              className="block px-4 py-2 text-sm text-[#1A2E20] hover:bg-[#fff2f1] hover:text-[#f15736] "
            >
              ShipazDay
            </Link>
          </div>
        </div>

        {[
          { name: "Know Us", href: "/know-us" },
          { name: "FAQs", href: "/faqs" },
          { name: "Contact Us", href: "/contact-us" },
          { name: "Meal Planner", href: "/meal-planner" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-[#1A2E20] hover:text-[#f15736]  text-sm font-medium transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-4 ">
        {/* Partners Dropdown */}
        <div className="relative group">
          <button className="bg-[#FFFFFF] shadow-sm text-[#1A2E20] hover:text-[#f15736] px-4 py-4 text-sm font-medium rounded-full flex items-center gap-1 transition-colors">
            Partners
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-40 bg-[#FFFFFF] shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all delay-100">
            <Link
              href="/become-a-vendor"
              className="block px-4 py-2 text-sm text-[#1A2E20] hover:bg-[#fff2f1] hover:text-[#f15736]"
            >
              Become a vendor
            </Link>
            <Link
              href="/become-a-rider"
              className="block px-4 py-2 text-sm text-[#1A2E20] hover:bg-[#fff2f1] hover:text-[#f15736]"
            >
              Become a Rider
            </Link>
          </div>
        </div>

        {/* Cart Icon */}
        <Link
          href="/store"
          className="bg-[#FFFFFF] shadow-sm p-3 rounded-full text-[#1A2E20] hover:text-[#f15736]"
        >
          <CartIcon className="h-5 w-5" />
        </Link>
      </div>

      {/* Mobile Controls (Hidden on Desktop) */}
      <div className="flex items-center gap-4 md:hidden">
        <Link
          href="/store"
          className="bg-white hover:bg-[#1A2E20] hover:text-white p-2 rounded-full text-[#1A2E20]"
        >
          <ShoppingCart size={24} />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white p-2 rounded-full text-[#1A2E20]"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/95 z-50 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full"
        >
          <X size={32} />
        </button>

        {/* Menu content */}
        <div className="h-full flex flex-col pt-20 px-6">
          <nav className="space-y-6">
            {mobileMenuItems.map((item) => (
              <div key={item.name} className="border-b border-white/10">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4 flex-1">
                    {item.icon}
                    {item.dropdown ? (
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.name ? null : item.name
                          )
                        }
                        className="text-white text-xl font-medium flex items-center gap-2 w-full"
                      >
                        {item.name}
                        <ChevronDown
                          className={`ml-auto transform transition-transform ${
                            openDropdown === item.name ? "rotate-180" : ""
                          }`}
                          size={24}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-white text-xl font-medium w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                </div>

                {item.dropdown && openDropdown === item.name && (
                  <div className="ml-12 mb-4 space-y-4">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem}
                        href={`/${subItem.toLowerCase()}`}
                        className="block text-white/80 text-xl font-medium hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
