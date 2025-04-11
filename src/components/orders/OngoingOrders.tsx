// src/components/orders/OngoingOrders.tsx
import React from "react";
import { useOrder } from "@/hooks/useOrder";

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
  status: "Ongoing" | "Delivered";
  deliveryAddress: string;
  deliveredAt?: string;
}

interface OngoingOrdersProps {
  orders?: Order[];
}

const OngoingOrders: React.FC<OngoingOrdersProps> = ({
  orders: propOrders,
}) => {
  const { ongoingOrders, loading, error } = useOrder();
  const ordersToRender = propOrders || ongoingOrders;

  if (loading) {
    return <p className="text-center text-gray-500 py-4">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }

  if (ordersToRender.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">No ongoing orders found.</p>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {ordersToRender.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[#292d32]">
              {order.id}
            </span>
            <span className="text-sm text-gray-500">
              {order.deliveryAddress}
            </span>
          </div>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span className="text-sm text-[#292d32]">
                {item.quantity}x {item.name}
              </span>
              <span className="text-sm text-[#292d32]">
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
            <span className="text-sm font-semibold text-[#292d32]">TOTAL</span>
            <span className="text-sm font-semibold text-[#292d32]">
              ₦{order.totalAmount.toLocaleString()}
            </span>
          </div>
          <button className="text-[#FF6600] text-sm mt-2">
            Click to track your order
          </button>
        </div>
      ))}
    </div>
  );
};

export default OngoingOrders;
