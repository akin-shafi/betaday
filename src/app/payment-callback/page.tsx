/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getAuthToken } from "@/utils/auth";
import { useCart } from "@/contexts/cart-context";
import { useAddress } from "@/contexts/address-context";
import { useAuth } from "@/contexts/auth-context";
import { useBusinessStore } from "@/stores/business-store";

const PaymentCallback: React.FC = () => {
  const router = useRouter();
  const { reference } = router.query;
  const { state, dispatch } = useCart();
  const { address: contextAddress, isAddressValid } = useAddress();
  const { user } = useAuth();
  const { businessInfo } = useBusinessStore();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const token = getAuthToken();

  useEffect(() => {
    if (reference) {
      handlePaymentVerification(reference as string);
    }
  }, [reference]);

  const getOrderItems = () => {
    const orderItems: {
      item_id: string;
      quantity: number;
      type: string;
      pack_id: string;
    }[] = [];

    state.packs.forEach((pack) => {
      pack.items.forEach((item) => {
        orderItems.push({
          item_id: item.id,
          quantity: item.quantity,
          type: "menu",
          pack_id: pack.id,
        });
      });
    });

    return orderItems;
  };

  const calculateTotal = () => {
    const subtotal = state.packs.reduce((sum, pack) => {
      return (
        sum +
        pack.items.reduce(
          (packSum, item) => packSum + item.price * item.quantity,
          0
        )
      );
    }, 0);
    const brownBagTotal = state.brownBagQuantity * 200;
    return subtotal + brownBagTotal;
  };

  const handlePaymentVerification = async (reference: string) => {
    try {
      const orderPayload = {
        userId: user?.id,
        businessId: businessInfo?.id || "unknown",
        items: getOrderItems(),
        totalAmount: calculateTotal(),
        deliveryAddress: {
          street: contextAddress,
          city: "Unknown",
          state: "Unknown",
        },
        promo_codes: [],
        paymentDetails: {
          method: "card", // Adjust based on stored method
          status: "completed",
          transactionId: reference,
          paymentDate: new Date(),
        },
      };

      const orderResponse = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const orderData = await orderResponse.json();
      dispatch({ type: "CLEAR_CART" });
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation/${orderData.order.id}`);
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      toast.error(
        error.message || "Payment verification failed. Please try again."
      );
      router.push("/cart");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Verifying payment...</p>
    </div>
  );
};

export default PaymentCallback;
