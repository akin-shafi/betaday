"use client";

import { useState } from "react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does BetaDay delivery work?",
    answer:
      "BetaDay connects you with local restaurants and businesses. Simply browse through our platform, select your items, and place your order. Our delivery partners will pick up your order and deliver it to your specified location.",
  },
  {
    question: "What are the delivery hours?",
    answer:
      "Our delivery hours vary by location and restaurant. Most restaurants are available from 10 AM to 10 PM, but specific hours can be found on each restaurant's page.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is confirmed, you can track it in real-time through our app or website. You'll receive updates at each stage of the delivery process.",
  },
  {
    question: "What is the delivery fee?",
    answer:
      "Delivery fees vary based on your location and the restaurant you order from. The exact fee will be shown before you confirm your order.",
  },
  {
    question: "How can I become a delivery partner?",
    answer:
      "To become a delivery partner, visit our 'Become a Rider' page and fill out the application form. We'll review your application and contact you with next steps.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including credit/debit cards, mobile wallets, and cash on delivery in select locations.",
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-white to-orange-50">
      {/* <Header /> */}
      <main className="max-w-3xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <div className="inline-block p-2 px-6 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full mb-4 shadow-inner">
            <h1 className="bg-gradient-to-r from-[#ff6600] to-orange-600 inline-block text-transparent bg-clip-text text-4xl font-bold">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-gray-600">
            Find answers to common questions about BetaDay&apos;s services.
          </p>
        </div>

        <div className="space-y-4 relative">
          {/* Decorative elements */}
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-orange-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-30"></div>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-orange-100/50 hover:border-orange-200/50 transition-all duration-300"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-orange-50/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-800 pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#ff6600]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#ff6600]" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-5 bg-gradient-to-b from-orange-50/30 to-transparent">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-200/50 to-transparent"></div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center relative">
          <div className="inline-block">
            <p className="text-gray-600 mb-2">Still have questions?</p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ff6600] to-[#ff8533] text-white rounded-full hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 group"
            >
              Contact our support team
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
