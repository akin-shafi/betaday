"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqCategories, getFAQsByCategory, getFAQById } from "@/lib/faq-data";

export default function FAQPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFaq, setActiveFaq] = useState("01");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Initialize category and FAQ from URL parameters on page load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const faqParam = searchParams.get("faq");

    // Set category if valid
    if (
      categoryParam &&
      faqCategories.some((cat) => cat.id === categoryParam)
    ) {
      setActiveCategory(categoryParam);
    }

    // Set FAQ if valid
    if (faqParam && getFAQById(faqParam)) {
      setActiveFaq(faqParam);
      setExpandedFaq(faqParam); // Also expand it on mobile
    }
  }, [searchParams]);

  // Update URL when category changes
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setExpandedFaq(null); // Reset expanded FAQ when changing categories

    // Update URL with query parameter
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }

    // Remove FAQ parameter when changing categories
    params.delete("faq");

    const newUrl = params.toString() ? `?${params.toString()}` : "/faq";
    router.push(newUrl, { scroll: false });
  };

  // Update URL when FAQ changes
  const updateFaqInUrl = (faqId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Always set the FAQ parameter
    params.set("faq", faqId);

    // Ensure category is set if not "all"
    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }

    const newUrl = `?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const filteredFaqs = getFAQsByCategory(activeCategory);

  // Only reset to first FAQ when category changes AND we don't have a valid FAQ in the new category
  useEffect(() => {
    if (filteredFaqs.length > 0) {
      // Check if current activeFaq exists in the filtered FAQs
      const currentFaqExists = filteredFaqs.some((faq) => faq.id === activeFaq);

      // Only reset if the current FAQ doesn't exist in the new category AND no FAQ param in URL
      if (!currentFaqExists && !searchParams.get("faq")) {
        setActiveFaq(filteredFaqs[0].id);
      }
    }
  }, [filteredFaqs]);

  const currentFaq = getFAQById(activeFaq);

  // Handle FAQ selection for desktop
  const handleFaqSelect = (faqId: string) => {
    setActiveFaq(faqId);
    updateFaqInUrl(faqId);
  };

  // Handle FAQ toggle for mobile accordion
  const handleFaqToggle = (faqId: string) => {
    const newExpandedState = expandedFaq === faqId ? null : faqId;
    setExpandedFaq(newExpandedState);

    // If expanding, also set as active and update URL
    if (newExpandedState) {
      setActiveFaq(faqId);
      updateFaqInUrl(faqId);
    } else {
      // If collapsing, remove FAQ from URL but keep category
      const params = new URLSearchParams(searchParams.toString());
      params.delete("faq");
      const newUrl = params.toString() ? `?${params.toString()}` : "/faq";
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-white">
      <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {`Find answers to common questions about BetaDay's delivery services, account management, and more.`}
          </p>
        </div>

        {/* Category Filter with Regular Tabs */}
        <div className="mb-12 overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 pb-4 justify-center flex-wrap">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-orange-600 text-white scale-105"
                    : "bg-orange-100 text-orange-800 hover:scale-105 hover:bg-orange-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="mb-16 hidden md:block">
          <div className="border border-gray-200 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:border-r border-gray-200 pr-4">
                <h2 className="text-3xl font-bold mb-8 text-orange-900">
                  FAQs.
                </h2>

                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className={`mb-4 border-b border-gray-100 pb-4 cursor-pointer transition-colors ${
                        activeFaq === faq.id ? "border-orange-300" : ""
                      }`}
                      onClick={() => handleFaqSelect(faq.id)}
                    >
                      <div className="flex items-center gap-2">
                        {activeFaq === faq.id && (
                          <span className="text-yellow-500 text-lg">★</span>
                        )}
                        <h3
                          className={`font-medium ${
                            activeFaq === faq.id
                              ? "text-orange-800"
                              : "text-gray-700"
                          }`}
                        >
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No questions found in this category.
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8 text-orange-900">
                  Ans.
                </h2>

                {filteredFaqs.length > 0 && currentFaq ? (
                  <div className="bg-[#1A2E20] p-6 rounded-lg sticky top-32">
                    <div className="text-yellow-400 text-2xl mb-4">★</div>
                    <div className="leading-relaxed text-white">
                      {currentFaq.answer}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-6 rounded-lg text-center">
                    Select a category with questions to view answers.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Accordion */}
        <div className="mb-16 md:hidden">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-orange-50 p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-orange-900 text-center">
                {filteredFaqs.length} Question
                {filteredFaqs.length !== 1 ? "s" : ""} Found
              </h2>
            </div>

            {filteredFaqs.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white">
                    {/* Question Header */}
                    <button
                      onClick={() => handleFaqToggle(faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-600 text-sm font-medium">
                            {faq.id}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm leading-relaxed">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-orange-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Answer Content */}
                    {expandedFaq === faq.id && (
                      <div className="border-t border-gray-100">
                        <div className="bg-[#1A2E20] p-4 m-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-yellow-400 text-lg">★</span>
                            <span className="text-orange-300 font-medium text-sm">
                              Answer
                            </span>
                          </div>
                          <div className="leading-relaxed text-white text-sm">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p>No questions found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">{`Can't find what you're looking for? Our support team is here to help.`}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/live-chat"
              className="bg-white border border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg transition-colors"
            >
              Start Live Chat
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
