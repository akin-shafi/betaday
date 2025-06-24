import Link from "next/link";
import { ExternalLink, Clock, MapPin, Utensils, Truck } from "lucide-react";

export default function FooterStore() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A2E20] border-t border-gray-200 mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Section with Logo and Links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <div className="p-3 rounded-lg">
              <Link href="/" className="flex items-center">
                <div className="text-2xl font-bold text-white">BetaDay</div>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-gray-100 justify-center">
            <Link
              href="/know-us"
              className="hover:text-[#f15736] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact-us"
              className="hover:text-[#f15736] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#f15736] transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#f15736] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/delivery-areas"
              className="hover:text-[#f15736] transition-colors"
            >
              Delivery Areas
            </Link>
            <Link
              href="/faq"
              className="hover:text-[#f15736] transition-colors"
            >
              FAQs
            </Link>
          </div>
        </div>

        {/* Middle Section with Food Delivery-specific Links */}
        <div className="border-t border-gray-800 py-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-300 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <Utensils className="w-4 h-4 mr-2" />
                Food Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/restaurants/local"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Local Cuisine
                  </Link>
                </li>
                <li>
                  <Link
                    href="/restaurants/fast-food"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Fast Food
                  </Link>
                </li>
                <li>
                  <Link
                    href="/restaurants/healthy"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Healthy Options
                  </Link>
                </li>
                <li>
                  <Link
                    href="/restaurants/desserts"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Desserts & Drinks
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Order Info
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/track-order"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link
                    href="/delivery-times"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Delivery Times
                  </Link>
                </li>
                <li>
                  <Link
                    href="/order-history"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Order History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cancellation"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Cancellation Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Locations
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/locations/lagos"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Lagos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations/abuja"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Abuja
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations/port-harcourt"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Port Harcourt
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations/all"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    All Locations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Partners
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/vendor"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rider"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Become a Delivery Rider
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partner-login"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Partner Login
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/partner-support"
                    className="hover:text-[#f15736] transition-colors"
                  >
                    Partner Support
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-800 py-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-[#2a4a34] p-4 rounded-lg">
              <div className="text-white text-xl mb-2">30-45</div>
              <div className="text-gray-300 text-sm">Minute Delivery</div>
            </div>
            <div className="bg-[#2a4a34] p-4 rounded-lg">
              <div className="text-white text-xl mb-2">100+</div>
              <div className="text-gray-300 text-sm">Restaurant Partners</div>
            </div>
            <div className="bg-[#2a4a34] p-4 rounded-lg">
              <div className="text-white text-xl mb-2">₦0</div>
              <div className="text-gray-300 text-sm">
                Delivery Fee on First Order
              </div>
            </div>
            <div className="bg-[#2a4a34] p-4 rounded-lg">
              <div className="text-white text-xl mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Customer Support</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 py-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-white mb-2">We Accept</h3>
              <div className="flex gap-3">
                {/* Payment Icons */}
                <div className="bg-white p-1 rounded w-10 h-6 flex items-center justify-center">
                  <div className="text-[10px] font-bold text-blue-800">
                    VISA
                  </div>
                </div>
                <div className="bg-white p-1 rounded w-10 h-6 flex items-center justify-center">
                  <div className="text-[10px] font-bold text-red-600">MC</div>
                </div>
                <div className="bg-white p-1 rounded w-10 h-6 flex items-center justify-center">
                  <div className="text-[10px] font-bold text-green-600">
                    PAY
                  </div>
                </div>
                <div className="bg-white p-1 rounded w-10 h-6 flex items-center justify-center">
                  <div className="text-[10px] font-bold text-purple-600">
                    USSD
                  </div>
                </div>
                <div className="bg-white p-1 rounded w-10 h-6 flex items-center justify-center">
                  <div className="text-[10px] font-bold text-orange-600">
                    CASH
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">
                Download Our App
              </h3>
              <div className="flex gap-3">
                <Link
                  href="https://apps.apple.com"
                  className="bg-black text-white px-3 py-1 rounded text-xs flex items-center hover:bg-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  App Store
                </Link>
                <Link
                  href="https://play.google.com"
                  className="bg-black text-white px-3 py-1 rounded text-xs flex items-center hover:bg-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Play
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section with Social and Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-200 text-sm">
            <div className="flex gap-4 mb-4 md:mb-0">
              <Link
                href="https://wa.me/1234567890"
                className="flex items-center hover:text-[#f15736] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <Link
                href="https://instagram.com"
                className="flex items-center hover:text-[#f15736] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <Link
                href="https://twitter.com"
                className="flex items-center hover:text-[#f15736] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <Link
                href="https://facebook.com"
                className="flex items-center hover:text-[#f15736] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <p>©{currentYear} BetaDay by Palapolo. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
