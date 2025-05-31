/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { getAuthToken } from "@/utils/auth";

export default function PaymentCallbackPage() {
  const token = getAuthToken();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { dispatch } = useCart();

  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "pending"
  >("loading");
  const [message, setMessage] = useState("");
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setStatus("failed");
      setMessage("Invalid payment reference");
      return;
    }

    // Verify payment and create order
    verifyPaymentAndCreateOrder(reference);
  }, [searchParams]);

  const verifyPaymentAndCreateOrder = async (reference: string) => {
    try {
      setStatus("loading");
      setMessage("Verifying your payment...");

      // First verify the payment
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reference,
            provider: "paystack",
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyData.success || !verifyData.data.isSuccessful) {
        setStatus("failed");
        setMessage("Payment verification failed");
        return;
      }

      setMessage("Payment verified! Creating your order...");

      // Get cart data from localStorage or context
      const cartData = JSON.parse(localStorage.getItem("cartData") || "{}");

      if (!cartData.packs || cartData.packs.length === 0) {
        setStatus("failed");
        setMessage("Cart data not found. Please try placing your order again.");
        return;
      }

      // Create the order
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user?.id,
            businessId: cartData.businessId,
            subtotal: cartData.subtotal,
            deliveryFee: cartData.deliveryFee,
            serviceFee: cartData.serviceFee,
            discount: cartData.discount || 0,
            totalAmount: cartData.total,
            paymentMethod: "card",
            paymentProvider: "paystack",
            paymentReference: reference,
            paymentStatus: "paid",
            isPaid: true,
            deliveryAddress: cartData.deliveryAddress,
            deliveryCity: cartData.deliveryCity,
            deliveryState: cartData.deliveryState,
            customerInstructions: cartData.deliveryInstructions?.join("; "),
            vendorInstructions: cartData.vendorInstructions,
            promoCode: cartData.promoCodes?.[0],
            currency: "NGN",
            orderItems: cartData.packs.flatMap((pack: any) =>
              pack.items.map((item: any) => ({
                productId: item.id,
                productName: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity,
                options: item.options || {},
              }))
            ),
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        setStatus("failed");
        setMessage(orderData.message || "Failed to create order");
        return;
      }

      // Success! Clear cart and show success
      setStatus("success");
      setMessage("Order placed successfully!");
      setOrderData(orderData.data);

      // Clear cart from context and localStorage
      dispatch({ type: "CLEAR_CART" });
      localStorage.removeItem("cartData");

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`/payment/success?orderId=${orderData.data.order.id}`);
      }, 3000);
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("failed");
      setMessage("Failed to process your payment. Please contact support.");
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "failed":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "pending":
        return <Clock className="w-16 h-16 text-yellow-500" />;
      default:
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">{getStatusIcon()}</div>

        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === "loading" && "Processing Payment..."}
          {status === "success" && "Payment Successful!"}
          {status === "failed" && "Payment Failed"}
          {status === "pending" && "Payment Pending"}
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === "success" && orderData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 mb-2">
              <strong>Order ID:</strong> {orderData.order.id}
            </p>
            <p className="text-sm text-green-800 mb-2">
              <strong>Amount:</strong> ₦
              {orderData.order.totalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-green-800">
              You will be redirected to track your order in 3 seconds...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <button
              onClick={() =>
                router.push(`/payment/success?orderId=${orderData?.order.id}`)
              }
              className="w-full bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
            >
              View Order Details
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Return to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
