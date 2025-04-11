"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 pt-32">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

        <div className="prose prose-lg">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to BetaDay. By accessing or using our services, you agree
              to be bound by these terms and conditions. Please read them
              carefully before using our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                {`"Service" refers to the delivery and marketplace services
                provided by BetaDay`}
              </li>
              <li>
                {`"User" refers to any person who accesses or uses our platform`}
              </li>
              <li>
                {`"Partner" refers to restaurants, stores, and other businesses
                listed on our platform`}
              </li>
              <li>
                {`"Rider" refers to delivery partners who provide delivery
                services`}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Use of Service</h2>
            <p className="text-gray-600 mb-4">
              Users must be at least 18 years old to use our services. Users are
              responsible for maintaining the confidentiality of their account
              information and for all activities under their account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Orders and Delivery</h2>
            <p className="text-gray-600 mb-4">
              All orders are subject to availability and confirmation of the
              order price. Delivery times are estimates and may vary based on
              circumstances beyond our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Payment Terms</h2>
            <p className="text-gray-600 mb-4">
              Users agree to pay all charges at the prices listed for their
              orders plus any applicable taxes and delivery fees. All payments
              must be made through our approved payment methods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Cancellation Policy</h2>
            <p className="text-gray-600 mb-4">
              Orders may be cancelled according to our cancellation policy.
              Refunds will be processed according to our refund policy and the
              payment method used for the order.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              Our privacy policy explains how we collect, use, and protect your
              personal information. By using our services, you agree to our
              privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-4">
              BetaDay shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or relating to
              the use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these terms at any time. Users will
              be notified of any changes, and continued use of our services
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these terms, please contact us at:
              <br />
              Email: legal@betaday.com
              <br />
              Phone: +1 (234) 567-8900
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Last updated: March 2024</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
