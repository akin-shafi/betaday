/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client";

import Script from "next/script";

export default function GoogleMapsScript() {
  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
      strategy="beforeInteractive" // Ensures script loads before page interactivity
      onError={(e) => {
        console.error("Google Maps API failed to load:", e);
      }}
    />
  );
}
