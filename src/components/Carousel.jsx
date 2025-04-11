import React, { useState, useEffect } from "react";

// Placeholder images (replace with actual image URLs or assets)
const foodImage = "/images/advert-2.png"; // Replace with actual food image
const shipazLogo = "/images/advert-1.png"; // Replace with actual logo
const packageImage = "/images/advert-3.png"; // Replace with actual package image

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      background: "bg-green-900",
      text: "Get betaPackage with good combo from our store",
      image: foodImage,
    },
    {
      background: "bg-red-800",
      text: "Sending goods on a cheaper day.",
      logo: shipazLogo,
      packageImage: packageImage,
    },
  ];

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg">
      {/* Slides with fade effect */}
      <div className="relative h-48">
        {" "}
        {/* Fixed height to contain the slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full ${
              slide.background
            } flex items-center justify-between p-6 transition-opacity duration-500 ease-in-out ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: currentSlide === index ? 10 : 0 }} // Ensure the active slide is on top
          >
            {/* Slide 1: Food Package */}
            {index === 0 && (
              <>
                <div className="text-white text-xl font-semibold w-1/2">
                  {slide.text}
                </div>
                <div className="w-1/2 flex justify-end">
                  <img
                    src={slide.image}
                    alt="Food Package"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              </>
            )}

            {/* Slide 2: Shipaz */}
            {index === 1 && (
              <>
                <div className="flex items-center space-x-4">
                  <img
                    src={slide.logo}
                    alt="Shipaz Logo"
                    className="w-12 h-12"
                  />
                  <div className="text-white text-xl font-semibold">
                    {slide.text}
                  </div>
                </div>
                <div>
                  <img
                    src={slide.packageImage}
                    alt="Package"
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
