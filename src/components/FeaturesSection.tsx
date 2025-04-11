// components/FeaturesSection.tsx
"use client";

import { Store, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  // Updated features with more locally focused content and Lucide icons
  const localFeatures = [
    {
      title: "Local Favorites",
      description:
        "Discover and order from your favorite local restaurants in your neighborhood",
      icon: Store
    },
    {
      title: "Quick Delivery",
      description:
        "Get your food delivered fresh and hot within your area, right to your doorstep",
      icon: Clock
    },
    {
      title: "Easy Ordering",
      description:
        "Simple ordering process with your preferred payment method, including cash on delivery",
      icon: CreditCard
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            Simple & Convenient
          </h2>
          <p className="text-base text-gray-600">
            Your local food delivery service that makes ordering easy
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {localFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-gray-50 hover:bg-white p-6 rounded-lg transition-all duration-300 hover:shadow-md"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-5 h-5 text-orange-600" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
