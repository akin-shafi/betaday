/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";

export default function KnowUsPage() {
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
              src="/about-image.png"
              alt="BetaDay founder with delivery riders"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/icons/mission.png"
                alt="Mission"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To solve the local delivery challenge by building reliable
              operations and technology that serve both businesses and customers
              with equal dedication.
            </p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/icons/vision.png"
                alt="Vision"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To create a delivery ecosystem where reliability is the norm, not
              the exception, and where local businesses can thrive through
              expanded reach and better logistics.
            </p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/icons/values.png"
                alt="Values"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Values</h3>
            <p className="text-gray-600">
              First-principles thinking, operational excellence, continuous
              learning from our riders and partners, and building solutions that
              address real problems rather than perceived ones.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
