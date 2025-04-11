// src/components/orders/DeliveredOrders.tsx
import React from "react";
import { CheckCircle } from "lucide-react";
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

interface DeliveredOrdersProps {
  orders?: Order[];
}

const DeliveredOrders: React.FC<DeliveredOrdersProps> = ({
  orders: propOrders,
}) => {
  const { deliveredOrders, loading, error } = useOrder();
  const ordersToRender = propOrders || deliveredOrders;

  const handleRateOrder = (orderId: string) => {
    console.log(`Rate order ${orderId}`);
    // Implement rating logic here
  };

  const handleReorder = (orderId: string) => {
    console.log(`Reorder ${orderId}`);
    // Implement reorder logic here
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-4">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }

  if (ordersToRender.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">
        No delivered orders found.
      </p>
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
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-[#10B981]" />
            <span className="text-sm text-[#10B981]">
              Delivered on {order.deliveredAt}
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
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleRateOrder(order.id)}
              className="flex-1 py-2 bg-gray-100 text-[#292d32] text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Rate Order
            </button>
            <button
              onClick={() => handleReorder(order.id)}
              className="flex-1 py-2 bg-[#FF6600] text-white text-sm rounded-lg hover:bg-[#E65C00] transition-colors"
            >
              Reorder
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveredOrders;
