/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Shield,
  Headphones,
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
  DollarSign,
  Target,
  Store,
  Package,
  Zap,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function VendorLanding() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-white ">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <Badge className="bg-[#FF6600] text-white hover:bg-[#FF6600] text-sm px-4 py-2">
                🚀 Growing Across the Globe • Join the Movement
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-[#1A2E20] leading-tight">
                Partner with the
                <span className="text-[#FF6600]"> Next Generation</span>
                <br />
                Delivery Platform
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Whether you run a restaurant, grocery store, pharmacy, or any
                retail business, we help you reach more customers and grow your
                revenue through our reliable delivery network across multiple
                markets.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  size="lg"
                  className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-6 text-lg"
                  onClick={() =>
                    window.open(
                      "https://vendor.betadayapp.com/auth/signup",
                      "_blank"
                    )
                  }
                >
                  Join Our Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#1A2E20] text-[#1A2E20] hover:bg-[#1A2E20] hover:text-white px-8 py-6 text-lg"
                  onClick={() =>
                    window.open(
                      "https://vendor.betadayapp.com/auth/login",
                      "_blank"
                    )
                  }
                >
                  Vendor Login
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#FF6600]" />
                  <span>Free to Join</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#FF6600]" />
                  <span>Quick Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#FF6600]" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-semibold text-[#1A2E20] mb-2">
              Growing Together Across Markets
            </h2>
            <p className="text-gray-600">
              Real numbers from our expanding network
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "500+", label: "Active Partners", icon: Store },
              { number: "15,000+", label: "Monthly Orders", icon: Package },
              { number: "25 min", label: "Average Delivery", icon: Clock },
              { number: "4.6★", label: "Partner Rating", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-3">
                  <stat.icon className="h-6 w-6 text-[#FF6600]" />
                </div>
                <div className="text-2xl font-bold text-[#1A2E20] mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              Perfect for Every Business Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From food to groceries, pharmaceuticals to retail - we deliver it
              all
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Restaurants & Food",
                description: "Meals, snacks, beverages",
                icon: "🍽️",
                examples: "Local cuisine, Fast food, Beverages",
              },
              {
                title: "Grocery Stores",
                description: "Fresh produce, household items",
                icon: "🛒",
                examples: "Vegetables, Staples, Household goods",
              },
              {
                title: "Pharmacies",
                description: "Medications, health products",
                icon: "💊",
                examples: "Prescriptions, First aid, Wellness",
              },
              {
                title: "Retail Shops",
                description: "Electronics, fashion, gifts",
                icon: "🛍️",
                examples: "Electronics, Fashion, Accessories",
              },
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-md transition-shadow border-l-4 border-l-[#FF6600]">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h3 className="text-lg font-semibold text-[#1A2E20] mb-2">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      {type.description}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      {type.examples}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              Why Businesses Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for modern businesses with features that drive real growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Target,
                title: "Expand Your Reach",
                description:
                  "Connect with customers across multiple cities and regions. Grow beyond your local area and tap into new markets.",
              },
              {
                icon: DollarSign,
                title: "Increase Revenue",
                description:
                  "Boost your daily sales with online ordering and delivery. Many partners see 30-50% revenue increase within 3 months.",
              },
              {
                icon: Smartphone,
                title: "Easy Management",
                description:
                  "Intuitive dashboard and mobile app. Manage orders, update inventory, and track performance from anywhere.",
              },
              {
                icon: Zap,
                title: "Fast Delivery Network",
                description:
                  "Reliable delivery partners ensure your products reach customers quickly and safely across our coverage areas.",
              },
              {
                icon: Headphones,
                title: "Dedicated Support",
                description:
                  "Professional support team ready to help. Get assistance with setup, operations, and growing your business.",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Secure payment processing and reliable technology infrastructure. Focus on your business while we handle the rest.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                    <benefit.icon className="h-6 w-6 text-[#FF6600]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A2E20] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From signup to first sale in less than 24 hours
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Sign Up & Verify",
                  description:
                    "Create your account with basic business information. Upload required business documents. We'll verify and approve quickly.",
                },
                {
                  step: "2",
                  title: "Setup Your Store",
                  description:
                    "Add your products or menu with photos and descriptions. Set your prices and delivery areas. Our team helps optimize your listings.",
                },
                {
                  step: "3",
                  title: "Start Selling",
                  description:
                    "Go live and start receiving orders immediately. Track performance, manage inventory, and grow your business with our tools.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-[#FF6600] text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A2E20] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              Success Stories from Our Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from business owners growing with us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                business: "Urban Kitchen",
                text: "Since joining the platform, our customer base has expanded significantly. The easy-to-use dashboard and reliable delivery service have made all the difference for our restaurant.",
                rating: 5,
              },
              {
                name: "Sadu Abdulmojeed",
                business: "Fresh Market Groceries",
                text: "The platform helped us reach customers we never could before. Our online sales now make up 40% of our total revenue, and the support team is always helpful.",
                rating: 5,
              },
              {
                name: "Amarachi Williams",
                business: "Wellness Pharmacy",
                text: "Our customers love the convenience of ordering medications online. The secure payment system and fast delivery have built trust with our community.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-t-4 border-t-[#FF6600]">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-[#FF6600] fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <div className="font-semibold text-[#1A2E20]">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {testimonial.business}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expansion Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6600] rounded-full mb-6">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              Growing Across Africa
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We're expanding rapidly across African markets, bringing modern
              delivery solutions to businesses everywhere. Join us as we build
              the future of commerce across the continent.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-[#FF6600] mb-2">5+</div>
                <div className="text-gray-600">Cities & Growing</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-[#FF6600] mb-2">3</div>
                <div className="text-gray-600">Countries Planned</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-[#FF6600] mb-2">
                  2024
                </div>
                <div className="text-gray-600">Expansion Year</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF6600] to-[#e55a00]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Join hundreds of businesses already growing with our platform.
              Start your journey today - it's free to join and easy to get
              started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#FF6600] hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                onClick={() =>
                  window.open(
                    "https://vendor.betadayapp.com/auth/signup",
                    "_blank"
                  )
                }
              >
                Start Selling Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[#FF6600] px-8 py-6 text-lg"
                onClick={() =>
                  window.open(
                    "https://vendor.betadayapp.com/auth/login",
                    "_blank"
                  )
                }
              >
                Vendor Login
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-orange-100">
              <span>✓ No setup fees</span>
              <span>✓ Quick approval</span>
              <span>✓ Professional support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2E20] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Questions? We're Here to Help
            </h3>
            <p className="text-gray-400 mb-6">
              Email: partners@betadayapp.com | Support available 24/7
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 BetaDay. Building the future of delivery across the world.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
