"use client";
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { fetchProductCategories } from "@/hooks/useProducts";

interface CategoryFilterProps {
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState<{ name: string }[]>([
    { name: "All" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await fetchProductCategories(true); // Set isPredefined to true
        const formattedCategories = [
          { name: "All" },
          ...fetchedCategories.map((cat: { name: string }) => ({
            name: cat.name,
          })),
        ];
        setCategories(formattedCategories);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mb-0">
      <Tabs
        activeKey={selectedCategory || "All"}
        onChange={(key) => onCategoryChange(key === "All" ? undefined : key)}
        type="line" // Underline style
        items={categories.map((category) => ({
          key: category.name,
          label: category.name,
        }))}
        tabBarStyle={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          display: "flex",
          flexWrap: "nowrap",
        }}
        className="custom-tabs"
      />
    </div>
  );
};
