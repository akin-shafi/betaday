// src/types/order.ts
export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: string;
    userId: string;
    businessId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string; // e.g., "pending", "delivered"
    deliveryAddress: string;
    time:string;
    deliveredAt: string;
  }