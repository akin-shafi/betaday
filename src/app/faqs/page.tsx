/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

export default function FAQPage() {
  const [activeFaq, setActiveFaq] = useState("01");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General" },
    { id: "account", name: "Account & Profile" },
    { id: "payments", name: "Payments & Wallet" },
    { id: "delivery", name: "Delivery" },
    { id: "partners", name: "Business Partners" },
    { id: "riders", name: "Delivery Partners" },
  ];

  const faqData = [
    {
      id: "01",
      category: "general",
      question: "What is BetaDay?",
      answer:
        "BetaDay is a technology company that provides reliable delivery services to both businesses and consumers. We connect local businesses with customers through efficient delivery solutions, enabling businesses to expand their reach while providing consumers with convenient access to products they need. Our platform is designed to make deliveries faster, more reliable, and more affordable for everyone.",
    },
    {
      id: "02",
      category: "partners",
      question: "How do I sign up as a business partner?",
      answer: (
        <>
          Signing up as a business partner with BetaDay is simple. Visit our{" "}
          <Link
            href="/partner"
            className="text-orange-800 underline font-medium"
          >
            Partners page
          </Link>{" "}
          and click on 'Join as a Partner'. Fill out the application form with
          your business details, and our team will contact you within 48 hours
          to discuss partnership options and onboarding. We work with businesses
          of all sizes and are committed to creating delivery solutions that
          meet your specific needs.
        </>
      ),
    },
    {
      id: "03",
      category: "account",
      question: "How do I create a customer account?",
      answer:
        "Creating a customer account on BetaDay takes just a minute. Download our mobile app from the App Store or Google Play, or visit our website and click 'Sign Up'. Enter your name, email, phone number, and create a password. Verify your account through the link sent to your email, and you're ready to start using BetaDay for all your delivery needs.",
    },
    {
      id: "04",
      category: "payments",
      question: "What is BetaDay Wallet?",
      answer:
        "BetaDay Wallet is our secure in-app payment system that makes transactions faster and more convenient. You can add funds to your wallet using various payment methods, including credit/debit cards and bank transfers. The wallet allows for quick checkout, easy refunds, and special promotions. All transactions are encrypted and protected by industry-standard security protocols.",
    },
    {
      id: "05",
      category: "delivery",
      question: "What areas do you currently serve?",
      answer:
        "BetaDay currently operates in select urban areas, with plans for rapid expansion. Our service is available in major neighborhoods of Lagos, with plans to expand to other cities soon. You can check if we deliver to your area by entering your address in our app or website. We're constantly growing our coverage area to serve more communities.",
    },
    {
      id: "06",
      category: "delivery",
      question: "What is the delivery fee?",
      answer:
        "Our delivery fees are calculated based on distance, package size, and delivery urgency. We strive to keep our fees competitive and transparent. The exact fee for your delivery will be displayed before you confirm your order. BetaDay Plus members enjoy reduced or waived delivery fees on eligible orders. We also offer special rates for business partners with regular delivery needs.",
    },
    {
      id: "07",
      category: "riders",
      question: "How do I become a delivery partner?",
      answer:
        "To become a BetaDay delivery partner, visit our 'Join as a Rider' page and complete the application form. You'll need to provide personal information, vehicle details, and required documentation. Qualified applicants will be invited for an orientation session. We provide training, branded gear, and ongoing support to help our delivery partners succeed. Join our team to enjoy flexible hours and competitive earnings.",
    },
    {
      id: "08",
      category: "delivery",
      question: "What is Priority delivery?",
      answer:
        "Priority delivery is our premium service option that ensures your package is delivered with the highest urgency. When you select Priority delivery, your order is placed at the front of the queue and assigned to our fastest riders. This service comes with a slightly higher fee but guarantees the quickest possible delivery time, making it perfect for urgent items or time-sensitive deliveries.",
    },
    {
      id: "09",
      category: "delivery",
      question: "Why do you charge Priority fees?",
      answer:
        "Priority fees allow us to offer expedited delivery services for time-sensitive orders. These fees compensate our delivery partners for the additional effort required to prioritize your delivery over standard orders. They also help us maintain service quality by ensuring we have enough delivery partners available for urgent requests, even during peak hours. The Priority fee is always displayed transparently before you confirm your order.",
    },
    {
      id: "10",
      category: "account",
      question: "How do I update my profile?",
      answer:
        "To update your profile, log in to your BetaDay account and click on your profile icon in the top right corner. Select 'Account Settings' from the dropdown menu. Here, you can edit your personal information, update your delivery addresses, change your password, and manage your notification preferences. Remember to click 'Save Changes' after making any updates to ensure your new information is stored.",
    },
    {
      id: "11",
      category: "payments",
      question: "How do I delete a saved payment method?",
      answer:
        "To delete a saved payment method, log in to your BetaDay account and go to 'Account Settings'. Navigate to the 'Payment Methods' tab where you'll see all your saved cards and payment options. Click the three dots next to the payment method you want to remove and select 'Delete'. You'll be asked to confirm this action. For security reasons, you may need to enter your password to complete the deletion process.",
    },
    {
      id: "12",
      category: "payments",
      question: "How do I fund my BetaDay wallet?",
      answer:
        "To fund your BetaDay wallet, log in to your account and click on 'Wallet' in the main menu. Select 'Add Funds' and enter the amount you wish to add. Choose your preferred payment method from the options provided (card, bank transfer, or other available methods). Follow the prompts to complete the transaction. Funds are usually added instantly, but bank transfers may take up to 24 hours to reflect in your wallet.",
    },
    {
      id: "13",
      category: "partners",
      question: "What is the BetaDay Partner Score?",
      answer:
        "The BetaDay Partner Score is a rating system that helps us maintain high-quality service across our platform. Business partners are rated based on factors like order preparation time, accuracy, customer satisfaction, and overall reliability. A higher score increases your visibility on the platform and can lead to promotional opportunities. We provide regular feedback and suggestions to help partners improve their scores and grow their business with BetaDay.",
    },
    {
      id: "14",
      category: "riders",
      question: "How do riders get paid?",
      answer:
        "BetaDay delivery partners (riders) receive weekly payments for all completed deliveries. Earnings include base delivery fees plus any tips from customers. Payments are automatically transferred to the rider's registered bank account every Monday for the previous week's work. Riders can track their earnings in real-time through the BetaDay Rider app, which provides a detailed breakdown of each delivery and associated earnings.",
    },
    {
      id: "15",
      category: "general",
      question: "How do I contact customer support?",
      answer:
        "You can contact our customer support team through multiple channels. For immediate assistance, use the in-app chat feature available in the BetaDay app. You can also email us at support@betaday.com or call our customer service line at +234-XXX-XXXX during business hours (8am-10pm daily). For general inquiries, you can reach out to us on social media or visit our Help Center for self-service options and frequently asked questions.",
    },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? faqData
      : faqData.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-white">
      <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
        {/* <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div> */}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about BetaDay's delivery services,
            account management, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 pb-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? "bg-orange-600 text-white"
                    : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-16">
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
                      onClick={() => setActiveFaq(faq.id)}
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

                {filteredFaqs.length > 0 ? (
                  <div className="bg-[#1A2E20] p-6 rounded-lg sticky top-32">
                    <div className="text-white text-2xl mb-4">★</div>
                    <div className="leading-relaxed text-white">
                      {faqData.find((faq) => faq.id === activeFaq)?.answer}
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

        {/* Still Need Help Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
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
