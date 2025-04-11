import { Clock, Star, ThumbsUp, Trophy, Users } from "lucide-react";
// import Image from "next/image";
import { AppStoreIcon, GooglePlayIcon } from "./icons";

export default function AppShowcaseSection() {
  const features = [
    {
      icon: Star,
      title: "4.8/5 Rating",
      description: "From 10k+ Reviews",
      color: "bg-yellow-500",
      stats: "95% Satisfaction",
    },
    {
      icon: Clock,
      title: "20 Min Average",
      description: "Delivery Time",
      color: "bg-[#f15736]",
      stats: "Fast Delivery",
    },
    {
      icon: Users,
      title: "100+ Users",
      description: "Trust Our Service",
      color: "bg-blue-500",
      stats: "Growing Community",
    },
  ];

  return (
    <section className="py-12 px-6 md:px-12 bg-white border border-[#d9d9d9] mx-6 md:mx-12 rounded-lg relative -mb-16 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#292d32] mb-4">
            Why People Love Our App
          </h2>
          <p className="text-[#676767]">
            Join millions of satisfied customers who trust Palapolo for their
            food delivery needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-b from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div
                className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-[#292d32] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#676767] text-sm mb-4">
                {feature.description}
              </p>

              <div className="mt-auto">
                <div className="flex items-center justify-center space-x-2">
                  <ThumbsUp className="w-4 h-4 text-[#f15736]" />
                  <span className="text-sm font-medium text-[#292d32]">
                    {feature.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-[#f15736]" />
            <div>
              <p className="font-bold text-[#292d32]">#1 Food Delivery App</p>
              <p className="text-sm text-[#676767]">In Your Region</p>
            </div>
          </div>

          <div>
            <div className="text-center mb-4">Mobile app Coming Soon...</div>
            <div className="flex items-center gap-4">
              <div className="bg-black text-white rounded-xl px-6 py-2 flex items-center gap-2">
                <GooglePlayIcon className="h-5 w-5" />
                <div className="">
                  <p className="text-xs">Download on the</p>
                  <p className="font-bold">App Store</p>
                </div>
              </div>

              <div className="bg-black text-white rounded-xl px-6 py-2 flex items-center gap-2">
                <AppStoreIcon className="h-5 w-5" />
                <div className="">
                  <p className="text-xs">GET IT ON</p>
                  <p className="font-bold">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
