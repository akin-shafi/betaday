/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Clock,
  Shield,
  BarChart3,
  Headphones,
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
  DollarSign,
  Target,
} from "lucide-react";
import Image from "next/image";
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
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pt-10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
              🚀 Join our happy partners
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Grow Your Business with
              <span className="text-orange-600"> Smart Delivery</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Partner with us to reach more customers, increase revenue, and
              streamline your operations. Join the leading delivery platform
              trusted by thousands of business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg"
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
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg"
                onClick={() =>
                  window.open(
                    "https://vendor.betadayapp.com/auth/login",
                    "_blank"
                  )
                }
              >
                Partner Login
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold">4.8/5</span>
                <span className="text-gray-600">Partner Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Free Setup</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              <Image
                // src="/placeholder.svg?height=500&width=500"
                src="/images/restaurant-owner.jpg"
                alt="Restaurant owner managing orders"
                width={500}
                height={500}
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
                priority
              />
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: "10,000+", label: "Partner Restaurants", icon: Users },
              { number: "2M+", label: "Monthly Orders", icon: TrendingUp },
              { number: "15 min", label: "Average Delivery", icon: Clock },
              { number: "98%", label: "Customer Satisfaction", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful vendors that have transformed
              their business with our platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Expand Your Reach",
                description:
                  "Access thousands of hungry customers in your area and beyond. Our platform connects you with diners actively looking for great food.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: DollarSign,
                title: "Increase Revenue",
                description:
                  "Boost your sales by up to 40% with online ordering and delivery. Multiple revenue streams mean more profit for your business.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: Smartphone,
                title: "Easy Management",
                description:
                  "Streamline operations with our intuitive dashboard. Manage orders, track performance, and update your menu in real-time.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: BarChart3,
                title: "Data & Analytics",
                description:
                  "Make informed decisions with detailed insights. Track sales, understand customer preferences, and optimize your offerings.",
                color: "bg-orange-100 text-orange-600",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description:
                  "Get help whenever you need it. Our dedicated support team is always ready to assist you with any questions or issues.",
                color: "bg-pink-100 text-pink-600",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Trust in our secure payment processing and reliable delivery network. We handle the technology so you can focus on cooking.",
                color: "bg-indigo-100 text-indigo-600",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${benefit.color}`}
                    >
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just 3 simple steps and start receiving orders
              today
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up & Setup",
                description:
                  "Create your account, add your restaurant details, and upload your menu. Our team will help you get everything ready.",
                image: "restaurant setup and menu upload interface",
              },
              {
                step: "02",
                title: "Go Live",
                description:
                  "Once approved, your restaurant goes live on our platform. Start receiving orders from customers in your delivery area.",
                image: "restaurant going live with first orders coming in",
              },
              {
                step: "03",
                title: "Grow & Succeed",
                description:
                  "Track your performance, optimize your offerings, and watch your business grow with our analytics and support.",
                image: "restaurant owner viewing growth analytics dashboard",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <Image
                    src={`/placeholder.svg?height=200&width=300&query=${step.image}`}
                    alt={step.title}
                    width={300}
                    height={200}
                    className="w-full rounded-lg shadow-md"
                  />
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Partners Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from successful restaurant owners who have transformed their
              business with us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                restaurant: "Mama's Kitchen",
                rating: 5,
                text: "Since joining the platform, our revenue has increased by 60%. The support team is amazing and the dashboard makes everything so easy to manage.",
                image: "female restaurant owner smiling",
              },
              {
                name: "Michael Chen",
                restaurant: "Dragon Palace",
                rating: 5,
                text: "The analytics helped us understand our customers better. We've optimized our menu based on the data and seen incredible results.",
                image: "male asian restaurant owner in kitchen",
              },
              {
                name: "Amara Okafor",
                restaurant: "Spice Route",
                rating: 5,
                text: "Best decision we made for our business. The platform is user-friendly and we've reached customers we never could have before.",
                image: "female african restaurant owner with traditional food",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center">
                      <Image
                        src={`/placeholder.svg?height=50&width=50&query=${testimonial.image}`}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {testimonial.restaurant}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Grow Your Restaurant?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Join thousands of successful restaurants already partnering with
              us. Start your journey today and watch your business thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                onClick={() =>
                  window.open(
                    "https://vendor.betadayapp.com/auth/signup",
                    "_blank"
                  )
                }
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-6 text-lg"
                onClick={() =>
                  window.open(
                    "https://vendor.betadayapp.com/auth/login",
                    "_blank"
                  )
                }
              >
                Partner Login
              </Button>
            </div>
            <p className="text-orange-100 mt-6">
              ✓ Free setup • ✓ No monthly fees • ✓ 24/7 support
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
