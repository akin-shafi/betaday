import { create } from "zustand";

interface BusinessInfo {
  name: string;
  id: string;
}

interface BusinessState {
  businessInfo: BusinessInfo | null;
  setBusinessInfo: (businessInfo: BusinessInfo) => void;
  clearBusinessInfo: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businessInfo: null,
  setBusinessInfo: (businessInfo: BusinessInfo) => set({ businessInfo }),
  clearBusinessInfo: () => set({ businessInfo: null }),
}));