// types.ts
import { Product } from "@/services/productService";

export type MenuItem = Product & {
  popular?: boolean;
  businessId?: string;
  businessName?: string;
};