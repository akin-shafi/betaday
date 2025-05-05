import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import GoogleMapsScript from "@/components/GoogleMapsScript";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper"; // Import the new wrapper
import AntdRegistry from "@/components/AntdRegistry"; // Add this
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "antd/dist/reset.css"; // Add Ant Design CSS
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title:
    "Order Quality Nigerian Food Online | Beans, Dodo, Semo, Fura Delivery | BetaDay",
  description:
    "Enjoy real Naija flavors delivered fast! Order from local chefs & restaurants offering fresh Amala, Eba, Pounded Yam, Jollof Rice, Dodo, Suya, and more. Same-day delivery of home-style Nigerian meals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A2E20" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BetaDay" />
        <link rel="icon" type="image/svg+xml" href="/icons/betaday-icon.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/512x512.png" />
      </head>
      <body
        className={`${dmSans.variable} antialiased bg-white`}
        suppressHydrationWarning
      >
        <AntdRegistry>
          <GoogleMapsScript />
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
