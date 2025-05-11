/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
// import Header from "@/components/header";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "eligibility", title: "Eligibility" },
    { id: "accounts", title: "User Accounts" },
    { id: "service", title: "Service Description" },
    { id: "conduct", title: "User Conduct" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "payment", title: "Payment Terms" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "disclaimers", title: "Disclaimers" },
    { id: "termination", title: "Termination" },
    { id: "governing-law", title: "Governing Law" },
    { id: "changes", title: "Changes to Terms" },
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

  const handlePrint = () => {
    window.print();
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
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-white print:bg-white">
      {/* <Header /> */}

      <main className="max-w-6xl mx-auto px-4 py-12 pt-32 print:pt-10">
        <div className="mb-8 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

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

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 print:hidden">
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
          <div className="md:col-span-3 print:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 print:shadow-none">
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Introduction
                </h2>
                <p className="mb-4">
                  Welcome to BetaDay. These Terms of Service ("Terms") govern
                  your use of the BetaDay website, mobile application, and
                  services (collectively, the "Service") operated by BetaDay
                  ("we," "us," or "our").
                </p>
                <p className="mb-4">
                  Please read these Terms carefully before using our Service.
                  Your access to and use of the Service is conditioned on your
                  acceptance of and compliance with these Terms. These Terms
                  apply to all visitors, users, and others who access or use the
                  Service.
                </p>
                <p>
                  By accessing or using the Service, you agree to be bound by
                  these Terms. If you disagree with any part of the Terms, then
                  you may not access the Service.
                </p>
              </section>

              <section id="eligibility" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Eligibility
                </h2>
                <p className="mb-4">
                  You must be at least 18 years of age to use our Service. By
                  using our Service, you represent and warrant that you are at
                  least 18 years of age and have the legal capacity to enter
                  into these Terms.
                </p>
                <p>
                  If you are using the Service on behalf of a business or other
                  legal entity, you represent that you have the authority to
                  bind such entity to these Terms, in which case the terms "you"
                  or "your" shall refer to such entity.
                </p>
              </section>

              <section id="accounts" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  User Accounts
                </h2>
                <p className="mb-4">
                  When you create an account with us, you must provide accurate,
                  complete, and current information at all times. Failure to do
                  so constitutes a breach of the Terms, which may result in
                  immediate termination of your account on our Service.
                </p>
                <p className="mb-4">
                  You are responsible for safeguarding the password that you use
                  to access the Service and for any activities or actions under
                  your password, whether your password is with our Service or a
                  third-party service.
                </p>
                <p className="mb-4">
                  You agree not to disclose your password to any third party.
                  You must notify us immediately upon becoming aware of any
                  breach of security or unauthorized use of your account.
                </p>
                <p>
                  You may not use as a username the name of another person or
                  entity or that is not lawfully available for use, a name or
                  trademark that is subject to any rights of another person or
                  entity other than you without appropriate authorization, or a
                  name that is otherwise offensive, vulgar, or obscene.
                </p>
              </section>

              <section id="service" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Service Description
                </h2>
                <p className="mb-4">
                  BetaDay is a delivery service platform that connects users
                  with delivery partners to facilitate the delivery of goods
                  from businesses to consumers. Our Service includes, but is not
                  limited to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    Connecting users with local businesses for product ordering
                  </li>
                  <li>
                    Facilitating the delivery of products from businesses to
                    users
                  </li>
                  <li>Processing payments for orders and deliveries</li>
                  <li>Providing order tracking and delivery status updates</li>
                  <li>
                    Enabling communication between users, businesses, and
                    delivery partners
                  </li>
                </ul>
                <p className="mb-4">
                  We reserve the right to modify or discontinue, temporarily or
                  permanently, the Service (or any part thereof) with or without
                  notice. We shall not be liable to you or to any third party
                  for any modification, suspension, or discontinuance of the
                  Service.
                </p>
                <p>
                  The Service is subject to availability and may be limited by
                  factors outside our control, including but not limited to
                  weather conditions, traffic, and availability of delivery
                  partners.
                </p>
              </section>

              <section id="conduct" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  User Conduct
                </h2>
                <p className="mb-4">
                  You agree to use our Service only for lawful purposes and in
                  accordance with these Terms. You agree not to use the Service:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    In any way that violates any applicable national, federal,
                    state, local, or international law or regulation
                  </li>
                  <li>
                    For the purpose of exploiting, harming, or attempting to
                    exploit or harm minors in any way by exposing them to
                    inappropriate content or otherwise
                  </li>
                  <li>
                    To transmit, or procure the sending of, any advertising or
                    promotional material, including any "junk mail," "chain
                    letter," "spam," or any other similar solicitation
                  </li>
                  <li>
                    To impersonate or attempt to impersonate BetaDay, a BetaDay
                    employee, another user, or any other person or entity
                  </li>
                  <li>
                    To engage in any other conduct that restricts or inhibits
                    anyone's use or enjoyment of the Service, or which, as
                    determined by us, may harm BetaDay or users of the Service
                    or expose them to liability
                  </li>
                </ul>
                <p>
                  Additionally, you agree not to use the Service to request the
                  delivery of illegal or prohibited items, including but not
                  limited to weapons, illegal drugs, hazardous materials, or any
                  other items prohibited by applicable law.
                </p>
              </section>

              <section id="intellectual-property" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Intellectual Property
                </h2>
                <p className="mb-4">
                  The Service and its original content, features, and
                  functionality are and will remain the exclusive property of
                  BetaDay and its licensors. The Service is protected by
                  copyright, trademark, and other laws of both Nigeria and
                  foreign countries. Our trademarks and trade dress may not be
                  used in connection with any product or service without the
                  prior written consent of BetaDay.
                </p>
                <p>
                  You acknowledge and agree that any feedback, comments, or
                  suggestions you may provide regarding BetaDay or the Service
                  are entirely voluntary, and we shall be free to use such
                  feedback, comments, or suggestions as we see fit and without
                  any obligation to you.
                </p>
              </section>

              <section id="payment" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Payment Terms
                </h2>
                <p className="mb-4">
                  By using our Service, you agree to pay all fees and charges
                  associated with your use of the Service, including but not
                  limited to delivery fees, service fees, and the cost of items
                  ordered through the Service. All fees are clearly displayed
                  before you confirm your order.
                </p>
                <p className="mb-4">
                  You agree to provide current, complete, and accurate purchase
                  and account information for all purchases made through the
                  Service. You further agree to promptly update account and
                  payment information, including email address, payment method,
                  and payment card expiration date, so that we can complete your
                  transactions and contact you as needed.
                </p>
                <p className="mb-4">
                  We use third-party payment processors to process payments made
                  to us. The processing of payments will be subject to the
                  terms, conditions, and privacy policies of these payment
                  processors in addition to these Terms.
                </p>
                <p className="mb-4">
                  We reserve the right to refuse any order placed through the
                  Service. We may, in our sole discretion, limit or cancel
                  quantities purchased per person, per household, or per order.
                  These restrictions may include orders placed by or under the
                  same customer account, the same payment method, and/or orders
                  that use the same billing or shipping address.
                </p>
                <p>
                  Prices for products and services are subject to change without
                  notice. We reserve the right to modify or discontinue the
                  Service (or any part or content thereof) without notice at any
                  time.
                </p>
              </section>

              <section id="liability" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Limitation of Liability
                </h2>
                <p className="mb-4">
                  To the maximum extent permitted by applicable law, in no event
                  shall BetaDay, its affiliates, directors, employees, agents,
                  or licensors be liable for any indirect, punitive, incidental,
                  special, consequential, or exemplary damages, including
                  without limitation damages for loss of profits, goodwill, use,
                  data, or other intangible losses, that result from the use of,
                  or inability to use, the Service.
                </p>
                <p className="mb-4">
                  To the maximum extent permitted by applicable law, BetaDay
                  assumes no liability or responsibility for any:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Errors, mistakes, or inaccuracies of content</li>
                  <li>
                    Personal injury or property damage, of any nature
                    whatsoever, resulting from your access to and use of our
                    Service
                  </li>
                  <li>
                    Any unauthorized access to or use of our secure servers
                    and/or any personal information stored therein
                  </li>
                  <li>
                    Any interruption or cessation of transmission to or from the
                    Service
                  </li>
                  <li>
                    Any bugs, viruses, trojan horses, or the like that may be
                    transmitted to or through the Service by any third party
                  </li>
                  <li>
                    Any errors or omissions in any content or for any loss or
                    damage incurred as a result of the use of any content
                    posted, emailed, transmitted, or otherwise made available
                    through the Service
                  </li>
                </ul>
                <p>
                  In no event shall our total liability to you for all damages,
                  losses, or causes of action exceed the amount you have paid to
                  BetaDay in the last six (6) months, or, if greater, one
                  hundred dollars ($100).
                </p>
              </section>

              <section id="disclaimers" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Disclaimers
                </h2>
                <p className="mb-4">
                  Your use of the Service is at your sole risk. The Service is
                  provided on an "AS IS" and "AS AVAILABLE" basis. The Service
                  is provided without warranties of any kind, whether express or
                  implied, including, but not limited to, implied warranties of
                  merchantability, fitness for a particular purpose,
                  non-infringement, or course of performance.
                </p>
                <p className="mb-4">
                  BetaDay, its subsidiaries, affiliates, and licensors do not
                  warrant that:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    The Service will function uninterrupted, secure, or
                    available at any particular time or location
                  </li>
                  <li>Any errors or defects will be corrected</li>
                  <li>
                    The Service is free of viruses or other harmful components
                  </li>
                  <li>
                    The results of using the Service will meet your requirements
                  </li>
                </ul>
                <p>
                  While we strive to ensure that the products delivered through
                  our Service are of high quality, we do not guarantee the
                  quality, safety, or legality of items delivered through the
                  Service or the accuracy of any listing information.
                </p>
              </section>

              <section id="termination" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Termination
                </h2>
                <p className="mb-4">
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </p>
                <p className="mb-4">
                  Upon termination, your right to use the Service will
                  immediately cease. If you wish to terminate your account, you
                  may simply discontinue using the Service or contact us to
                  request account deletion.
                </p>
                <p>
                  All provisions of the Terms which by their nature should
                  survive termination shall survive termination, including,
                  without limitation, ownership provisions, warranty
                  disclaimers, indemnity, and limitations of liability.
                </p>
              </section>

              <section id="governing-law" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Governing Law
                </h2>
                <p className="mb-4">
                  These Terms shall be governed and construed in accordance with
                  the laws of Nigeria, without regard to its conflict of law
                  provisions.
                </p>
                <p className="mb-4">
                  Our failure to enforce any right or provision of these Terms
                  will not be considered a waiver of those rights. If any
                  provision of these Terms is held to be invalid or
                  unenforceable by a court, the remaining provisions of these
                  Terms will remain in effect.
                </p>
                <p>
                  Any disputes arising out of or relating to these Terms or the
                  Service shall be resolved exclusively in the courts of
                  Nigeria, and you consent to the personal jurisdiction of such
                  courts.
                </p>
              </section>

              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Changes to Terms
                </h2>
                <p className="mb-4">
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material, we
                  will try to provide at least 30 days' notice prior to any new
                  terms taking effect. What constitutes a material change will
                  be determined at our sole discretion.
                </p>
                <p className="mb-4">
                  By continuing to access or use our Service after those
                  revisions become effective, you agree to be bound by the
                  revised terms. If you do not agree to the new terms, please
                  stop using the Service.
                </p>
                <p>
                  It is your responsibility to review these Terms periodically
                  for changes. Your continued use of the Service following the
                  posting of any changes to these Terms constitutes acceptance
                  of those changes.
                </p>
              </section>

              <section id="contact" className="mb-4">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">
                  Contact Us
                </h2>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact
                  us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>By email:</strong> contact@betaday.org
                  </li>
                  {/* <li>
                    <strong>By phone:</strong> +234-XXX-XXXX
                  </li>
                  <li>
                    <strong>By mail:</strong> BetaDay Headquarters, Shop A37, Oja Market Awodi-Ora Ajeromi-Ifelodun, Lagos, Nigeria
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
