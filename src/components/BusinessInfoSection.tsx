// components/BusinessInfoSection.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

type BusinessDetails = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  deliveryOptions: string[];
  image: string | null;
  openingTime: string;
  closingTime: string;
  contactNumber: string;
  rating: string;
  totalRatings: number;
  isActive: boolean;
  businessType: string;
  deliveryTimeRange?: string;
};

interface BusinessInfoSectionProps {
  business: BusinessDetails;
  isLoading?: boolean;
}

export default function BusinessInfoSection({
  business,
  isLoading = false,
}: BusinessInfoSectionProps) {
  const [activeOption, setActiveOption] = useState<string | null>(
    business.deliveryOptions[1] || null
  );

  const foodImage = "/images/food.png";

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="inline-flex items-center mb-6">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] bg-gray-200 rounded-md animate-pulse mb-6" />
        <div className="p-4">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const handleToggle = (option: string) => {
    setActiveOption(option);
  };

  return (
    <div className="w-full">
      <Link
        href="/store"
        className="inline-flex items-center text-gray-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Business
      </Link>

      <div
        className="w-full flex items-end h-[200px] sm:h-[250px] md:h-[300px] bg-cover bg-center rounded-md"
        style={{
          backgroundImage: `url(${business.image || foodImage})`,
        }}
      >
        <div className="p-4 flex items-center">
          <p className="flex items-center justify-center border border-brandmain rounded-md bg-white px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-brandmain mr-2">
            <svg
              width="14"
              height="14"
              className="mr-1"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.10051 9.8995 1.75 7 1.75C4.10051 1.75 1.75 4.10051 1.75 7C1.75 9.8995 4.10051 12.25 7 12.25Z"
                stroke="#0c513f"
                strokeWidth="1.16667"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M7 4.08398V7.00065H9.91667"
                stroke="#0c513f"
                strokeWidth="1.16667"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>{" "}
            {business.deliveryTimeRange || "49 - 59 mins"}
          </p>
        </div>
      </div>

      <div className="py-4 sm:p-2 w-full">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="flex items-baseline">
            <h1 className="font-medium text-xl md:text-[28px] leading-[36px] tracking-tighter mr-4 text-black">
              {business.name}
            </h1>
            <div className="min-w-max">
              <div className="flex items-center">
                <span className="mr-1 font-medium text-black">
                  {business.rating}
                </span>
                <svg
                  width="16"
                  height="16"
                  className="mr-1"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 0L6.12257 3.45492H9.75528L6.81636 5.59017L7.93893 9.04508L5 6.90983L2.06107 9.04508L3.18364 5.59017L0.244718 3.45492H3.87743L5 0Z"
                    fill="#FFD700"
                  />
                </svg>
                <span className="text-xs leading-4 text-gray-500">
                  ({business.totalRatings})
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full md:w-fit bg-gray-100 border-[0.5px] border-orange-500 p-1 rounded-lg mt-4 md:mt-0">
            {business.deliveryOptions.includes("delivery") && (
              <button
                onClick={() => handleToggle("delivery")}
                className={`w-full md:w-[103px] h-8 rounded-lg text-xs leading-3 transition-colors ${
                  activeOption === "delivery"
                    ? "bg-black text-white"
                    : "bg-transparent text-black hover:bg-gray-200"
                } mr-1`}
              >
                Deliver now
              </button>
            )}
            {business.deliveryOptions.includes("pickup") && (
              <button
                onClick={() => handleToggle("pickup")}
                className={`w-full md:w-[103px] h-8 rounded-lg text-xs leading-3 transition-colors ${
                  activeOption === "pickup"
                    ? "bg-black text-white"
                    : "bg-transparent text-black hover:bg-gray-200"
                }`}
              >
                Pickup
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            Opening Hour:{" "}
            <span className="font-medium">{business.openingTime}</span> -{" "}
            <span className="font-medium">{business.closingTime} </span>
          </div>
        </div>
      </div>
    </div>
  );
}
