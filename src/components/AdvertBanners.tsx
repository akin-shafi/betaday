// components/AdvertBanners.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const AdvertBanners = () => {
  const banners = [
    {
      imageUrl: "/images/advert-2.png",
      alt: "Beta Combo Offer",
      href: "/offers/special",
      bgColor: "bg-green-800",
      title: "Beta Combo Offer",
      description: "Get 20% off on combo meals this weekend!",
    },
    {
      imageUrl: "/images/advert-1.png",
      alt: "Relay Package Delivery",
      href: "/restaurants/new",
      bgColor: "bg-red-900",
      title: "Relay Package Delivery",
      description: "Fast and reliable delivery for your meals.",
    },
    {
      imageUrl: "/images/advert-3.png",
      alt: "New Restaurant Opening",
      href: "/restaurants/new-opening",
      bgColor: "bg-blue-900",
      title: "New Restaurant Opening",
      description: "Discover Pasta Paradise in your area!",
    },
  ];

  return (
    <div className="mt-2 container mx-auto px-2">
      <motion.div variants={container} initial="hidden" animate="show">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.9} // Small screens: 1.5 slides
          breakpoints={{
            768: {
              slidesPerView: 2, // Large screens: 2 slides
            },
          }}
          autoplay={{
            delay: 3000, // Auto-swipe every 3 seconds
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.href}>
              <Link href={banner.href}>
                <div
                  className={`${banner.bgColor} rounded-lg overflow-hidden shadow-lg transition-all`}
                >
                  <div className="relative w-full">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.alt}
                      width={600}
                      height={192}
                      className="w-full object-cover"
                      priority
                    />
                  </div>
                  {/* <div className="p-4 text-white">
                    <h3 className="font-semibold text-lg md:text-xl lg:text-2xl truncate-text">
                      {banner.title}
                    </h3>
                    <p className="text-sm md:text-base lg:text-lg">
                      {banner.description}
                    </p>
                  </div> */}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
};

export default AdvertBanners;
