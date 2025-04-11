"use client";

import { motion } from "framer-motion";

export default function CurvedDivider() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      {/* Base terrain layer */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,96 C200,120 400,40 600,80 C800,120 1000,80 1200,96 L1200,120 L0,120 Z"
          className="fill-[#C6DDB7]"
        />
        <path
          d="M0,100 C150,110 350,70 600,90 C850,110 1050,90 1200,100 L1200,120 L0,120 Z"
          className="fill-[#b8d3a6]"
        />
      </svg>

      {/* Grass elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16">
        <div className="relative max-w-7xl mx-auto">
          {/* Generate multiple grass blades */}
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0"
              style={{
                left: `${i * 4 + Math.random() * 2}%`,
                height: `${12 + Math.random() * 8}px`,
                width: "2px",
                backgroundColor: `hsl(${100 + Math.random() * 20}, ${
                  60 + Math.random() * 20
                }%, ${40 + Math.random() * 20}%)`,
                transformOrigin: "bottom",
              }}
              animate={{
                skewX: [0, 2, 0, -2, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Small decorative elements */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`flower-${i}`}
              className="absolute bottom-1"
              style={{
                left: `${i * 8 + Math.random() * 4}%`,
              }}
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    i % 3 === 0
                      ? "#FFE15D"
                      : i % 3 === 1
                      ? "#FF9EAA"
                      : "#FFFFFF",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17L0 7v10h10zM10 0v10l10-10H10z' fill='%23000000' fillOpacity='0.1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
