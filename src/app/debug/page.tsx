/* eslint-disable react/no-unescaped-entities */
"use client";

import { AddressDebugPanel } from "@/components/debug/address-debug-panel";

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Address Extraction Debug</h1>
      <AddressDebugPanel />

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold mb-2">Instructions:</h2>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>
            Test different addresses like "Lekki Phase 1", "Victoria Island",
            "Ikeja GRA", etc.
          </li>
          <li>Click on suggestions to see all extracted data</li>
          <li>Check the console for detailed component breakdown</li>
          <li>
            Identify which field gives the most accurate local government area
          </li>
          <li>Let me know which field should be used as localGovernmentId</li>
        </ol>
      </div>
    </div>
  );
}
