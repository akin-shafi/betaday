"use client";

import type React from "react";
import { useRef } from "react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
// At the top of the file
// import ReactToPrint from 'react-to-print'; // Removed original import
import { useReactToPrint } from "react-to-print";
import { Printer, Download, X, CheckCircle } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  transactionRef?: string;
  businessName: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  // Replace the handlePrint implementation
  const handlePrint = useReactToPrint({
    documentTitle: `Receipt-${order.id}`,
    contentRef: receiptRef,
  });

  const handleDownload = () => {
    // Trigger print dialog which can be saved as PDF
    handlePrint();
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="fixed inset-0 bg-black bg-brand-opacity z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Order Receipt</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Print Receipt"
            >
              <Printer className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Download Receipt"
            >
              <Download className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div ref={receiptRef} className="p-6 bg-white">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-2">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = "none";
                }}
              />
            </div>
            <h1 className="text-xl font-bold">{order.businessName}</h1>
            <div className="flex items-center gap-2 text-green-600 mt-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Order Confirmed</span>
            </div>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{order.id.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date:</span>
              <span>{formatDate(order.date)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="capitalize">
                {order.paymentMethod.replace(/_/g, " ")}
              </span>
            </div>
            {order.transactionRef && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Transaction Ref:</span>
                <span className="text-xs">{order.transactionRef}</span>
              </div>
            )}
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Delivery Address:</span>
              <span className="text-right max-w-[60%]">
                {order.deliveryAddress}
              </span>
            </div>
          </div>

          <h3 className="font-semibold mb-3">Order Items</h3>
          <div className="mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <div className="text-sm text-gray-600">x{item.quantity}</div>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Delivery Fee:</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service Fee:</span>
              <span>{formatPrice(order.serviceFee)}</span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between mt-3 pt-3 border-t font-bold">
              <span>Total:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Thank you for your order!</p>
            <p className="mt-1">
              For any questions, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
