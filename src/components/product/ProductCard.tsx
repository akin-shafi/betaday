import React, { useState } from "react";
import Image from "next/image";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Plus } from "lucide-react";
import { RateProductModal } from "./RateProductModal";
import { Rate } from "antd";

interface ProductCardProps {
  businessName: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  onSelect: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  businessName,
  name,
  description,
  price,
  image,
  onSelect,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(3);

  const handleLike = () => setIsLiked(!isLiked);
  const handleRateSubmit = (newRating: number) => {
    setRating(newRating);
    console.log(`Rated ${name} with ${newRating} stars`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative w-full h-40">
        {image ? (
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-xl">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <button
          onClick={handleLike}
          className="flex items-center justify-center rounded-full cursor-pointer absolute right-[21px] top-[12px] bg-brand-white w-[40px] h-[40px] active:opacity-70"
        >
          {isLiked ? (
            <HeartFilled style={{ color: "#FF6600" }} />
          ) : (
            <HeartOutlined style={{ color: "#FF6600" }} />
          )}
        </button>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500">{businessName}</p>
        <h3 className="text-lg font-semibold text-[#1A2E20] truncate-text">
          {name}
        </h3>
        <p className="text-sm text-gray-600 truncate">{description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-[#FF6600] font-bold">₦{price}</span>
          <button
            onClick={onSelect}
            className="bg-[#FF6600] text-white p-2 rounded-full hover:bg-[#e65c00] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="mt-2 flex items-center">
          <span
            className="text-[#FF6600] cursor-pointer"
            onClick={() => setIsModalVisible(true)}
          >
            <Rate disabled value={rating} style={{ fontSize: 16 }} />
          </span>
          <span className="ml-2 text-sm text-gray-500">({rating})</span>
        </div>
      </div>
      <RateProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleRateSubmit}
        productName={name}
      />
    </div>
  );
};
