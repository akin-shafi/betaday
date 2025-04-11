"use client";

import Image from "next/image";

export default function KnowUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-white">
      <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About BetaDay</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connecting communities through innovative delivery solutions. Learn
            about our journey, mission, and the team behind BetaDay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded with a vision to revolutionize local delivery services,
              BetaDay has grown from a small startup to a trusted name in the
              industry. Our journey began with a simple idea: making delivery
              services more accessible and efficient for everyone.
            </p>
            <p className="text-gray-600">
              Today, we serve thousands of customers, partner with hundreds of
              businesses, and continue to innovate in the delivery space.
            </p>
          </div>
          <div className="relative h-[300px]">
            <Image
              src="/about-image.png"
              alt="BetaDay Story"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/icons/mission.svg"
                alt="Mission"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To provide fast, reliable, and innovative delivery solutions that
              connect communities.
            </p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/icons/vision.svg"
                alt="Vision"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To become the leading delivery platform that transforms how
              communities connect and thrive.
            </p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/icons/values.svg"
                alt="Values"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Values</h3>
            <p className="text-gray-600">
              Innovation, reliability, community focus, and exceptional service
              in everything we do.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
