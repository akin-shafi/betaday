"use client";
import { Suspense } from "react";
import FAQContent from "./faq-content";

function FAQLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-white">
      <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Loading...</p>
        </div>

        {/* Loading skeleton */}
        <div className="mb-12">
          <div className="flex gap-3 pb-4 justify-center flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full bg-gray-200 animate-pulse h-10 w-24"
              ></div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:border-r border-gray-200 pr-4">
              <h2 className="text-3xl font-bold mb-8 text-orange-900">FAQs.</h2>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="mb-4 border-b border-gray-100 pb-4">
                  <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8 text-orange-900">Ans.</h2>
              <div className="bg-gray-200 animate-pulse h-48 rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FAQPage() {
  return (
    <Suspense fallback={<FAQLoading />}>
      <FAQContent />
    </Suspense>
  );
}
