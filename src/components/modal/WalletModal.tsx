/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";
import { getSessionToken } from "@/utils/session";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WalletBalance {
  balance: number;
  formattedBalance: string;
  currency: string;
  lastUpdated: string;
}

interface DvaDetails {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  reference: string;
  description: string;
  createdAt: string;
  status: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null
  );
  const [dvaDetails, setDvaDetails] = useState<DvaDetails | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fundingMethod, setFundingMethod] = useState<"dva" | "card" | null>(
    null
  );
  const [fundingAmount, setFundingAmount] = useState("");
  const { user } = useAuth();
  const userId = user?.id;
  const token = getSessionToken();
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";

  useEffect(() => {
    if (isOpen && userId && token) {
      fetchWalletData();
    }
  }, [isOpen, userId, token]);

  const fetchWalletData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch wallet balance
      const balanceResponse = await fetch(`${API_URL}/api/wallet/balance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!balanceResponse.ok) {
        const errorData = await balanceResponse.json();
        throw new Error(errorData.message || "Failed to fetch wallet balance");
      }
      const balanceData: ApiResponse<WalletBalance> =
        await balanceResponse.json();
      setWalletBalance(balanceData.data);

      // Fetch DVA details
      const dvaResponse = await fetch(`${API_URL}/api/wallet/dva-details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!dvaResponse.ok) {
        const errorData = await dvaResponse.json();
        throw new Error(errorData.message || "Failed to fetch DVA details");
      }
      const dvaData: ApiResponse<DvaDetails> = await dvaResponse.json();
      setDvaDetails(dvaData.data);

      // Fetch transactions
      const transactionsResponse = await fetch(
        `${API_URL}/api/wallet/transactions?page=1&limit=5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!transactionsResponse.ok) {
        const errorData = await transactionsResponse.json();
        throw new Error(errorData.message || "Failed to fetch transactions");
      }
      const transactionsData: ApiResponse<{ transactions: Transaction[] }> =
        await transactionsResponse.json();
      setTransactions(transactionsData.data.transactions);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load wallet data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateFunding = async () => {
    if (!fundingAmount && fundingMethod === "card") {
      toast.error("Please enter an amount");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/wallet/topup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: fundingMethod === "card" ? Number(fundingAmount) : undefined,
          email: user?.email,
          provider: "paystack",
          method: fundingMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initiate funding");
      }

      const responseData: ApiResponse<any> = await response.json();

      if (fundingMethod === "dva") {
        setDvaDetails(responseData.data);
        toast.success("DVA details retrieved. Please make a bank transfer.");
      } else if (fundingMethod === "card") {
        // Redirect to payment URL for Paystack
        window.location.href = responseData.data.authorization_url;
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to initiate funding";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setFundingMethod(null);
      setFundingAmount("");
    }
  };

  const handleCopy = () => {
    if (dvaDetails?.accountNumber) {
      navigator.clipboard.writeText(dvaDetails.accountNumber).then(() => {
        setCopied(true);
        toast.success("Account number copied!");
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-end"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-[480px] bg-white h-full fixed top-0 right-0 md:w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-full overflow-y-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-lg font-semibold text-[#292d32]">
                    Wallet
                  </h2>
                </div>
                <button
                  onClick={() => setFundingMethod("dva")}
                  className="text-[#00A343] text-sm font-medium"
                  disabled={loading}
                >
                  Add Money
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              )}

              {/* Available Balance */}
              {!loading && walletBalance && (
                <div className="p-4">
                  <div className="bg-black text-white rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm">Available Balance</p>
                      <p className="text-2xl font-semibold">
                        {walletBalance.formattedBalance}
                      </p>
                    </div>
                    <ChevronRight size={24} className="text-white" />
                  </div>
                </div>
              )}

              {/* Virtual Account */}
              {!loading && dvaDetails && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-[#00A343] rounded-full"></span>
                    <p className="text-sm text-gray-500">
                      Fund wallet with your virtual account number
                    </p>
                  </div>
                  <div className="flex justify-between items-center bg-[#E5E5FF] rounded-lg p-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {dvaDetails.bankName}
                      </p>
                      <p className="text-lg font-semibold text-[#292d32]">
                        {dvaDetails.accountNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dvaDetails.accountName}
                      </p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 bg-[#6666FF] text-white rounded-lg px-3 py-1 text-sm"
                      disabled={loading}
                    >
                      <Copy size={16} />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Funding Form */}
              {fundingMethod && (
                <div className="p-4 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-[#292d32] mb-2">
                    Fund Wallet
                  </h4>
                  <div className="flex flex-col gap-4">
                    <select
                      value={fundingMethod}
                      onChange={(e) =>
                        setFundingMethod(e.target.value as "dva" | "card")
                      }
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="dva">Bank Transfer (DVA)</option>
                      <option value="card">Credit/Debit Card</option>
                    </select>
                    {fundingMethod === "card" && (
                      <input
                        type="number"
                        value={fundingAmount}
                        onChange={(e) => setFundingAmount(e.target.value)}
                        placeholder="Enter amount (NGN)"
                        className="p-2 border border-gray-200 rounded-lg"
                      />
                    )}
                    <button
                      onClick={handleInitiateFunding}
                      className="bg-[#00A343] text-white rounded-lg p-2 font-medium"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Proceed"}
                    </button>
                    <button
                      onClick={() => setFundingMethod(null)}
                      className="text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction History */}
              {!loading && transactions.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-[#292d32] mb-2">
                    Recent Transactions
                  </h4>
                  <ul className="space-y-2">
                    {transactions.map((tx) => (
                      <li
                        key={tx.id}
                        className="flex justify-between items-center p-2 border-b border-gray-100"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#292d32]">
                            {tx.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p
                          className={`text-sm font-semibold ${
                            tx.type === "credit"
                              ? "text-[#00A343]"
                              : "text-red-500"
                          }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}₦{tx.amount}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Manage Cards (Placeholder) */}
              <div className="p-4 border-t border-gray-200">
                <h4 className="text-md font-semibold text-[#292d32] mb-2">
                  Manage Cards
                </h4>
                <button
                  onClick={() =>
                    toast.info("Add new debit card functionality coming soon!")
                  }
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg w-full text-left hover:bg-gray-100"
                >
                  <span className="text-gray-500">➕</span>
                  <span>Add new debit card</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;
