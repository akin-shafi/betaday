/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modal/MealSwapModal.tsx
import React, { useEffect, useState } from "react";
import { useMealPlan } from "@/hooks/useMealPlan";
import { Input, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import SlidingModalWrapper from "@/components/SlidingModalWrapper";

interface Meal {
  name: string;
  description: string;
  price: number;
  image?: string; // Already optional, matches useMealPlan.ts
}

interface MealSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMeal: (meal: Meal) => void;
  mealType: "breakfast" | "lunch";
}

const MealSwapModal: React.FC<MealSwapModalProps> = ({
  isOpen,
  onClose,
  onSelectMeal,
  mealType,
}) => {
  const { getAvailableMeals, loading, error } = useMealPlan();
  const [availableMeals, setAvailableMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchMeals = async () => {
      try {
        const response = await getAvailableMeals(mealType);
        setAvailableMeals(response.availableMeals);
        setFilteredMeals(response.availableMeals);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMeals();
  }, [isOpen, mealType, getAvailableMeals]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = availableMeals.filter(
      (meal) =>
        meal.name.toLowerCase().includes(value.toLowerCase()) ||
        meal.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMeals(filtered);
  };

  if (!isOpen) return null;

  const columns = [
    {
      title: "Meal",
      dataIndex: "meal",
      key: "meal",
      render: (_: any, record: Meal) => (
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
            {record.image ? (
              <Image
                src={record.image || "/product-placeholder.png"}
                alt={record.name}
                width={60}
                height={60}
                className="w-14 h-14 object-cover rounded-full"
              />
            ) : (
              <span className="text-gray-500 text-sm flex items-center justify-center h-full">
                No Image
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-[#292d32]">{record.name}</p>
            <p className="text-sm text-gray-500">{record.description}</p>
            <p className="text-sm text-blue-500 underline">Select</p>
          </div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <p className="text-sm text-[#292d32]">₦{price.toLocaleString()}</p>
      ),
    },
  ];

  return (
    // <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    //   <div className="bg-white rounded-xl w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] flex flex-col relative">
    <SlidingModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#292d32]">
            Swap {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal
          </h3>
          <button
            className="text-gray-400 cusrsor-pointer hover:text-gray-600 p-2 bg-white rounded-full shadow-sm"
            onClick={onClose}
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
        </div>
        <Input.Search
          placeholder="Search meals by name or description"
          prefix={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          allowClear
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && <p className="text-center">Loading meals...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && availableMeals.length === 0 && (
          <p className="text-center">No meals available</p>
        )}
        {!loading && !error && filteredMeals.length > 0 && (
          <Table
            columns={columns}
            dataSource={filteredMeals}
            rowKey="name"
            pagination={false}
            onRow={(record) => ({
              onClick: () => onSelectMeal(record),
              className: "cursor-pointer hover:bg-gray-50",
            })}
            className="mb-4"
          />
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          className="w-full py-2 bg-gray-500 text-white rounded-lg"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </SlidingModalWrapper>
    //   </div>
    // </div>
  );
};

export default MealSwapModal;
