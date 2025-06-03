/* eslint-disable @typescript-eslint/no-explicit-any */
// types/paystack.d.ts
declare module "@paystack/inline-js" {
  interface PaystackTransaction {
    reference: string;
    trans?: string;
    status?: string;
    message?: string;
    transaction?: string;
    trxref?: string;
    [key: string]: any; // Allow additional properties
  }

  interface PaystackMetadata {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string | number;
    }>;
  }

  interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference: string;
    metadata?: PaystackMetadata;
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
  }

  class PaystackPop {
    newTransaction(options: PaystackOptions): void;
  }

  // Handle both named and default exports
  export const PaystackPop: new () => PaystackPop;
  export default PaystackPop;
}