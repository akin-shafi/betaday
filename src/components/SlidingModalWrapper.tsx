"use client";

import { useRef, useState, useEffect } from "react";

interface SlidingModalWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function SlidingModalWrapper({
  children,
  isOpen,
  onClose,
}: SlidingModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Touch event handlers for sliding
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
    setCurrentY(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startY === null || !modalRef.current) return;

    const currentTouchY = e.touches[0].clientY;
    const diff = currentTouchY - startY;

    if (diff > 0) {
      setCurrentY(diff);
      modalRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (startY === null || !modalRef.current) return;

    if (currentY > 100) {
      modalRef.current.style.transition = "transform 0.3s ease-out";
      modalRef.current.style.transform = "translateY(100%)";
      setTimeout(() => {
        setIsClosing(true);
        onClose();
      }, 300);
    } else {
      modalRef.current.style.transition = "transform 0.2s ease-out";
      modalRef.current.style.transform = "translateY(0)";
    }

    setStartY(null);
    setCurrentY(0);
  };

  // Handle closing animation when isOpen changes
  useEffect(() => {
    if (!isOpen && modalRef.current) {
      setIsClosing(true);
      modalRef.current.style.transition = "transform 0.3s ease-out";
      modalRef.current.style.transform = "translateY(100%)";
      const timeout = setTimeout(() => {
        setIsClosing(false);
      }, 300); // Match the transition duration
      return () => clearTimeout(timeout);
    } else if (isOpen && modalRef.current) {
      modalRef.current.style.transition = "";
      modalRef.current.style.transform = "translateY(0)";
    }
  }, [isOpen]);

  // Return null only after the closing animation completes
  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-opacity flex items-center justify-center p-4 md:items-center md:justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-md relative md:max-w-md mobile-modal"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute top-2 left-0 right-0 flex justify-center">
          <div className="w-8 h-1 bg-gray-400 rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
