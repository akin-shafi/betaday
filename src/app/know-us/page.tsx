/* eslint-disable react/no-unescaped-entities */
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const KnowUsContent = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTeam, setActiveTeam] = useState("01");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isMounted) return;

    const scrollElement = scrollRef.current;
    if (!scrollElement || isPaused) return;

    const interval = setInterval(() => {
      if (scrollElement) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollElement;

        // If we're near the end, go back to the beginning
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollElement.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollElement.scrollBy({ left: 200, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      // Check initial state
      handleScroll();
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [isMounted]);

  const coreValues = [
    {
      title: "Customer First",
      icon: (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full"></div>
          <div className="w-8 h-8 bg-black rounded-full absolute"></div>
        </div>
      ),
    },
    {
      title: "Reliability",
      icon: (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full"></div>
            <div className="absolute inset-3 border-4 border-black rounded-full"></div>
            <div className="absolute inset-6 border-4 border-orange-500 rounded-full"></div>
          </div>
        </div>
      ),
    },
    {
      title: "Transparency",
      icon: (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="w-20 h-20 bg-orange-500 rounded-md rotate-45"></div>
        </div>
      ),
    },
    {
      title: "Operational Excellence",
      icon: (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="w-16 h-16 bg-orange-500 rotate-45 flex items-center justify-center">
            <div className="w-8 h-8 bg-white"></div>
          </div>
        </div>
      ),
    },
    {
      title: "Community Impact",
      icon: (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full"></div>
          <div className="w-16 h-16 bg-orange-500 rounded-full -ml-4"></div>
        </div>
      ),
    },
    {
      title: "Continuous Learning",
      icon: (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="relative w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
            <div className="absolute w-8 h-8 bg-black"></div>
            <div className="absolute w-6 h-6 bg-orange-500 rotate-45"></div>
          </div>
        </div>
      ),
    },
    {
      title: "Innovation",
      icon: (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-black rotate-45 transform translate-x-4"></div>
            <div className="w-16 h-16 bg-orange-500 -rotate-45 transform -translate-y-8"></div>
          </div>
        </div>
      ),
    },
    {
      title: "Adaptability",
      icon: (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="w-20 h-5 bg-orange-500 rounded-full"></div>
          <div className="w-5 h-20 bg-orange-500 rounded-full -ml-[12.5px]"></div>
        </div>
      ),
    },
  ];

  const teamFocusData = [
    {
      id: "01",
      name: "Delivery",
      content:
        "Our Delivery team is the backbone of BetaDay. They are dedicated to ensuring timely, reliable deliveries that exceed customer expectations. With a focus on efficiency, safety, and customer satisfaction, the Delivery team ensures every package reaches its destination promptly. Through continuous training and performance optimization, they represent our brand with professionalism and care on every route.",
    },
    {
      id: "02",
      name: "Technology",
      content:
        "Our Technology team builds the digital infrastructure that powers BetaDay's operations. They are focused on creating intuitive, reliable platforms that connect customers, businesses, and delivery personnel seamlessly. With expertise in route optimization, real-time tracking, and user experience design, they're constantly innovating to make our service faster, more reliable, and easier to use for everyone in our ecosystem.",
    },
    {
      id: "03",
      name: "Customer Experience",
      content:
        "Our Customer Experience team ensures every interaction with BetaDay is positive and memorable. They are committed to understanding customer needs and exceeding expectations at every touchpoint. From order placement to delivery confirmation, they work to create a frictionless journey. Through careful attention to feedback and continuous improvement, they build lasting relationships that turn first-time users into loyal advocates.",
    },
    {
      id: "04",
      name: "Operations",
      content:
        "Our Operations team is the engine that keeps BetaDay running smoothly. They coordinate the complex logistics of our delivery network, optimize resource allocation, and ensure we can scale efficiently. With data-driven decision making and process refinement, they identify bottlenecks and implement solutions that improve our service quality while controlling costs. Their behind-the-scenes work enables us to deliver consistent excellence every day.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-white">
      <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About BetaDay</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Born from a personal frustration with delivery services, BetaDay
            aims to solve local delivery challenges through thoughtful
            operations and technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              The idea for BetaDay came during a challenging personal
              experience. In early 2022, I found myself in urgent need of a
              delivery service but was met with unavailability, unreliability,
              and exorbitant prices. This frustrating experience highlighted a
              gap in the market that needed addressing.
            </p>
            <p className="text-gray-600 mb-4">
              After extensive research, I discovered that while delivery
              companies in other regions were making millions of deliveries
              daily, local options were falling short. The common excuse was
              that "dispatch riders are not reliable," but I believed there had
              to be a better solution.
            </p>
            <p className="text-gray-600 mb-4">
              We initially approached the problem from a purely technical angle,
              but soon realized that operations were the real challenge. Going
              back to first principles, we invested in a small fleet of bikes
              and partnered with two local food vendors for a pilot program.
              Weekly meetings with our riders provided invaluable insights that
              shaped our approach.
            </p>
            <p className="text-gray-600">
              With a clearer understanding of the challenges, we're now focused
              on building a solution that's both efficient and easy to use.
              We're in the early stages of our journey, but we're committed to
              creating a delivery service that truly works for our community.
            </p>
          </div>
          <div className="relative h-[300px]">
            <Image
              src="/images/about-image.jpg"
              alt="BetaDay founder with delivery riders"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Core Values</h2>
            <p className="text-gray-600">What keeps us grounded</p>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex overflow-x-auto pb-6 gap-4 hide-scrollbar"
              style={{ scrollbarWidth: "none" }}
            >
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[200px] bg-orange-100 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {value.icon}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-orange-800">{value.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Team Focus Section (Accordion) */}
        <div className="mb-16 relative">
          <div className="absolute top-4 right-4 md:right-8">
            <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
              <div className="text-yellow-300 text-2xl">★</div>
            </div>
          </div>

          <div className="bg-orange-900 text-white rounded-lg p-8 md:p-12 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-8">Teams.</h2>

              {teamFocusData.map((team) => (
                <div
                  key={team.id}
                  className="mb-4 cursor-pointer"
                  onClick={() => setActiveTeam(team.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-orange-300">{team.id}</span>
                    <h3
                      className={`text-xl font-semibold transition-colors ${
                        activeTeam === team.id
                          ? "text-yellow-400"
                          : "text-white"
                      }`}
                    >
                      {team.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Focus.</h2>

              <div className="bg-orange-100 text-orange-900 p-6 rounded-lg">
                <div className="text-yellow-500 text-2xl mb-4">★</div>
                <p className="leading-relaxed">
                  {
                    teamFocusData.find((team) => team.id === activeTeam)
                      ?.content
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="mb-16">
          <div className="border border-gray-200 rounded-lg p-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Join us.</h2>
              <p className="text-gray-600">Check Out Open Roles</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-10 h-6 bg-orange-500 rounded-full transform rotate-12"></div>
                </div>
              </div>

              <Link
                href="/careers"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
              >
                APPLY NOW <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Link Section */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Find answers to common questions about our services, account
            management, payments, and more in our comprehensive FAQ section.
          </p>
          <Link
            href="/faqs"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            View All FAQs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
};

// Export the dynamically imported component
export default dynamic(() => Promise.resolve(KnowUsContent), {
  ssr: false,
});
