"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bike, Clock, MapPin, ShoppingBag, Utensils } from "lucide-react";
import Image from "next/image";

export default function CTASection() {
  const [activeStep, setActiveStep] = useState(0);

  const deliverySteps = [
    {
      icon: Utensils,
      title: "Choose Your Meal",
      description: "Browse through hundreds of restaurants",
      color: "bg-orange-500",
    },
    {
      icon: ShoppingBag,
      title: "Place Your Order",
      description: "Quick and secure checkout process",
      color: "bg-green-500",
    },
    {
      icon: Bike,
      title: "Track Delivery",
      description: "Real-time updates on your order",
      color: "bg-blue-500",
    },
  ];

  const testimonials = [
    {
      text: '"The fastest delivery I\'ve ever experienced!"',
      name: "Sarah J.",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      text: '"Amazing variety of restaurants to choose from!"',
      name: "Michael R.",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      text: '"The tracking feature is so convenient!"',
      name: "Emma L.",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
  ];

  return (
    <section className="bg-[#1A2E20] py-24 px-6 md:px-12 pt-32 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Your Food Journey Starts Here
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Experience the easiest way to get your favorite meals delivered
            right to your doorstep
          </p>
        </motion.div>

        {/* Interactive delivery journey */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {deliverySteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative p-6 rounded-xl bg-white/10 backdrop-blur-sm cursor-pointer
                ${activeStep === index ? "ring-2 ring-white/50" : ""}
              `}
              onClick={() => setActiveStep(index)}
            >
              <div
                className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
              >
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-300">{step.description}</p>

              {/* Connection line */}
              {index < deliverySteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/20" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Live order statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { label: "Active Riders", value: "200+", icon: Bike },
            { label: "Avg. Delivery Time", value: "20 min", icon: Clock },
            { label: "Cities Covered", value: "25+", icon: MapPin },
            { label: "Daily Orders", value: "1000+", icon: ShoppingBag },
          ].map((stat, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
              <stat.icon className="w-6 h-6 text-[#f15736] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 + 1 }}
              className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="text-white font-medium mb-2">
                    {testimonial.text}
                  </p>
                  <p className="text-gray-400 text-sm">{testimonial.name}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-center mt-12"
        >
          <button className="bg-[#0aa83b] text-white px-8 py-4 rounded-full cursor-pointer text-lg font-bold hover:bg-[#0a3e1a] transition-colors duration-300">
            Start Your Order Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
