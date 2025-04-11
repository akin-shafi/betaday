// components/DealsSection.tsx
import Image from "next/image";

export default function DealsSection() {
  return (
    <section className="py-12 px-4 sm:px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
        {/* Image container - reduced width */}
        <div className="w-full lg:w-2/5 xl:w-1/3">
          <Image
            src="/images/package.png"
            alt="Food Bag"
            width={400} // Increased base width
            height={300} // Maintain aspect ratio
            className="object-contain mx-auto max-w-full sm:max-w-[400px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Text container - increased width */}
        <div className="w-full lg:w-3/5 xl:w-2/3 text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#292d32] leading-tight">
            Find <span className="text-[#f15736]">deals</span>,{" "}
            <span className="text-green-600">get delivery</span>, and more from
            our restaurant partners.
          </h2>

          {/* Optional additional text */}
          <p className="mt-4 md:mt-6 text-[#676767] text-sm md:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0">
            Discover exclusive offers and seamless delivery from your favorite
            local restaurants. Enjoy restaurant-quality meals in the comfort of
            your home.
          </p>
        </div>
      </div>
    </section>
  );
}
