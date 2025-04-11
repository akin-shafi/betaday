// src/types/mealPlan.ts
export interface Meal {
    name: string;
    description: string;
    price: number;
  }
  
  export interface DailyMeal {
    date: string;
    meal: Meal;
  }
  
  export interface MealPlan {
    breakfast: DailyMeal[];
    lunch: DailyMeal[];
  }
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
  }
  
  export interface CostBreakdown {
    meals: { date: string; mealName: string; price: number }[];
    deliveryFeePerDay: number;
    totalDeliveryFee: number;
    total: number;
  }