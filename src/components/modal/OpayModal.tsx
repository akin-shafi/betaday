/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import { X, CreditCard, Building, Wallet, Phone } from "lucide-react"
import SlidingModalWrapper from "../SlidingModalWrapper"
import { useAuth } from "@/contexts/auth-context"
import { message } from "antd"

interface OpayModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectMethod: (method: string) => void
  onFundWallet: (amount: number) => void
  totalAmount: number
}

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000]

export default function OpayModal({ isOpen, onClose, onSelectMethod, onFundWallet, totalAmount }: OpayModalProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"payment" | "wallet">("payment")
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    {
      id: "opay_card",
      name: "Card",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Pay with debit/credit card",
    },
    {
      id: "opay_bank_transfer",
      name: "Bank Transfer",
      icon: <Building className="h-5 w-5" />,
      description: "Pay via bank transfer",
    },
    {
      id: "opay_wallet",
      name: "Opay Wallet",
      icon: <Wallet className="h-5 w-5" />,
      description: "Pay with your Opay wallet",
    },
    {
      id: "opay_ussd",
      name: "USSD",
      icon: <Phone className="h-5 w-5" />,
      description: "Pay with USSD code",
    },
  ]

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleProceedPayment = async () => {
    if (!selectedMethod) {
      message.error("Please select a payment method")
      return
    }

    setIsProcessing(true)
    try {
      await onSelectMethod(selectedMethod)
    } catch (error) {
      setIsProcessing(false)
    }
  }

  const handleFundWallet = async (amount: number) => {
    if (amount <= 0) {
      message.error("Please enter a valid amount")
      return
    }

    setIsProcessing(true)
    try {
      await onFundWallet(amount)
    } catch (error) {
      setIsProcessing(false)
    }
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setCustomAmount(value)
  }

  return (
    <SlidingModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="relative p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full z-60"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-black">Opay Payment</h2>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-3 font-medium text-center ${
              activeTab === "payment" ? "text-[#FF6600] border-b-2 border-[#FF6600]" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("payment")}
          >
            Pay Now
          </button>
          <button
            className={`flex-1 py-3 font-medium text-center ${
              activeTab === "wallet" ? "text-[#FF6600] border-b-2 border-[#FF6600]" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("wallet")}
          >
            Fund Wallet
          </button>
        </div>

        {activeTab === "payment" ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Amount to pay</p>
              <p className="text-2xl font-bold text-black">₦{totalAmount.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <p className="font-medium text-black">Select payment method</p>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    selectedMethod === method.id
                      ? "border-[#FF6600] bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleSelectMethod(method.id)}
                >
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      selectedMethod === method.id ? "bg-[#FF6600] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-black">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border ${
                      selectedMethod === method.id ? "border-[#FF6600] bg-[#FF6600]" : "border-gray-300"
                    } flex items-center justify-center`}
                  >
                    {selectedMethod === method.id && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleProceedPayment}
              disabled={!selectedMethod || isProcessing}
              className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#e65c00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-offset-2 disabled:opacity-70"
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Current wallet balance</p>
              <p className="text-2xl font-bold text-black">₦{(user?.wallet_balance || 0).toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <p className="font-medium text-black">Quick amounts</p>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleFundWallet(amount)}
                    disabled={isProcessing}
                    className="p-3 border border-gray-200 rounded-lg hover:border-[#FF6600] hover:bg-orange-50 transition-colors"
                  >
                    <p className="font-medium text-black">₦{amount.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-black">Custom amount</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount"
                  className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600]"
                />
              </div>
            </div>

            <button
              onClick={() => handleFundWallet(Number(customAmount))}
              disabled={!customAmount || isProcessing}
              className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#e65c00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-offset-2 disabled:opacity-70"
            >
              {isProcessing ? "Processing..." : "Fund Wallet"}
            </button>
          </div>
        )}
      </div>
    </SlidingModalWrapper>
  )
}
