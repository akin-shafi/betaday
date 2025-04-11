// src/hooks/useOrder.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { getAuthToken } from "@/utils/auth";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  businessId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  deliveredAt?: string;
}

interface FetchOrdersResponse {
  statusCode: number;
  message: string;
  orders: Order[];
}

interface UseOrdersProps {
  userId: string;
}

// UUID validation regex
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

export const fetchOrders = async ({ userId }: UseOrdersProps): Promise<FetchOrdersResponse> => {
  if (!isValidUUID(userId)) {
    throw new Error("Invalid userId format: must be a valid UUID");
  }

  const token = getAuthToken();
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user/${userId}`;

  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  return response.json();
};

export const useOrder = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery<FetchOrdersResponse, Error>({
    queryKey: ["orders", user?.id],
    queryFn: () => fetchOrders({ userId: user?.id || "" }),
    enabled: !!user?.id && isValidUUID(user?.id || ""),
  });

  // Extract orders from the response
  const orders = (data?.orders || []).map((order) => {
    const isDelivered = order.status.toLowerCase() === "delivered";
    return {
      ...order,
      status: isDelivered ? "Delivered" : "Ongoing",
      deliveredAt: isDelivered ? order.deliveredAt || "Unknown" : undefined,
    };
  });

  // Separate orders into Ongoing and Delivered
  const ongoingOrders = orders.filter((order) => order.status === "Ongoing");
  const deliveredOrders = orders.filter((order) => order.status === "Delivered");

  return {
    ongoingOrders,
    deliveredOrders,
    total: orders.length,
    loading: isLoading,
    error: error?.message || null,
  };
};