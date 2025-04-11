// hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';

export interface SubCategory {
  name: string;
  image: string;
}

export interface MainCategory {
  name: string;
  image: string;
  subcategories: SubCategory[];
}

export const categories: MainCategory[] = [
  {
    name: "Restaurants",
    image: "/images/restaurant.png",
    subcategories: [
      { name: "Beans Combo", image: "/images/beans.png" },
      { name: "Rice Dishes", image: "/images/rice.png" },
      { name: "Swallow", image: "/images/swallow.png" },
      { name: "Small Chops", image: "/images/small_chops.png" },
      { name: "Fast Meals", image: "/images/fast_meal.png" },
      { name: "Desserts", image: "/images/delicacy.png" },
      { name: "Drinks", image: "/images/drink.png" },
      { name: "Soups", image: "/images/swallow.png" },
    ],
  },
  // {
  //   name: "Pharmacies",
  //   image: "/images/pharmacy.png",
  //   subcategories: [
  //     { name: "Pain Relief", image: "/images/pain_relief.png" },
  //     { name: "Vitamins", image: "/images/vitamins.png" },
  //     { name: "First Aid", image: "/images/first_aid.png" },
  //     { name: "Personal Care", image: "/images/personal_care.png" },
  //     { name: "Prescriptions", image: "/images/prescriptions.png" },
  //   ],
  // },
  // {
  //   name: "Supermarkets",
  //   image: "/images/supermarket.png",
  //   subcategories: [
  //     { name: "Groceries", image: "/images/groceries.png" },
  //     { name: "Beverages", image: "/images/beverages.png" },
  //     { name: "Snacks", image: "/images/snacks.png" },
  //     { name: "Household", image: "/images/household.png" },
  //     { name: "Fresh Produce", image: "/images/produce.png" },
  //   ],
  // },
];

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<MainCategory[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return categories;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};