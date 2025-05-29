import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A2E20] text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo Column */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <div className="text-2xl font-bold text-white">BetaDay</div>
            </Link>
            <div className="flex space-x-4 mt-4">
              <Link
                href="https://twitter.com"
                className="text-white hover:text-[#f15736] transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-white hover:text-[#f15736] transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://facebook.com"
                className="text-white hover:text-[#f15736] transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-white hover:text-[#f15736] transition-colors"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              {[
                { name: "About", href: "/know-us" },
                { name: "Vendors", href: "/partner" },
                { name: "Riders", href: "/become-a-rider" },
                { name: "Careers", href: "/careers" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "/contact-us" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations Column */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Locations
            </h3>
            <ul className="space-y-2">
              {[
                "Lagos Island",
                "Lagos Mainland",
                "Ikeja",
                "Lekki",
                "Surulere",
                "Yaba",
              ].map((location) => (
                <li key={location}>
                  <Link
                    href={`/locations/${location
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {location}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/locations"
                  className="text-[#f15736] hover:text-white transition-colors"
                >
                  See more
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Legal Column */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Help & Legal
            </h3>
            <ul className="space-y-2">
              {[
                { name: "FAQs", href: "/faqs" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Use", href: "/terms" },
                { name: "Google Play Store", href: "https://play.google.com" },
                { name: "iOS App Store", href: "https://apps.apple.com" },
                { name: "Email Support", href: "mailto:support@betaday.com" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                    target={
                      link.href.startsWith("http") ||
                      link.href.startsWith("mailto")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-6">
          <p className="text-sm text-gray-400">
            © {currentYear} BetaDay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
