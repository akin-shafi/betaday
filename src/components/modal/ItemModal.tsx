// components/modal/ItemModal.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Minus,
  // ChevronDown
} from "lucide-react";
// import { useCart } from "@/contexts/cart-context";

interface ItemModalProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string | null;
    popular?: boolean;
    businessId: string;
    businessName: string; // Add businessName
  };
  onClose: () => void;
  onAddToCart: (item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    businessId: string;
    businessName: string;
  }) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  // const [selectedBread, setSelectedBread] = useState<string>("Agege Bread");
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const breadOptions = [
  //   { name: "Agege Bread", price: 200 },
  //   { name: "Sliced Bread", price: 250 },
  // ];

  const handleAddToCart = () => {
    const priceAsNumber = parseFloat(
      item.price.replace("₦", "").replace(",", "")
    );
    onAddToCart({
      id: item.id,
      name: item.name,
      price: priceAsNumber,
      quantity: quantity,
      image: item.image || "/images/food.png",
      businessId: item.businessId,
      businessName: item.businessName, // Include businessName
    });
    onClose();
  };

  // const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  // const selectBread = (bread: string) => {
  //   setSelectedBread(bread);
  //   setIsDropdownOpen(false);
  // };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto relative p-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full shadow-sm z-10"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <div className="flex flex-col">
          <div className="relative w-full h-48">
            <Image
              src={item.image || "/images/food.png"}
              alt={item.name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-[#292d32]">
                {item.name}
              </h3>
              <p className="text-lg font-semibold text-[#292d32]">
                {item.price}
              </p>
            </div>
            <p className="text-gray-500 text-sm mb-4">{item.description}</p>

            {/* <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[#292d32]">
                  Bread{" "}
                  <span className="text-[#ff6600] text-xs font-semibold">
                    Required
                  </span>
                </label>
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="relative">
                <div className="border border-gray-300 rounded py-2 px-3 mt-1 text-sm text-gray-700 flex justify-between items-center">
                  <span>{selectedBread} ₦{breadOptions.find(opt => opt.name === selectedBread)?.price}</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-md">
                    {breadOptions.map((option, index) => (
                      <div key={index} onClick={() => selectBread(option.name)} className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                        <span>{option.name}</span>
                        <span>₦{option.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div> */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4 text-gray-700" />
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 text-gray-700" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-black cursor-pointer text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base font-medium"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
