"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "antd";
import { useState, useEffect } from "react";

const VendorContent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <div className="bg-[#fadbbb] min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto py-12 px-6 md:py-20 md:px-12 flex flex-col md:flex-row items-center">
        {/* Left: Text and CTA */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mb-8 md:mb-0"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A2E20] leading-tight">
            Your business needs <span className="text-[#FF6B00]">MORE</span> to
            Growth
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            The food at your doorstep. Why starve when you have us. Nawa for the
            oo bro.
          </p>
          <Button
            type="primary"
            size="large"
            className="mt-6"
            onClick={() => alert("Register Now clicked!")} // Replace with actual registration logic
          >
            Register Now
          </Button>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 flex justify-center"
        >
          <Image
            src="/images/hero-vendor.png"
            alt="Vendor Hero Illustration"
            width={400}
            height={400}
            className="w-full max-w-md"
            priority
          />
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-12 px-6 md:py-20 md:px-12">
        <div className="container mx-auto flex flex-col md:flex-row gap-12">
          {/* Left: Why Partner With Us? */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-6">
              Why Partner With Us?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-[#1A2E20] mr-3">✔</span>
                <div>
                  <p className="font-semibold">Expand your customer base</p>
                  <p className="text-gray-600">
                    Reach thousands of hungry customers in your area
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#1A2E20] mr-3">✔</span>
                <div>
                  <p className="font-semibold">Increase your revenue</p>
                  <p className="text-gray-600">
                    Boost sales with online ordering and delivery
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#1A2E20] mr-3">✔</span>
                <div>
                  <p className="font-semibold">
                    Real-time operation management
                  </p>
                  <p className="text-gray-600">
                    Streamline operations with our easy-to-use dashboard
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: We have got you! */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-6">
              We have got you!
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-[#1A2E20] mr-3">✔</span>
                <div>
                  <p className="font-semibold">Dedicated support team</p>
                  <p className="text-gray-600">Get help whenever you need it</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#1A2E20] mr-3">✔</span>
                <div>
                  <p className="font-semibold">Marketing assistance</p>
                  <p className="text-gray-600">
                    Promotional campaigns to highlight your restaurant
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#1A2E20] mr-3">✔</span>
                <div>
                  <p className="font-semibold">Analytics and insights</p>
                  <p className="text-gray-600">
                    Data-driven recommendations to optimize your menu
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

// Export the dynamically imported component
export default dynamic(() => Promise.resolve(VendorContent), {
  ssr: false,
});
