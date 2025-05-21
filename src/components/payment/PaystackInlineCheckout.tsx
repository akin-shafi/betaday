/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useRef } from "react";
import Script from "next/script";

interface PaystackInlineCheckoutProps {
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
  onSuccess: (reference: {
    reference: string;
    transaction?: any;
    message?: string;
  }) => void;
  onClose: () => void;
  className?: string;
  text?: string | React.ReactNode; // Allow React node for potential spinner
  disabled?: boolean; // Add disabled prop
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

const PaystackInlineCheckout: React.FC<PaystackInlineCheckoutProps> = ({
  reference,
  email,
  amount,
  publicKey,
  channels,
  label,
  metadata,
  onSuccess,
  onClose,
  className = "",
  text = "Pay Now",
  disabled = false,
}) => {
  const paymentInitiated = useRef(false);

  const initializePayment = () => {
    if (typeof window.PaystackPop === "undefined") {
      console.error("Paystack script not loaded");
      return;
    }

    if (paymentInitiated.current || disabled) return;
    paymentInitiated.current = true;

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount,
      ref: reference,
      channels,
      label,
      metadata,
      embed: true,
      callback: (response: any) => {
        paymentInitiated.current = false;
        onSuccess({
          reference: response.reference,
          transaction: response,
          message: response.message,
        });
      },
      onClose: () => {
        paymentInitiated.current = false;
        onClose();
      },
    });

    handler.openIframe();
  };

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => console.log("Paystack script loaded")}
      />
      <button
        type="button"
        onClick={initializePayment}
        className={className}
        disabled={disabled || paymentInitiated.current}
      >
        {text}
      </button>
    </>
  );
};

export default PaystackInlineCheckout;
