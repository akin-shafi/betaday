// src/hooks/useSavedMealPlans.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSessionToken } from "@/utils/session"; // Updated import

interface Meal {
  name: string;
  description: string;
  price: number;
}

interface DailyMeal {
  date: string;
  day: string;
  meal: Meal;
}

interface SavedMealPlan {
  id: string;
  mealPlan: { breakfast: DailyMeal[]; lunch: DailyMeal[] };
  totalCost: { breakfast: number; lunch: number };
  deliveryFees: { breakfast: number; lunch: number };
  deliveryAddress: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  numberOfPlates: number;
}

interface SavedMealPlansResponse {
  statusCode: number;
  message: string;
  plans: SavedMealPlan[];
}

interface ActivateSavedPlanRequest {
  planId: string;
  paymentMethod: "wallet" | "online";
}

interface ActivateSavedPlanResponse {
  statusCode: number;
  message: string;
  success: boolean;
}

const fetchSavedMealPlans = async (): Promise<SavedMealPlansResponse> => {
  const token = getSessionToken();
  if (!token) {
    throw new Error("No authentication token available. Please log in.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal-plan/saved`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch saved meal plans");
  }

  return response.json();
};

const activateSavedPlan = async (data: ActivateSavedPlanRequest): Promise<ActivateSavedPlanResponse> => {
  const token = getSessionToken();
  if (!token) {
    throw new Error("No authentication token available. Please log in.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal-plan/activate-saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to activate saved plan");
  }

  return response.json();
};

export const useSavedMealPlans = ({ enabled }: { enabled: boolean }) => {
  const savedPlansQuery = useQuery<SavedMealPlansResponse, Error>({
    queryKey: ["savedMealPlans"],
    queryFn: fetchSavedMealPlans,
    enabled, // Only fetch when enabled is true
    retry: (failureCount, error) => {
      // Don't retry on 403 errors
      if (error.message.includes("Unauthorized")) {
        return false;
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });

  const activateMutation = useMutation<ActivateSavedPlanResponse, Error, ActivateSavedPlanRequest>({
    mutationFn: activateSavedPlan,
  });

  return {
    savedPlans: savedPlansQuery.data?.plans || [],
    loading: savedPlansQuery.isLoading || activateMutation.isPending,
    error: savedPlansQuery.error?.message || activateMutation.error?.message || null,
    refetch: savedPlansQuery.refetch,
    activateSavedPlan: activateMutation.mutateAsync,
  };
};