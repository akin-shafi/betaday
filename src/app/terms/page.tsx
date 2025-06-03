/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { Printer, ChevronDown, ChevronUp } from "lucide-react";
import termsData from "./termsData.json";

// Define TypeScript interfaces for the data structure
interface Section {
  id: string;
  title: string;
}

interface ContentItem {
  title: string;
  content: (string | { type: string; items: string[] })[];
}

interface TermsData {
  sections: Section[];
  content: {
    [key: string]: ContentItem;
  };
}

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Cast termsData to the defined type
  const data = termsData as TermsData;

  // Set mounted state on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePrint = () => {
    if (!isMounted || typeof window === "undefined") return;
    window.print();
  };

  // Handle section selection for desktop tabs
  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Handle section toggle for mobile accordion
  const handleSectionToggle = (sectionId: string) => {
    const newExpandedState = expandedSection === sectionId ? null : sectionId;
    setExpandedSection(newExpandedState);
    if (newExpandedState) {
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-white print:bg-white">
      <main className="max-w-6xl mx-auto px-4 py-12 pt-32 print:pt-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Last Updated: May 11, 2025
          </p>
          <button
            onClick={handlePrint}
            className="mt-4 inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors print:hidden"
          >
            <Printer className="h-4 w-4" />
            Print Terms
          </button>
        </div>

        {/* Desktop Layout - Two Columns with Tabs */}
        <div className="mb-16 hidden md:block">
          <div className="border border-gray-200 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:border-r border-gray-200 pr-4">
                <h2 className="text-3xl font-bold mb-8 text-orange-900">
                  Contents
                </h2>
                {data.sections.map((section) => (
                  <div
                    key={section.id}
                    className={`mb-4 border-b border-gray-100 pb-4 cursor-pointer transition-colors ${
                      activeSection === section.id ? "border-orange-300" : ""
                    }`}
                    onClick={() => handleSectionSelect(section.id)}
                  >
                    <div className="flex items-center gap-2">
                      {activeSection === section.id && (
                        <span className="text-yellow-500 text-lg">★</span>
                      )}
                      <h3
                        className={`font-medium ${
                          activeSection === section.id
                            ? "text-orange-800"
                            : "text-gray-700"
                        }`}
                      >
                        {section.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8 text-orange-900">
                  Details
                </h2>
                <div className="bg-[#1A2E20] p-6 rounded-lg sticky top-32">
                  <div className="text-yellow-400 text-2xl mb-4">★</div>
                  <h3 className="text-white font-medium mb-4">
                    {data.content[activeSection].title}
                  </h3>
                  {data.content[activeSection].content.map((item, index) =>
                    typeof item === "string" ? (
                      <p
                        key={index}
                        className="mb-4 text-white leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ) : item.type === "list" ? (
                      <ul
                        key={index}
                        className="list-disc pl-6 mb-4 space-y-2 text-white"
                      >
                        {item.items.map((listItem, listIndex) => (
                          <li
                            key={listIndex}
                            dangerouslySetInnerHTML={{ __html: listItem }}
                          />
                        ))}
                      </ul>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Accordion */}
        <div className="mb-16 md:hidden">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-orange-50 p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-orange-900 text-center">
                {data.sections.length} Section
                {data.sections.length !== 1 ? "s" : ""} Found
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {data.sections.map((section) => (
                <div key={section.id} className="bg-white">
                  {/* Section Header */}
                  <button
                    onClick={() => handleSectionToggle(section.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 text-sm font-medium">
                          {section.id.slice(0, 2)}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm leading-relaxed">
                        {section.title}
                      </h3>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {expandedSection === section.id ? (
                        <ChevronUp className="h-5 w-5 text-orange-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Section Content */}
                  {expandedSection === section.id && (
                    <div className="border-t border-gray-100">
                      <div className="bg-[#1A2E20] p-4 m-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-yellow-400 text-lg">★</span>
                          <span className="text-orange-300 font-medium text-sm">
                            Details
                          </span>
                        </div>
                        {data.content[section.id].content.map((item, index) =>
                          typeof item === "string" ? (
                            <p
                              key={index}
                              className="mb-4 text-white leading-relaxed text-sm"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          ) : item.type === "list" ? (
                            <ul
                              key={index}
                              className="list-disc pl-6 mb-4 space-y-2 text-white text-sm"
                            >
                              {item.items.map((listItem, listIndex) => (
                                <li
                                  key={listIndex}
                                  dangerouslySetInnerHTML={{ __html: listItem }}
                                />
                              ))}
                            </ul>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is
            here to help.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="mailto:contact@betaday.org"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
