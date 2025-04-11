"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
// import Link from "next/link";

import { textGroups } from "@/data/content";
// import OrderDirectly from "./OrderDirectly";
import AddressField from "./AddressField";
// import CurvedDivider from "./curved-divider";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % textGroups.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#fadbbb] pb-20 px-4 sm:px-6 md:px-12 relative pt-32 md:pt-0 ">
      <div className="hidden lg:block mt-24 w-full"></div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-center md:h-auto mt-0 md:mt-20 lg:mt-0 px-4 sm:px-6 lg:px-8">
        {/* Text Section */}
        <div className="order-2 md:order-1 text-center md:text-left">
          {/* Animated Text Container */}
          <div className="relative h-[100px] md:h-[200px] overflow-hidden">
            {textGroups.map((group, index) => (
              <div
                key={index}
                className={`absolute w-full transition-all duration-500 ${
                  index === activeIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <h1 className="text-[#210603] text-4xl sm:text-4xl md:text-4xl lg:text-5xl font-bold leading-snug">
                  <span className="animate-fadeIn">{group.headline}</span>
                  <br />
                  <span className="text-[#f15736] animate-fadeInDelay">
                    {group.subline}
                  </span>
                </h1>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-6 md:mt-8">
            <AddressField />
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center items-center text-center md:block order-1 md:order-2 relative h-48 sm:h-64 md:h-auto md:mt-10 mt-0">
          <Image
            src="/images/beatsnoop.png"
            alt="Food Delivery"
            width={400}
            height={300}
            className="object-contain w-full h-auto max-w-[300px] md:max-w-[400px] mx-auto"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Wave shape */}

      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-[#C6DDB7]"
        style={{
          borderTopLeftRadius: "50% 100%",
          borderTopRightRadius: "50% 100%",
        }}
      ></div>
      {/* <CurvedDivider /> */}
    </section>
  );
}
