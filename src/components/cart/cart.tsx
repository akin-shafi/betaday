/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/contexts/cart-context";
import Image from "next/image";
import { useAddress } from "@/contexts/address-context";
import AddressSearchModal from "@/components/modal/address-search-modal";
import JoinWaitlistModal from "@/components/modal/join-waitlist-modal";
import { useAuth } from "@/contexts/auth-context";
import LoginModal from "@/components/auth/login-modal";
import PromoCodeModal from "@/components/modal/PromoCodeModal";
import RateOrderModal from "@/components/modal/RateOrderModal";
import { message } from "antd";
// import { getSessionToken } from "@/utils/session"; // Updated import
import { getSessionToken } from "@/utils/session"; // Updated import

import { useBusinessStore } from "@/stores/business-store";
import { useCartFees } from "@/hooks/useCartFees";
// import OrdersModal from "@/components/modal/OrdersModal"; // Adjust the path as needed

import {
  calculateSubtotal,
  calculateTotal,
  getPaymentMethod,
} from "@/utils/cart-utils";
import { useRouter } from "next/navigation";
import CartContent from "./cart-content";
// Replace the static import
// import PaymentContent from "./payment-content";
const PaymentContent = dynamic(() => import("./payment-content"), {
  ssr: false, // Disable server-side rendering
});

interface CartProps {
  onClose?: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const token = getSessionToken();
  const router = useRouter();
  const { businessInfo } = useBusinessStore();
  const { state, dispatch } = useCart();
  const {
    address: contextAddress,
    isAddressValid,
    isLoading,
    error,
    setAddress,
    locationDetails,
    coordinates,
  } = useAddress();
  const { isAuthenticated, user } = useAuth();

  // Modal states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [undeliverableAddress, setUndeliverableAddress] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false);
  const [isRateOrderModalOpen, setIsRateOrderModalOpen] = useState(false);
  // const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false); // New state for OrdersModal

  // Order and payment states
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [displayedPaymentMethod, setDisplayedPaymentMethod] = useState<string>(
    "Choose a payment method"
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState<string[]>(
    []
  );
  const [vendorInstructions, setVendorInstructions] = useState<string>("");
  const [promoCodes, setPromoCodes] = useState<string[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingForLater, setIsSavingForLater] = useState(false);

  // UI states
  const [showDeliveryTextarea, setShowDeliveryTextarea] = useState<boolean[]>(
    []
  );
  const [showVendorTextarea, setShowVendorTextarea] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"cart" | "payment">("cart");

  // Refs for scrolling
  const cartRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);

  // Calculate subtotal and total
  const getSubtotal = useCallback(() => {
    return calculateSubtotal(state.packs, state.brownBagQuantity);
  }, [state.packs, state.brownBagQuantity]);

  // Use the custom hook for fee calculation with simplified parameters
  const { deliveryFee, serviceFee, isCalculatingFees, feeError } = useCartFees(
    state,
    contextAddress,
    locationDetails,
    coordinates,
    businessInfo?.id || "unknown",
    getSubtotal
  );

  // Calculate total with fees
  const getTotal = useCallback(() => {
    return calculateTotal(getSubtotal(), discount, deliveryFee, serviceFee);
  }, [getSubtotal, discount, deliveryFee, serviceFee]);

  // Handle address changes
  useEffect(() => {
    const handleAddressChange = (event: CustomEvent) => {
      const { address, coordinates, locationDetails } = event.detail;
      setAddress(address, {
        coordinates,
        locationDetails,
        source: "manual",
      });
      setAddressError(null);
    };

    document.addEventListener(
      "addressChanged",
      handleAddressChange as EventListener
    );
    return () => {
      document.removeEventListener(
        "addressChanged",
        handleAddressChange as EventListener
      );
    };
  }, [setAddress]);

  // Fetch order details when orderId changes
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      console.log("Order details:", data);

      if (data && data.data && data.data.order) {
        setOrderDetails(data.data.order);
      } else {
        console.error("Invalid order details response:", data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const renderAddressText = () => {
    if (isLoading) return "Getting your location...";
    if (error) return "Set your location";
    if (isAddressValid && contextAddress) return <>{contextAddress}</>;
    return "Set your location";
  };

  const handleJoinWaitlist = (address: string) => {
    setUndeliverableAddress(address);
    setIsAddressModalOpen(false);
    setTimeout(() => setIsWaitlistModalOpen(true), 100);
  };

  const closeWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
    setUndeliverableAddress("");
  };

  const handlePromoChoose = () => {
    if (!isAuthenticated) setIsLoginModalOpen(true);
    else setIsPromoCodeModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      console.log("handlePaymentSuccess called with:", paymentData);
      setIsSubmitting(true);

      // Validate required data
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      if (!businessInfo?.id) {
        throw new Error("Business information not available");
      }

      if (!contextAddress || !isAddressValid) {
        throw new Error("Valid delivery address is required");
      }

      if (state.packs.length === 0) {
        throw new Error("Cart is empty");
      }

      // Prepare order data
      const orderData = {
        userId: user.id,
        businessId: businessInfo.id,
        subtotal: getSubtotal(),
        deliveryFee,
        serviceFee,
        discount: discount > 0 ? (getSubtotal() * discount) / 100 : 0,
        totalAmount: getTotal(),
        paymentMethod: paymentData.paymentMethod || "card",
        paymentProvider: paymentData.provider || "paystack",
        paymentReference: paymentData.reference,
        isPaid: true,
        paymentStatus: "paid",
        deliveryAddress: contextAddress,
        deliveryCity: locationDetails?.localGovernment || "",
        deliveryState: locationDetails?.state || "",
        customerInstructions: deliveryInstructions.join("; "),
        vendorInstructions,
        promoCode: promoCodes[0] || "",
        currency: "NGN",
        orderItems: state.packs.flatMap((pack) =>
          pack.items.map((item) => ({
            itemId: item.id,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          }))
        ),
      };

      // console.log("Creating order with data:", orderData);

      // Create order
      const orderResponse = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      // console.log("Order response status:", orderResponse.status);

      const orderResult = await orderResponse.json();
      // console.log("Order response data:", orderResult);

      if (!orderResponse.ok || !orderResult.data?.order) {
        throw new Error(
          orderResult.message ||
            `Failed to create order: ${orderResponse.status}`
        );
      }

      // Success! Clear cart and set order details
      // setIsOrdersModalOpen(true);
      // console.log("OrdersModal opened, isOrdersModalOpen:", true);
      dispatch({ type: "CLEAR_CART" });
      // setOrderId(orderResult.data.order.id);
      router.push(`/orders?highlight=${orderResult.data.order.id}`);

      // Open OrdersModal immediately

      // Show success message
      message.success("Order placed successfully!");

      // Close the cart modal (if on mobile) after a short delay to ensure OrdersModal is visible
      // if (onClose) {
      //   setTimeout(() => {
      //     onClose();
      //   }, 500); // Short delay to allow OrdersModal to render
      // }
    } catch (error: any) {
      console.error("Error creating order:", error);
      message.error(
        error.message || "Failed to create order. Please try again."
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDeliveryInstruction = () => {
    setShowDeliveryTextarea([...showDeliveryTextarea, true]);
    setDeliveryInstructions([...deliveryInstructions, ""]);
  };

  const handleRemoveDeliveryInstruction = (index: number) => {
    const updatedTextareas = showDeliveryTextarea.filter((_, i) => i !== index);
    const updatedInstructions = deliveryInstructions.filter(
      (_, i) => i !== index
    );
    setShowDeliveryTextarea(updatedTextareas);
    setDeliveryInstructions(updatedInstructions);
  };

  const handleDeliveryInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...deliveryInstructions];
    updatedInstructions[index] = value;
    setDeliveryInstructions(updatedInstructions);
  };

  const handleAddVendorInstruction = () => {
    setShowVendorTextarea(true);
    setVendorInstructions("");
  };

  const handleRemoveVendorInstruction = () => {
    setShowVendorTextarea(false);
    setVendorInstructions("");
  };

  const handleVendorInstructionChange = (value: string) => {
    setVendorInstructions(value);
  };

  const handleBrownBagChange = (checked: boolean) => {
    dispatch({
      type: "SET_BROWN_BAG_QUANTITY",
      payload: checked ? 1 : 0,
    });
  };

  const handleBrownBagQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0, state.brownBagQuantity + delta);
    dispatch({ type: "SET_BROWN_BAG_QUANTITY", payload: newQuantity });
  };

  const handleApplyPromo = (promoCode: string, discount: number) => {
    setPromoCodes([promoCode]);
    setDiscount(discount);
    message.success(`Promo code ${promoCode} applied! (${discount}% off)`);
  };

  const handleRemovePromo = () => {
    setPromoCodes([]);
    setDiscount(0);
    message.info("Promo code removed.");
  };

  const handlePlaceOrder = async () => {
    setCartError(null);
    setAddressError(null);

    if (state.packs.length === 0) {
      setCartError("Cart cannot be empty. Please add items to your cart.");
      message.error("Cart cannot be empty. Please add items to your cart.");
      if (cartRef.current) {
        cartRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      message.error("Please log in to place an order.");
      return;
    }

    if (!contextAddress || !isAddressValid) {
      setAddressError("Please set a valid delivery address.");
      message.error("Please set a valid delivery address.");
      if (addressRef.current) {
        addressRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    // Open unified payment modal
  };

  const handleSaveForLater = async () => {
    setCartError(null);

    if (state.packs.length === 0) {
      setCartError("Cart cannot be empty. Please add items to your cart.");
      message.error("Cart cannot be empty. Please add items to your cart.");
      if (cartRef.current) {
        cartRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      message.error("Please log in to save your cart.");
      return;
    }

    setIsSavingForLater(true);

    const payload = {
      source: "web",
      vendor_id: businessInfo?.id || "unknown",
      cart: state,
    };
    console.log("Save for later payload:", payload);

    try {
      const response = await fetch(`${baseUrl}/api/save-for-later`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save for later");
      }

      const data = await response.json();
      console.log("Cart saved for later:", data);
      message.success("Cart saved for later successfully!");
      dispatch({ type: "CLEAR_CART" });

      // Close the cart modal after saving for later
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1500);
    } catch (error: any) {
      console.error("Error saving for later:", error);
      message.error(
        error.message || "Failed to save for later. Please try again."
      );
    } finally {
      setIsSavingForLater(false);
    }
  };

  const handleRateOrderClose = () => {
    setIsRateOrderModalOpen(false);
    setPromoCodes([]);
    setDiscount(0);
  };

  // Scroll to cartRef when it changes
  if (state.packs.length === 0) {
    return (
      <div
        ref={cartRef}
        className="bg-white border-gray-100 rounded-lg p-6 mt-24"
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/images/takeaway.png"
            alt="Empty cart"
            width={200}
            height={150}
            className="opacity-80"
          />
        </div>
        <h2 className="text-xl text-[#292d32] font-bold text-center mb-4">
          Your cart has no items yet. <br /> Start by adding some!
        </h2>
        {cartError && (
          <p className="text-red-500 text-sm text-center mt-2 animate-flash">
            {cartError}
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      {/* h-[calc(100vh-6rem)] */}
      <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)] pb-10 bg-white rounded-lg border border-gray-200 flex flex-col">

        {/* Tab Content - Now scrollable */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "cart" ? (
            <CartContent
              state={state}
              dispatch={dispatch}
              onProceedToPayment={() => {
                if (state.packs.length === 0) {
                  setCartError(
                    "Cart cannot be empty. Please add items to your cart."
                  );
                  message.error(
                    "Cart cannot be empty. Please add items to your cart."
                  );
                  return;
                }
                if (!isAuthenticated) {
                  setIsLoginModalOpen(true);
                  message.error("Please log in to place an order.");
                  return;
                }
                if (!contextAddress || !isAddressValid) {
                  setAddressError("Please set a valid delivery address.");
                  message.error("Please set a valid delivery address.");
                  return;
                }
                setActiveTab("payment");
              }}
              onSaveForLater={handleSaveForLater}
              isSubmitting={isSubmitting}
              isSavingForLater={isSavingForLater}
              cartError={cartError}
              addressError={addressError}
              deliveryInstructions={deliveryInstructions}
              setDeliveryInstructions={setDeliveryInstructions}
              vendorInstructions={vendorInstructions}
              setVendorInstructions={setVendorInstructions}
              promoCodes={promoCodes}
              discount={discount}
              onPromoChoose={handlePromoChoose}
              onRemovePromo={handleRemovePromo}
              showDeliveryTextarea={showDeliveryTextarea}
              setShowDeliveryTextarea={setShowDeliveryTextarea}
              showVendorTextarea={showVendorTextarea}
              setShowVendorTextarea={setShowVendorTextarea}
              onAddDeliveryInstruction={handleAddDeliveryInstruction}
              onRemoveDeliveryInstruction={handleRemoveDeliveryInstruction}
              onDeliveryInstructionChange={handleDeliveryInstructionChange}
              onAddVendorInstruction={handleAddVendorInstruction}
              onRemoveVendorInstruction={handleRemoveVendorInstruction}
              onVendorInstructionChange={handleVendorInstructionChange}
              onBrownBagChange={handleBrownBagChange}
              onBrownBagQuantityChange={handleBrownBagQuantityChange}
              onAddressModalOpen={() => setIsAddressModalOpen(true)}
              onClose={onClose}
            />
          ) : (
            <PaymentContent
              totalAmount={getTotal()}
              userEmail={user?.email || ""}
              userPhone={user?.phoneNumber}
              userId={user?.id || ""}
              token={token || ""}
              onPaymentSuccess={handlePaymentSuccess}
              onBackToCart={() => setActiveTab("cart")}
              isProcessingOrder={isSubmitting}
            />
          )}
        </div>
      </div>

      {/* Keep all existing modals */}
      <AddressSearchModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onJoinWaitlist={handleJoinWaitlist}
      />
      <JoinWaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={closeWaitlistModal}
        address={undeliverableAddress}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <PromoCodeModal
        isOpen={isPromoCodeModalOpen}
        onClose={() => setIsPromoCodeModalOpen(false)}
        onApplyPromo={handleApplyPromo}
      />
      <RateOrderModal
        isOpen={isRateOrderModalOpen}
        onClose={handleRateOrderClose}
        orderId={orderId || ""}
      />
      {/* <OrdersModal
        isOpenOrder={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        onBack={() => {
          setIsOrdersModalOpen(false);
        }}
        highlightOrderId={orderId} // Pass the orderId as highlight
      /> */}
    </>
  );
};

export default Cart;
