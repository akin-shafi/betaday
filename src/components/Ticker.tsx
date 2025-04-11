"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Clock,
  FlameIcon as Fire,
  Gift,
  Star,
  Trophy,
  Utensils,
} from "lucide-react";
import { createElement } from "react";

export default function Ticker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Different types of ticker content
  const tickerContent = [
    // Live Order Updates
    {
      type: "order",
      icon: Utensils,
      messages: [
        "John just ordered from Kings Burger 🍔",
        "Sarah received her order in 18 mins ⚡",
        "New restaurant joined: Pasta Paradise 🍝",
      ],
    },
    // Special Offers
    {
      type: "promo",
      icon: Gift,
      messages: [
        "50% OFF on your first order! 🎉",
        "Free delivery weekend is here! 🚀",
        "Buy 1 Get 1 Free on selected items ✨",
      ],
    },
    // Fun Food Facts
    {
      type: "fact",
      icon: Fire,
      messages: [
        "Most ordered dish today: Jollof Rice 🍚",
        "1000+ happy customers served today 😊",
        "Trending: Nigerian Suya 🔥",
      ],
    },
    // Achievements
    {
      type: "achievement",
      icon: Trophy,
      messages: [
        "Just hit 1 million deliveries! 🎊",
        "Rated #1 Food Delivery App 🏆",
        "Now in 25+ cities nationwide 🌍",
      ],
    },
  ];

  // Rotate through different types of content
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerContent.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [tickerContent.length]); // Added tickerContent.length to dependencies

  return (
    <div className="bg-gradient-to-r from-[#ff8533] to-[#ff6600] relative">
      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Live Stats Bar */}
      <div className="hidden md:flex justify-between items-center px-6 py-1 bg-black/10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            <span>Avg. Delivery: 20 min</span>
          </div>
          <div className="flex items-center text-white text-xs">
            <Star className="w-3 h-3 mr-1" />
            <span>4.8/5 Rating</span>
          </div>
          <div className="flex items-center text-white text-xs">
            <Bell className="w-3 h-3 mr-1" />
            <span>100+ Active Orders</span>
          </div>
        </div>
      </div>

      {/* Main Ticker Content */}
      <div className="relative py-3 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center space-x-4"
          >
            <div className="flex items-center">
              {/* Icon for current content type */}
              {createElement(tickerContent[currentIndex].icon, {
                className: "w-5 h-5 text-white mr-2",
              })}

              {/* Rotating messages */}
              <div className="flex space-x-12">
                {tickerContent[currentIndex].messages.map((message, idx) => (
                  <span
                    key={idx}
                    className="text-white text-sm font-medium whitespace-nowrap"
                  >
                    {message}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 5,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </div>

      {/* Interactive Elements */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
        {tickerContent.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? "bg-white w-3" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
