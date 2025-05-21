/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/cart-context";
import Image from "next/image";
import Pack from "./Pack";
import { formatPrice } from "@/lib/utils";
import { useAddress } from "@/contexts/address-context";
import AddressSearchModal from "@/components/modal/address-search-modal";
import JoinWaitlistModal from "@/components/modal/join-waitlist-modal";
import { useAuth } from "@/contexts/auth-context";
import LoginModal from "@/components/auth/login-modal";
import PaymentOptionsModal from "@/components/modal/payment-options-modal";
import OnlinePaymentOptionsModal from "@/components/modal/online-payment-options-modal";
import PromoCodeModal from "@/components/modal/PromoCodeModal";
import RateOrderModal from "@/components/modal/RateOrderModal";
import ReceiptModal from "@/components/modal/receipt-modal";
import { toast } from "react-toastify";
import { getAuthToken } from "@/utils/auth";
import { useBusinessStore } from "@/stores/business-store";
import { validate } from "uuid";
import PaystackInlineCheckout from "@/components/payment/PaystackInlineCheckout";

interface CartProps {
  onClose?: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const token = getAuthToken();
  const { businessInfo } = useBusinessStore();
  const { state, dispatch } = useCart();
  const {
    address: contextAddress,
    isAddressValid,
    isLoading,
    error,
    setAddress,
    setLocationDetails,
    locationDetails,
    coordinates,
  } = useAddress();
  const { isAuthenticated, user } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [undeliverableAddress, setUndeliverableAddress] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOnlinePaymentModalOpen, setIsOnlinePaymentModalOpen] =
    useState(false);
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false);
  const [isRateOrderModalOpen, setIsRateOrderModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
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
  const [showDeliveryTextarea, setShowDeliveryTextarea] = useState<boolean[]>(
    []
  );
  const [showVendorTextarea, setShowVendorTextarea] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [paymentMethodError, setPaymentMethodError] = useState<string | null>(
    null
  );
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [localGovernmentId, setLocalGovernmentId] = useState<string | null>(
    null
  );
  const [paystackConfig, setPaystackConfig] = useState<{
    reference: string;
    email: string;
    amount: number;
    publicKey: string;
    channels?: string[];
    label?: string;
    metadata?: {
      custom_fields: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
    embed?: boolean;
  } | null>(null);

  const cartRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const paymentMethodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      console.warn(
        "Paystack public key is not available in environment variables"
      );
    } else {
      console.log(
        "Paystack public key is available:",
        paystackKey.substring(0, 5) + "..."
      );
    }
  }, []);

  useEffect(() => {
    const handleAddressChange = (event: CustomEvent) => {
      const { address, coordinates, locationDetails } = event.detail;
      setAddress(address, {
        coordinates,
        locationDetails,
        source: "manual",
      });
      setAddressError(null);
      setFeeError(null);
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

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  // Fetch localGovernmentId when cart changes or address is set
  useEffect(() => {
    const fetchLocalGovernmentId = async () => {
      if (
        !locationDetails.localGovernmentId &&
        contextAddress &&
        locationDetails.localGovernment
      ) {
        try {
          const queryParams = new URLSearchParams({
            address: contextAddress,
            city: locationDetails.locality || "",
            state: locationDetails.state || "",
          });
          const response = await fetch(
            `${baseUrl}/api/delivery-zone/local-government?${queryParams.toString()}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Failed to fetch local government data"
            );
          }

          const data = await response.json();
          if (data.localGovernmentId && data.isDeliverable) {
            setLocalGovernmentId(data.localGovernmentId);
            setLocationDetails({
              ...locationDetails,
              localGovernmentId: data.localGovernmentId,
              localGovernment:
                data.localGovernmentName || locationDetails.localGovernment,
            });
          } else {
            setFeeError("This address is not in a deliverable zone");
            toast.error("This address is not in a deliverable zone");
            setIsAddressModalOpen(true); // Prompt address change
          }
        } catch (error: any) {
          console.error("Error fetching localGovernmentId:", error);
          setFeeError(error.message || "Failed to verify delivery zone");
          toast.error(error.message || "Failed to verify delivery zone");
          setIsAddressModalOpen(true); // Prompt address change
        }
      } else if (locationDetails.localGovernmentId) {
        setLocalGovernmentId(locationDetails.localGovernmentId);
      } else if (
        state.packs.length > 0 &&
        (!contextAddress || !isAddressValid)
      ) {
        setFeeError("Please set a valid delivery address");
        toast.error("Please set a valid delivery address");
        setIsAddressModalOpen(true); // Open address modal if no address
      }
    };

    if (state.packs.length > 0) {
      fetchLocalGovernmentId();
    }
  }, [
    contextAddress,
    isAddressValid,
    locationDetails,
    state.packs,
    baseUrl,
    token,
    setLocationDetails,
  ]);

  // Fetch fees when cart changes or dependencies are available
  useEffect(() => {
    const fetchFees = async () => {
      if (
        !state.packs.length ||
        !isAddressValid ||
        !contextAddress ||
        !businessInfo?.id ||
        !localGovernmentId ||
        !coordinates.latitude ||
        !coordinates.longitude
      ) {
        setDeliveryFee(0);
        setServiceFee(0);
        if (state.packs.length > 0) {
          setFeeError(
            "Missing required information for fee calculation. Please set or change your delivery address."
          );
          setIsAddressModalOpen(true); // Prompt address change
        } else {
          setFeeError(null);
        }
        return;
      }

      try {
        const businessCoordinates = {
          lat: businessInfo.latitude || 6.5244, // Default to Lagos center
          lng: businessInfo.longitude || 3.3792,
        };

        const payload = {
          businessAddress: {
            street: businessInfo.address || "Unknown",
            city: businessInfo.city || "Lagos",
            state: "Lagos",
            coordinates: businessCoordinates,
          },
          deliveryAddress: {
            street: contextAddress,
            city: locationDetails.locality || "Unknown",
            state: locationDetails.state || "Lagos",
            coordinates: {
              lat: coordinates.latitude,
              lng: coordinates.longitude,
            },
          },
          numPacks: state.packs.length,
          orderValue: calculateSubtotal(),
          localGovernmentId,
        };

        const response = await fetch(`${baseUrl}/api/fees/calculate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to calculate fees");
        }

        const data = await response.json();
        if (data.status === "success" && data.data) {
          setDeliveryFee(data.data.deliveryFee || 0);
          setServiceFee(data.data.serviceFee || 0);
          setFeeError(null);
        } else {
          throw new Error("Invalid fee calculation response");
        }
      } catch (error: any) {
        console.error("Error fetching fees:", error);
        setFeeError(error.message || "Failed to calculate delivery fees");
        setDeliveryFee(0);
        setServiceFee(0);
        toast.error(error.message || "Failed to calculate delivery fees");
      }
    };

    if (state.packs.length > 0) {
      fetchFees();
    }
  }, [
    state.packs,
    contextAddress,
    isAddressValid,
    businessInfo,
    localGovernmentId,
    coordinates,
    token,
  ]);

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

  const BROWN_BAG_PRICE = 200;

  const calculateSubtotal = () => {
    const packsTotal = state.packs.reduce((sum, pack) => {
      return (
        sum +
        pack.items.reduce(
          (packSum, item) => packSum + item.price * item.quantity,
          0
        )
      );
    }, 0);
    const brownBagTotal = state.brownBagQuantity * BROWN_BAG_PRICE;
    return packsTotal + brownBagTotal;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount + deliveryFee + serviceFee;
  };

  const getPaymentMethod = (method: string): string => {
    const paymentMethodMap: { [key: string]: string } = {
      Wallet: "wallet",
      "Pay with Card": "card",
      "Pay with Bank Transfer": "bank_transfer",
      "Pay with USSD": "ussd",
      "Pay with QR Code": "qr",
      "Cash on Delivery": "cash_on_delivery",
    };
    const mappedMethod = paymentMethodMap[method];
    if (!mappedMethod) {
      console.error(`Invalid payment method: ${method}`);
      throw new Error(`Invalid payment method: ${method}`);
    }
    console.log(`Payment method: ${method}, Mapped: ${mappedMethod}`);
    return mappedMethod;
  };

  const getSafePaymentMethod = (method: string): string => {
    try {
      return getPaymentMethod(method);
    } catch {
      return "unknown";
    }
  };

  const getOrderItems = () => {
    const orderItems: {
      item_id: string;
      quantity: number;
      type: string;
      pack_id: string;
    }[] = [];
    state.packs.forEach((pack) => {
      pack.items.forEach((item) => {
        if (!validate(item.id)) {
          console.error(
            `Invalid UUID for item ID: ${item.id}. Skipping this item.`
          );
          toast.error(
            `Invalid item ID for ${item.name}. Please try adding it again.`
          );
          return;
        }
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

  const handlePaymentChoose = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      toast.error("Please log in to select a payment method.");
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setPaymentMethodError(null);
    console.log(`Selected payment method: ${method}`);
  };

  const handleChooseMethod = () => {
    if (!selectedPaymentMethod) {
      setPaymentMethodError("Please select a payment method.");
      toast.error("Please select a payment method.");
      return;
    }
    if (selectedPaymentMethod === "Pay Online") {
      setIsPaymentModalOpen(false);
      setIsOnlinePaymentModalOpen(true);
    } else {
      setDisplayedPaymentMethod(selectedPaymentMethod);
      setIsPaymentModalOpen(false);
      setPaymentMethodError(null);
      console.log(`Confirmed payment method: ${selectedPaymentMethod}`);
    }
  };

  const handleGoBack = () => {
    setIsOnlinePaymentModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleOnlinePaymentChoose = (method: string) => {
    setSelectedPaymentMethod(method);
    setDisplayedPaymentMethod(method);
    setIsOnlinePaymentModalOpen(false);
    setPaymentMethodError(null);
    console.log(`Confirmed online payment method: ${method}`);
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
    toast.success(`Promo code ${promoCode} applied! (${discount}% off)`);
  };

  const handleRemovePromo = () => {
    setPromoCodes([]);
    setDiscount(0);
    toast.info("Promo code removed.");
  };

  const isValidPaymentMethod = () => {
    if (
      !displayedPaymentMethod ||
      displayedPaymentMethod === "Choose a payment method"
    ) {
      return false;
    }
    try {
      const method = getPaymentMethod(displayedPaymentMethod);
      return !!method;
    } catch {
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    setCartError(null);
    setAddressError(null);
    setPaymentMethodError(null);
    setFeeError(null);

    if (state.packs.length === 0) {
      setCartError("Cart cannot be empty. Please add items to your cart.");
      toast.error("Cart cannot be empty. Please add items to your cart.");
      if (cartRef.current) {
        cartRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      toast.error("Please log in to place an order.");
      return;
    }

    if (!contextAddress || !isAddressValid || !localGovernmentId) {
      setAddressError("Please set a valid delivery address.");
      toast.error("Please set a valid delivery address.");
      if (addressRef.current) {
        addressRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    if (!isValidPaymentMethod()) {
      setPaymentMethodError("Please select a valid payment method.");
      toast.error("Please select a valid payment method.");
      if (paymentMethodRef.current) {
        paymentMethodRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    if (feeError) {
      toast.error("Unable to calculate delivery fees. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentMethod = getPaymentMethod(displayedPaymentMethod);

      if (paymentMethod === "wallet") {
        const walletResponse = await fetch(`${baseUrl}/api/wallet/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!walletResponse.ok) {
          const errorData = await walletResponse.json();
          throw new Error(
            errorData.message || "Failed to check wallet balance"
          );
        }

        const walletData = await walletResponse.json();
        const balance = walletData.data.balance;
        if (balance < calculateTotal()) {
          throw new Error(
            "Insufficient wallet balance. Please choose another payment method."
          );
        }

        await processOrder("wallet", null);
      } else if (paymentMethod === "cash_on_delivery") {
        await processOrder("cash_on_delivery", null);
      } else {
        const reference = `order_${Date.now()}_${Math.floor(
          Math.random() * 1000000
        )}`;
        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

        let channels: string[] = [];
        switch (paymentMethod) {
          case "card":
            channels = ["card"];
            break;
          case "bank_transfer":
            channels = ["bank_transfer"];
            break;
          case "ussd":
            channels = ["ussd"];
            break;
          case "qr":
            channels = ["qr"];
            break;
          default:
            channels = ["card", "bank_transfer"];
        }

        if (!paystackKey) {
          console.error("Paystack public key is missing!");
          toast.error("Payment configuration error. Please contact support.");
          setIsSubmitting(false);
          return;
        }

        setPaystackConfig({
          reference,
          email: user?.email || "customer@example.com",
          amount: calculateTotal() * 100,
          publicKey: paystackKey,
          channels,
          label: `Order from ${businessInfo?.name || "BetaDay"}`,
          metadata: {
            custom_fields: [
              {
                display_name: "Originally Selected Method",
                variable_name: "originally_selected_method",
                value: paymentMethod,
              },
            ],
          },
        });
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      const errorMessage =
        error.message || "Failed to process payment. Please try again.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  const processOrder = async (
    paymentMethod: string,
    transactionRef: string | null
  ) => {
    try {
      const city =
        locationDetails?.locality ||
        locationDetails?.localGovernment ||
        "Unknown";
      const state = locationDetails?.state || "Unknown";

      console.log("Using location details for order:", { city, state });
      console.log(
        `Processing order with payment method: ${paymentMethod}, transaction ref: ${transactionRef}`
      );

      let paymentStatus = "pending";

      if (paymentMethod === "wallet") {
        paymentStatus = "completed";
      } else if (paymentMethod === "cash_on_delivery") {
        paymentStatus = "pending";
      } else if (transactionRef) {
        paymentStatus = "completed";
      }

      const orderPayload = {
        userId: user?.id,
        businessId: businessInfo?.id || "unknown",
        items: getOrderItems(),
        totalAmount: calculateTotal(),
        deliveryAddress: {
          street: contextAddress,
          city: city,
          state: state,
          localGovernmentId,
        },
        deliveryInstructions,
        vendorInstructions,
        promo_codes: promoCodes,
        paymentDetails: {
          method: paymentMethod,
          status: paymentStatus,
          transactionId: transactionRef,
          paymentDate: new Date(),
        },
        sendReceipt: true,
        deliveryFee,
        serviceFee,
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
      console.log("Order placed successfully:", orderData);

      if (
        orderData &&
        orderData.data &&
        orderData.data.order &&
        orderData.data.order.id
      ) {
        const newOrderId = orderData.data.order.id;
        setOrderId(newOrderId);

        if (paymentMethod === "wallet") {
          toast.success(
            "Order placed successfully! Payment completed using your wallet balance."
          );
        } else if (paymentMethod === "cash_on_delivery") {
          toast.success(
            "Order placed successfully! You'll pay when your order is delivered."
          );
        } else {
          toast.success("Order placed successfully! Payment completed.");
        }

        dispatch({ type: "CLEAR_CART" });

        if (onClose) {
          onClose();
        }

        try {
          await fetchOrderDetails(newOrderId);
          setIsReceiptModalOpen(true);
        } catch (error) {
          console.error(
            "Failed to fetch order details, using fallback:",
            error
          );
          setIsReceiptModalOpen(true);
        }
      } else {
        console.error("Order ID not found in response:", orderData);
        toast.success(
          "Order placed successfully, but order details are incomplete."
        );
        dispatch({ type: "CLEAR_CART" });

        if (onClose) {
          onClose();
        }
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
      setPaystackConfig(null);
    }
  };

  const handlePaystackSuccess = (reference: {
    reference: string;
    transaction?: any;
    message?: string;
  }) => {
    console.log("Payment successful. Reference:", reference);

    let paymentMethod = getPaymentMethod(displayedPaymentMethod);

    if (reference.transaction && reference.transaction.channel) {
      const paystackChannel = reference.transaction.channel;
      console.log("Paystack payment channel:", paystackChannel);

      const channelMap: { [key: string]: string } = {
        card: "card",
        bank_transfer: "bank_transfer",
        ussd: "ussd",
        qr: "qr",
        bank: "bank_transfer",
        mobile_money: "mobile_money",
      };

      if (channelMap[paystackChannel]) {
        paymentMethod = channelMap[paystackChannel];
        console.log(
          `Updated payment method from Paystack response: ${paymentMethod}`
        );
      }
    }

    processOrder(paymentMethod, reference.reference);
  };

  const handlePaystackClose = () => {
    console.log("Payment closed");
    setIsSubmitting(false);
    setPaystackConfig(null);
    toast.info("Payment cancelled. You can try again when ready.");
  };

  const handleSaveForLater = async () => {
    setCartError(null);

    if (state.packs.length === 0) {
      setCartError("Cart cannot be empty. Please add items to your cart.");
      toast.error("Cart cannot be empty. Please add items to your cart.");
      if (cartRef.current) {
        cartRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      toast.error("Please log in to save your cart.");
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
      toast.success("Cart saved for later successfully!");
      dispatch({ type: "CLEAR_CART" });

      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1500);
    } catch (error: any) {
      console.error("Error saving for later:", error);
      toast.error(
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

  const handleReceiptClose = () => {
    setIsReceiptModalOpen(false);
    setOrderId(null);
    setOrderDetails(null);
  };

  const formatOrderForReceipt = () => {
    if (!orderDetails) {
      return {
        id: orderId || "",
        date: new Date().toISOString(),
        items: state.packs.flatMap((pack) =>
          pack.items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
        subtotal: calculateSubtotal(),
        deliveryFee,
        serviceFee,
        discount: discount > 0 ? (calculateSubtotal() * discount) / 100 : 0,
        total: calculateTotal(),
        paymentMethod: getSafePaymentMethod(displayedPaymentMethod),
        deliveryAddress: contextAddress || "",
        transactionRef: "",
        businessName: businessInfo?.name || "BetaDay",
      };
    }

    const items =
      orderDetails.orderItems?.map((item: any) => ({
        id: item.id,
        name: item.name || `Item ${item.id.substring(0, 4)}`,
        quantity: item.quantity,
        price: item.price || 0,
      })) || [];

    return {
      id: orderDetails.id,
      date: orderDetails.created_at || new Date().toISOString(),
      items,
      subtotal: orderDetails.subtotal || calculateSubtotal(),
      deliveryFee: orderDetails.deliveryFee || deliveryFee,
      serviceFee: orderDetails.serviceFee || serviceFee,
      discount:
        orderDetails.discount ||
        (discount > 0 ? (calculateSubtotal() * discount) / 100 : 0),
      total: orderDetails.totalAmount || calculateTotal(),
      paymentMethod:
        orderDetails.paymentMethod ||
        getSafePaymentMethod(displayedPaymentMethod),
      deliveryAddress: orderDetails.deliveryAddress || contextAddress,
      transactionRef: orderDetails.transactionId,
      businessName: businessInfo?.name || "BetaDay",
    };
  };

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
      <div className="h-[calc(100vh-6rem)] bg-white rounded-lg border border-gray-200 flex flex-col">
        <div className="sticky top-0 bg-white z-10">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-[#292d32]">
                {businessInfo?.name || "Your Cart"}
              </h3>
              <button
                onClick={() => dispatch({ type: "ADD_PACK" })}
                className="text-[#ff6600] cursor-pointer border border-gray-200 text-xxs py-1 px-2 rounded-full flex items-center transition duration-300 hover:border-[#ff6600] hover:text-[#ff6600]"
              >
                + Add another pack
              </button>
            </div>
          </div>
          <div ref={addressRef} className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#292d32] truncate-text max-w-[70%]">
                {renderAddressText()}
              </span>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-[#ff6600] text-sm cursor-pointer hover:underline"
              >
                {contextAddress && isAddressValid ? "Change" : "Set"}
              </button>
            </div>
            {addressError && (
              <p className="text-red-500 text-xs mt-1 animate-flash">
                {addressError}
              </p>
            )}
            {feeError && (
              <p className="text-red-500 text-xs mt-1 animate-flash">
                {feeError}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {state.packs.map((pack) => (
              <Pack
                key={pack.id}
                packId={pack.id}
                items={pack.items}
                isActive={pack.id === state.activePackId}
                onAddToThisPack={() =>
                  dispatch({ type: "SET_ACTIVE_PACK", payload: pack.id })
                }
                onDuplicate={() =>
                  dispatch({ type: "DUPLICATE_PACK", payload: pack.id })
                }
                onRemove={() =>
                  dispatch({ type: "REMOVE_PACK", payload: pack.id })
                }
                onUpdateQuantity={(itemId, quantity) =>
                  dispatch({
                    type: "UPDATE_ITEM_QUANTITY",
                    payload: { packId: pack.id, itemId, quantity },
                  })
                }
              />
            ))}

            <div className="py-3 border-t border-b border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <Image
                  src="/icons/paper-bag.svg"
                  alt="Brown bag"
                  width={24}
                  height={24}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#292d32]">
                        Need a brown bag?
                      </p>
                      <p className="text-xs text-gray-500">
                        Package your order in a brown bag for just ₦200.00
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.brownBagQuantity > 0}
                      onChange={(e) => handleBrownBagChange(e.target.checked)}
                      className="rounded-full accent-[#ff6600]"
                    />
                  </div>
                  {state.brownBagQuantity > 0 && (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-[#292d32]">How many bags?</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBrownBagQuantityChange(-1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-[#292d32] hover:bg-gray-300"
                          >
                            −
                          </button>
                          <span className="text-sm text-[#292d32]">
                            {state.brownBagQuantity}
                          </span>
                          <button
                            onClick={() => handleBrownBagQuantityChange(1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#ff6600] rounded-full text-white hover:bg-[#e65c00]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-[#292d32]">
                        {formatPrice(state.brownBagQuantity * BROWN_BAG_PRICE)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 py-4 font-medium text-xs">
              <div ref={paymentMethodRef} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm truncate-text max-w-[70%] ${
                      displayedPaymentMethod === "Choose a payment method"
                        ? "text-[#292d32]"
                        : "text-green-600"
                    }`}
                  >
                    {displayedPaymentMethod}
                  </span>
                  <button
                    onClick={handlePaymentChoose}
                    className="text-[#ff6600] text-sm cursor-pointer hover:underline"
                  >
                    {displayedPaymentMethod === "Choose a payment method"
                      ? "Choose"
                      : "Change"}
                  </button>
                </div>
                {paymentMethodError && (
                  <p className="text-red-500 text-xs animate-flash">
                    {paymentMethodError}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#292d32] truncate-text max-w-[70%]">
                    Promo Code: {promoCodes.length > 0 ? promoCodes[0] : "None"}
                    {discount > 0 && ` (${discount}% off)`}
                  </span>
                  <div className="flex items-center gap-2">
                    {promoCodes.length > 0 && (
                      <button
                        onClick={handleRemovePromo}
                        className="text-red-500 text-sm cursor-pointer hover:underline flex items-center gap-1"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Remove
                      </button>
                    )}
                    <button
                      onClick={() => handlePromoChoose()}
                      className="text-[#ff6600] text-sm cursor-pointer hover:underline"
                    >
                      {promoCodes.length > 0 ? "Change" : "Choose"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#292d32]">
                    Delivery Instructions
                  </span>
                  <button
                    onClick={handleAddDeliveryInstruction}
                    className="text-[#ff6600] text-sm cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add
                  </button>
                </div>
                {showDeliveryTextarea.map((show, index) => (
                  <div key={index} className="mt-2">
                    <textarea
                      value={deliveryInstructions[index] || ""}
                      onChange={(e) =>
                        handleDeliveryInstructionChange(index, e.target.value)
                      }
                      placeholder="e.g., Leave at front door"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <button
                      onClick={() => handleRemoveDeliveryInstruction(index)}
                      className="text-red-500 text-xs mt-1 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#292d32]">
                    Vendor Instructions
                  </span>
                  {!showVendorTextarea && (
                    <button
                      onClick={handleAddVendorInstruction}
                      className="text-[#ff6600] text-sm cursor-pointer hover:underline flex items-center gap-1"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add
                    </button>
                  )}
                </div>
                {showVendorTextarea && (
                  <div className="mt-2">
                    <textarea
                      value={vendorInstructions}
                      onChange={(e) =>
                        handleVendorInstructionChange(e.target.value)
                      }
                      placeholder="e.g., No onions, please"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <button
                      onClick={handleRemoveVendorInstruction}
                      className="text-red-500 text-xs mt-1 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between text-sm font-medium text-[#292d32] mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-[#292d32] mb-2">
                <span>Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-[#292d32] mb-2">
                <span>Service Fee</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 mb-2">
                  <span>Discount ({discount}%)</span>
                  <span>
                    -{formatPrice((calculateSubtotal() * discount) / 100)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#292d32]">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleSaveForLater}
            disabled={isSavingForLater}
            className="w-full mb-2 bg-gray-100 text-[#292d32] py-3 rounded-md font-medium transition-colors duration-200 hover:bg-gray-200 disabled:opacity-50"
          >
            {isSavingForLater ? "Saving..." : "Save for Later"}
          </button>
          {isSubmitting &&
          selectedPaymentMethod &&
          getPaymentMethod(displayedPaymentMethod) !== "wallet" &&
          getPaymentMethod(displayedPaymentMethod) !== "cash_on_delivery" &&
          paystackConfig ? (
            <div className="w-full">
              <p className="text-center text-sm mb-2">
                Please complete your payment with Paystack
              </p>
              <PaystackInlineCheckout
                {...paystackConfig}
                text="Complete Payment"
                onSuccess={handlePaystackSuccess}
                onClose={handlePaystackClose}
                className="w-full bg-[#ff6600] text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-[#e65c00]"
              />
              <button
                onClick={() => {
                  setPaystackConfig(null);
                  setIsSubmitting(false);
                }}
                className="w-full mt-2 bg-gray-100 text-[#292d32] py-3 rounded-md font-medium transition-colors duration-200 hover:bg-gray-200"
              >
                Cancel Payment
              </button>
            </div>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={!isValidPaymentMethod() || isSubmitting || !!feeError}
              className="w-full bg-[#ff6600] text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-[#e65c00] disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          )}
        </div>
      </div>

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
      <PaymentOptionsModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectMethod={handlePaymentMethodSelect}
        selectedMethod={selectedPaymentMethod}
        onChooseMethod={handleChooseMethod}
      />
      <OnlinePaymentOptionsModal
        isOpen={isOnlinePaymentModalOpen}
        onClose={() => setIsOnlinePaymentModalOpen(false)}
        onGoBack={handleGoBack}
        onChooseMethod={handleOnlinePaymentChoose}
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
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={handleReceiptClose}
        order={formatOrderForReceipt()}
      />
    </>
  );
};

export default Cart;
