"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface AnimatedBannerProps {
  imageUrl: string;
  alt: string;
  href: string;
  delay?: number;
  bgColor?: string;
}

const AnimatedBanner = ({
  imageUrl,
  alt,
  href,
  delay = 0,
  bgColor = "bg-green-800",
}: AnimatedBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={`${bgColor} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all`}
    >
      <Link href={href}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="relative w-full"
        >
          <Image
            src={imageUrl}
            alt={alt}
            width={600}
            height={192}
            className="w-full object-cover"
            priority={delay === 0}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default AnimatedBanner;
