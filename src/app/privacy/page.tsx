/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import Header from "@/components/header";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collection", title: "Information We Collect" },
    { id: "information-use", title: "How We Use Your Information" },
    { id: "information-sharing", title: "Information Sharing" },
    { id: "data-security", title: "Data Security" },
    { id: "user-rights", title: "Your Rights" },
    { id: "cookies", title: "Cookies & Tracking" },
    { id: "changes", title: "Changes to Privacy Policy" },
    { id: "contact", title: "Contact Us" },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll to update active section
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY + 150;

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(id);
          }
        }
      });
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-white">
      {/* <Header /> */}

      <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Last Updated: May 11, 2025
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="sticky top-32 bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-4 text-orange-800">
                Contents
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === section.id
                        ? "bg-orange-100 text-orange-800 font-medium"
                        : "text-gray-600 hover:bg-orange-50"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Introduction
                </h2>
                <p className="mb-4">
                  Welcome to BetaDay. We respect your privacy and are committed
                  to protecting your personal data. This privacy policy will
                  inform you about how we look after your personal data when you
                  visit our website or use our services and tell you about your
                  privacy rights and how the law protects you.
                </p>
                <p className="mb-4">
                  BetaDay ("we", "us", or "our") operates the BetaDay website
                  and mobile application (the "Service"). This page informs you
                  of our policies regarding the collection, use, and disclosure
                  of personal data when you use our Service and the choices you
                  have associated with that data.
                </p>
                <p>
                  We use your data to provide and improve the Service. By using
                  the Service, you agree to the collection and use of
                  information in accordance with this policy.
                </p>
              </section>

              <section id="information-collection" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Information We Collect
                </h2>
                <p className="mb-4">
                  We collect several different types of information for various
                  purposes to provide and improve our Service to you.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-orange-700">
                  Personal Data
                </h3>
                <p className="mb-4">
                  While using our Service, we may ask you to provide us with
                  certain personally identifiable information that can be used
                  to contact or identify you ("Personal Data"). Personally
                  identifiable information may include, but is not limited to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Cookies and Usage Data</li>
                  <li>
                    Payment information (processed securely through our payment
                    processors)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-orange-700">
                  Usage Data
                </h3>
                <p className="mb-4">
                  We may also collect information on how the Service is accessed
                  and used ("Usage Data"). This Usage Data may include
                  information such as your computer's Internet Protocol address
                  (e.g., IP address), browser type, browser version, the pages
                  of our Service that you visit, the time and date of your
                  visit, the time spent on those pages, unique device
                  identifiers, and other diagnostic data.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-orange-700">
                  Location Data
                </h3>
                <p>
                  We collect real-time location information from your device
                  with your consent to provide location-based services such as
                  delivery tracking and to match you with nearby delivery
                  partners. You can disable location services through your
                  device settings, but this may limit your ability to use
                  certain features of our Service.
                </p>
              </section>

              <section id="information-use" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  How We Use Your Information
                </h2>
                <p className="mb-4">
                  BetaDay uses the collected data for various purposes:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>
                    To allow you to participate in interactive features of our
                    Service when you choose to do so
                  </li>
                  <li>To provide customer support</li>
                  <li>
                    To gather analysis or valuable information so that we can
                    improve our Service
                  </li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                  <li>
                    To fulfill any other purpose for which you provide it, such
                    as processing your orders and facilitating deliveries
                  </li>
                  <li>
                    To provide you with news, special offers and general
                    information about other goods, services and events which we
                    offer that are similar to those that you have already
                    purchased or enquired about unless you have opted not to
                    receive such information
                  </li>
                </ul>
              </section>

              <section id="information-sharing" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Information Sharing
                </h2>
                <p className="mb-4">
                  We may share your personal information in the following
                  situations:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong>With Service Providers:</strong> We may share your
                    information with third-party service providers to perform
                    services on our behalf, such as payment processing, data
                    analysis, email delivery, hosting services, customer
                    service, and marketing assistance.
                  </li>
                  <li>
                    <strong>With Business Partners:</strong> We may share your
                    information with our business partners to offer you certain
                    products, services, or promotions.
                  </li>
                  <li>
                    <strong>With Delivery Partners:</strong> We share necessary
                    information with delivery partners to facilitate the
                    delivery of your orders, including your name, address, and
                    contact information.
                  </li>
                  <li>
                    <strong>For Business Transfers:</strong> We may share or
                    transfer your information in connection with, or during
                    negotiations of, any merger, sale of company assets,
                    financing, or acquisition of all or a portion of our
                    business to another company.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may disclose your
                    personal information for any other purpose with your
                    consent.
                  </li>
                  <li>
                    <strong>For Legal Reasons:</strong> We may disclose your
                    information where required to do so by law or in response to
                    valid requests by public authorities (e.g., a court or a
                    government agency).
                  </li>
                </ul>
              </section>

              <section id="data-security" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Data Security
                </h2>
                <p className="mb-4">
                  The security of your data is important to us, but remember
                  that no method of transmission over the Internet or method of
                  electronic storage is 100% secure. While we strive to use
                  commercially acceptable means to protect your Personal Data,
                  we cannot guarantee its absolute security.
                </p>
                <p className="mb-4">
                  We implement a variety of security measures to maintain the
                  safety of your personal information when you place an order or
                  enter, submit, or access your personal information. These
                  include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>
                    Secure networks and limited access to personal information
                  </li>
                  <li>Employee training on privacy and security practices</li>
                  <li>Regular monitoring for suspicious activities</li>
                </ul>
              </section>

              <section id="user-rights" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Your Rights
                </h2>
                <p className="mb-4">
                  Depending on your location, you may have certain rights
                  regarding your personal information. These may include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong>Right to Access:</strong> You have the right to
                    request copies of your personal information.
                  </li>
                  <li>
                    <strong>Right to Rectification:</strong> You have the right
                    to request that we correct any information you believe is
                    inaccurate or complete information you believe is
                    incomplete.
                  </li>
                  <li>
                    <strong>Right to Erasure:</strong> You have the right to
                    request that we erase your personal information, under
                    certain conditions.
                  </li>
                  <li>
                    <strong>Right to Restrict Processing:</strong> You have the
                    right to request that we restrict the processing of your
                    personal information, under certain conditions.
                  </li>
                  <li>
                    <strong>Right to Object to Processing:</strong> You have the
                    right to object to our processing of your personal
                    information, under certain conditions.
                  </li>
                  <li>
                    <strong>Right to Data Portability:</strong> You have the
                    right to request that we transfer the data we have collected
                    to another organization, or directly to you, under certain
                    conditions.
                  </li>
                </ul>
                <p>
                  If you wish to exercise any of these rights, please contact us
                  using the contact information provided below. We will respond
                  to your request within a reasonable timeframe.
                </p>
              </section>

              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Cookies & Tracking
                </h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to track the
                  activity on our Service and hold certain information.
                </p>
                <p className="mb-4">
                  Cookies are files with a small amount of data which may
                  include an anonymous unique identifier. Cookies are sent to
                  your browser from a website and stored on your device.
                  Tracking technologies also used are beacons, tags, and scripts
                  to collect and track information and to improve and analyze
                  our Service.
                </p>
                <p className="mb-4">
                  You can instruct your browser to refuse all cookies or to
                  indicate when a cookie is being sent. However, if you do not
                  accept cookies, you may not be able to use some portions of
                  our Service.
                </p>
                <p>Examples of Cookies we use:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>
                    <strong>Session Cookies:</strong> We use Session Cookies to
                    operate our Service.
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> We use Preference
                    Cookies to remember your preferences and various settings.
                  </li>
                  <li>
                    <strong>Security Cookies:</strong> We use Security Cookies
                    for security purposes.
                  </li>
                  <li>
                    <strong>Advertising Cookies:</strong> Advertising Cookies
                    are used to serve you with advertisements that may be
                    relevant to you and your interests.
                  </li>
                </ul>
              </section>

              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Changes to Privacy Policy
                </h2>
                <p className="mb-4">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last Updated" date at the top of
                  this Privacy Policy.
                </p>
                <p className="mb-4">
                  You are advised to review this Privacy Policy periodically for
                  any changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>
                <p>
                  If we make material changes to this Privacy Policy, we will
                  notify you either through the email address you have provided
                  us or by placing a prominent notice on our website.
                </p>
              </section>

              <section id="contact" className="mb-4">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Contact Us
                </h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>By email:</strong> contact@betaday.org
                  </li>
                  {/* <li>
                    <strong>By phone:</strong> +234-XXX-XXXX
                  </li>
                  <li>
                    <strong>By mail:</strong> BetaDay Headquarters, 123 Delivery
                    Street, Lagos, Nigeria
                  </li> */}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
