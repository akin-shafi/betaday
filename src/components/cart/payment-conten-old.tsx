/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Wallet, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { message } from "antd";
import { unifiedPaymentService } from "@/services/unifiedPaymentService";

interface PaymentContentProps {
  totalAmount: number;
  userEmail: string;
  userPhone?: string;
  userId: string;
  token: string;
  onPaymentSuccess: (paymentData: any) => void;
  onBackToCart: () => void;
  isProcessingOrder: boolean;
}

interface PaymentProvider {
  id: string;
  name: string;
  logo: React.ReactNode;
  description: string;
  color: string;
}

type PaymentStep =
  | "select"
  | "processing"
  | "success"
  | "failed"
  | "creating_order";

const PaymentContent: React.FC<PaymentContentProps> = ({
  totalAmount,
  userEmail,
  userPhone,
  userId,
  token,
  onPaymentSuccess,
  onBackToCart,
  isProcessingOrder,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customFundAmount, setCustomFundAmount] = useState<string>("");
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("select");
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const paymentProviders: PaymentProvider[] = [
    {
      id: "wallet",
      name: "Wallet",
      logo: (
        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
          <Wallet className="h-5 w-5 text-white" />
        </div>
      ),
      description: "Pay with your wallet balance",
      color: "orange",
    },
    {
      id: "paystack",
      name: "Paystack",
      logo: (
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">PS</span>
        </div>
      ),
      description: "Card, Bank Transfer, USSD",
      color: "blue",
    },
  ];

  const quickFundAmounts = [1000, 2000, 5000, 10000];

  // Helper function to map Paystack channel to our payment method enum
  const mapPaystackChannelToPaymentMethod = (channel: string): string => {
    const channelMap: { [key: string]: string } = {
      card: "paystack_card",
      bank: "paystack_bank",
      bank_transfer: "paystack_bank",
      ussd: "paystack_ussd",
      qr: "paystack_card",
      mobile_money: "paystack_card",
    };
    return channelMap[channel] || "paystack_card";
  };

  useEffect(() => {
    if (userId) {
      fetchWalletBalance();
      setPaymentStep("select");
      setSelectedProvider(null);
      setErrorMessage("");
      setPaymentResult(null);
      setIsProcessing(false);
    }
  }, [userId]);

  const fetchWalletBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const response = await unifiedPaymentService.getWalletBalance(
        userId,
        token
      );
      if (response.success) {
        setWalletBalance(response.data.balance || 0);
      }
    } catch (error: any) {
      console.error("Error fetching wallet balance:", error);
      message.error("Failed to load wallet balance");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleWalletFunding = async (amount: number) => {
    if (typeof window === "undefined") return;

    try {
      setIsProcessing(true);
      setPaymentStep("processing");

      const reference = unifiedPaymentService.generateReference("wallet_fund");

      // Dynamic import with debugging
      const paystackModule = await import("@paystack/inline-js");
      console.log("Paystack module:", paystackModule); // Debug the module structure

      // Try accessing PaystackPop as named or default export
      const PaystackPop = paystackModule.PaystackPop || paystackModule.default;
      if (!PaystackPop) {
        throw new Error("PaystackPop not found in module");
      }

      const popup = new PaystackPop();
      popup.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: userEmail,
        amount: amount * 100,
        currency: "NGN",
        reference: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Funding Type",
              variable_name: "funding_type",
              value: "wallet_funding",
            },
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: userId,
            },
            { display_name: "Amount", variable_name: "amount", value: amount },
          ],
        },
        onSuccess: async (transaction: any) => {
          try {
            const verifyResponse = await unifiedPaymentService.verifyPayment(
              transaction.reference,
              "paystack",
              token
            );

            if (verifyResponse.success && verifyResponse.data.isSuccessful) {
              await unifiedPaymentService.fundWallet(
                {
                  userId,
                  amount,
                  reference: transaction.reference,
                  provider: "paystack",
                  paymentMethod: "paystack_card",
                  email: userEmail,
                  phone: userPhone,
                },
                token
              );

              await fetchWalletBalance();
              message.success(`Wallet funded with ${formatPrice(amount)}`);
              setPaymentStep("select");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            console.error("Wallet funding verification error:", error);
            setErrorMessage("Failed to verify wallet funding");
            setPaymentStep("failed");
          } finally {
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setPaymentStep("select");
          setIsProcessing(false);
        },
      });
    } catch (error: any) {
      console.error("Wallet funding error:", error);
      setErrorMessage(error.message || "Failed to fund wallet");
      setPaymentStep("failed");
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedProvider) {
      message.error("Please select a payment method");
      return;
    }

    if (typeof window === "undefined") return;

    try {
      setIsProcessing(true);
      setPaymentStep("processing");

      if (selectedProvider === "wallet") {
        if (walletBalance < totalAmount) {
          message.error(
            "Insufficient wallet balance. Please fund your wallet first."
          );
          setPaymentStep("select");
          setIsProcessing(false);
          return;
        }

        const reference = unifiedPaymentService.generateReference("wallet_pay");

        setPaymentResult({
          reference,
          paymentMethod: "wallet",
          provider: "wallet",
          amount: totalAmount,
        });

        setPaymentStep("success");
        setIsProcessing(false);
        return;
      }

      if (selectedProvider === "paystack") {
        const reference = unifiedPaymentService.generateReference("pay");
        const paystackModule = await import("@paystack/inline-js");
        console.log("Paystack module:", paystackModule); // Debug the module structure

        // Try accessing PaystackPop as named or default export
        const PaystackPop =
          paystackModule.PaystackPop || paystackModule.default;
        if (!PaystackPop) {
          throw new Error("PaystackPop not found in module");
        }

        const popup = new PaystackPop();
        popup.newTransaction({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
          email: userEmail,
          amount: totalAmount * 100,
          currency: "NGN",
          reference: reference,
          metadata: {
            custom_fields: [
              {
                display_name: "User ID",
                variable_name: "user_id",
                value: userId,
              },
              {
                display_name: "Payment Type",
                variable_name: "payment_type",
                value: "order",
              },
              {
                display_name: "Provider",
                variable_name: "provider",
                value: "paystack",
              },
            ],
          },
          onSuccess: async (transaction: any) => {
            try {
              console.log("Payment successful, transaction:", transaction);

              const verifyResponse = await unifiedPaymentService.verifyPayment(
                transaction.reference,
                "paystack",
                token
              );
              console.log("Verification response:", verifyResponse);

              if (verifyResponse.success && verifyResponse.data.isSuccessful) {
                const paystackChannel =
                  verifyResponse.data.data.channel || "card";
                const mappedPaymentMethod =
                  mapPaystackChannelToPaymentMethod(paystackChannel);

                console.log(
                  "Paystack channel:",
                  paystackChannel,
                  "Mapped to:",
                  mappedPaymentMethod
                );

                setPaymentResult({
                  reference: transaction.reference,
                  paymentMethod: mappedPaymentMethod,
                  provider: "paystack",
                  amount: totalAmount,
                  transactionData: verifyResponse.data.data,
                });

                setPaymentStep("success");
                setIsProcessing(false);
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (error: any) {
              console.error("Payment verification error:", error);
              setErrorMessage("Payment verification failed");
              setPaymentStep("failed");
              setIsProcessing(false);
            }
          },
          onCancel: () => {
            console.log("Payment cancelled by user");
            setPaymentStep("select");
            setIsProcessing(false);
          },
        });
        return;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setErrorMessage(error.message || "Payment failed");
      setPaymentStep("failed");
      setIsProcessing(false);
    }
  };

  const handleCustomFundAmount = () => {
    const amount = Number.parseFloat(customFundAmount);
    if (isNaN(amount) || amount <= 0) {
      message.error("Please enter a valid amount");
      return;
    }
    handleWalletFunding(amount);
  };

  const handleCompleteOrder = async () => {
    if (!paymentResult) {
      console.error("No payment result available");
      setErrorMessage("Payment data not found");
      setPaymentStep("failed");
      return;
    }

    try {
      console.log(
        "Starting order creation with payment result:",
        paymentResult
      );
      setPaymentStep("creating_order");
      setIsProcessing(true);

      onPaymentSuccess(paymentResult);
    } catch (error: any) {
      console.error("Order completion error:", error);
      setErrorMessage(error.message || "Failed to complete order");
      setPaymentStep("failed");
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentStep("select");
    setSelectedProvider(null);
    setErrorMessage("");
    setPaymentResult(null);
    setIsProcessing(false);
  };

  const walletShortfall = Math.max(0, totalAmount - walletBalance);
  const showWalletFunding =
    selectedProvider === "wallet" && walletBalance < totalAmount;
  const hasInsufficientBalance = walletBalance < totalAmount;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {paymentStep === "select" && !isProcessing && (
          <button
            onClick={onBackToCart}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Cart</span>
          </button>
        )}

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="text-lg font-semibold text-[#292d32]">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {paymentStep === "select" && (
          <div className="space-y-3">
            <div>
              <label
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedProvider === "wallet"
                    ? "border-[#ff6600] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-medium">Wallet</span>
                    <div className="text-sm text-gray-500">
                      {isLoadingBalance
                        ? "Loading..."
                        : `Balance: ${formatPrice(walletBalance)}`}
                      {hasInsufficientBalance && (
                        <span className="text-red-500 ml-1">
                          (Insufficient)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentProvider"
                  value="wallet"
                  checked={selectedProvider === "wallet"}
                  onChange={() => handleProviderSelect("wallet")}
                  className="h-4 w-4 text-[#ff6600]"
                />
              </label>

              {showWalletFunding && (
                <div className="mt-3 ml-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-orange-800 mb-3">
                    Fund Wallet (Shortfall: {formatPrice(walletShortfall)})
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {quickFundAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleWalletFunding(amount)}
                        disabled={isProcessing}
                        className="bg-white border border-orange-300 text-orange-700 py-2 px-3 rounded text-sm hover:bg-orange-100 disabled:opacity-50 transition-colors"
                      >
                        Add {formatPrice(amount)}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      value={customFundAmount}
                      onChange={(e) => setCustomFundAmount(e.target.value)}
                      placeholder="Custom amount"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={handleCustomFundAmount}
                      disabled={isProcessing || !customFundAmount}
                      className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 disabled:opacity-50 transition-colors"
                    >
                      Fund
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => handleWalletFunding(walletShortfall)}
                      disabled={isProcessing}
                      className="text-sm text-orange-600 hover:text-orange-800 underline hover:no-underline disabled:opacity-50"
                    >
                      Fund exact shortfall: {formatPrice(walletShortfall)}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {paymentProviders.slice(1).map((provider) => (
              <label
                key={provider.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedProvider === provider.id
                    ? "border-[#ff6600] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {provider.logo}
                  <div>
                    <span className="font-medium">{provider.name}</span>
                    <div className="text-sm text-gray-500">
                      {provider.description}
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentProvider"
                  value={provider.id}
                  checked={selectedProvider === provider.id}
                  onChange={() => handleProviderSelect(provider.id)}
                  className="h-4 w-4 text-[#ff6600]"
                />
              </label>
            ))}
          </div>
        )}

        {paymentStep === "processing" && (
          <div className="text-center py-8">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Payment
            </h3>
            <p className="text-gray-600">
              Please wait while we process your payment...
            </p>
          </div>
        )}

        {paymentStep === "success" && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>

            {paymentResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-green-800 mb-1">
                  <strong>Reference:</strong> {paymentResult.reference}
                </p>
                <p className="text-sm text-green-800 mb-1">
                  <strong>Amount:</strong> {formatPrice(paymentResult.amount)}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Method:</strong> {paymentResult.paymentMethod}
                </p>
              </div>
            )}
          </div>
        )}

        {paymentStep === "creating_order" && (
          <div className="text-center py-8">
            <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Creating Your Order
            </h3>
            <p className="text-gray-600">
              Please wait while we create your order...
            </p>
            <div className="mt-4 text-sm text-gray-500">
              This may take a few seconds
            </div>
          </div>
        )}

        {paymentStep === "failed" && (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              {paymentStep === "failed" && errorMessage.includes("order")
                ? "Order Creation Failed"
                : "Payment Failed"}
            </h3>
            <p className="text-gray-600 mb-6">
              {errorMessage || "Something went wrong with your payment."}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-[#ff6600] text-white py-3 rounded-lg font-medium hover:bg-[#e65c00] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onBackToCart}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        )}
      </div>

      {paymentStep === "select" && !isProcessing && (
        <div className="border-t border-gray-200 p-4 mt-auto">
          <button
            onClick={handlePayment}
            disabled={!selectedProvider || isProcessing}
            className="w-full bg-[#ff6600] text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-[#e65c00] disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : `Pay ${formatPrice(totalAmount)}`}
          </button>
        </div>
      )}

      {paymentStep === "success" && !isProcessing && (
        <div className="border-t border-gray-200 p-4 mt-auto">
          <button
            onClick={handleCompleteOrder}
            disabled={isProcessingOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {isProcessingOrder ? "Creating Order..." : "Complete Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentContent;
