import { create } from "zustand";

interface BusinessInfo {
  name: string;
  id: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
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