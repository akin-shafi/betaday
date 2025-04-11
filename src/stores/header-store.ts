// import { create } from 'zustand';

// interface HeaderStore {
//   isCartOpen: boolean;
//   isShoppingListOpen: boolean;
//   setCartOpen: (open: boolean) => void;
//   setShoppingListOpen: (open: boolean) => void;
//   toggleCart: () => void;
//   toggleShoppingList: () => void;
// }

// export const useHeaderStore = create<HeaderStore>((set) => ({
//   isCartOpen: false,
//   isShoppingListOpen: false,
//   setCartOpen: (open) => set({ isCartOpen: open, isShoppingListOpen: false }),
//   setShoppingListOpen: (open) => set({ isShoppingListOpen: open }),
//   toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isShoppingListOpen: false })),
//   toggleShoppingList: () => set((state) => ({ isShoppingListOpen: !state.isShoppingListOpen })),
// })); 


// stores/header-store.tsx
"use client";
import { create } from "zustand";

interface HeaderStore {
  isCartOpen: boolean;
  isShoppingListOpen: boolean; // Include this from CartModal if needed
  setCartOpen: (open: boolean) => void;
  toggleShoppingList: () => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  isCartOpen: false,
  isShoppingListOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  toggleShoppingList: () => set((state) => ({ isShoppingListOpen: !state.isShoppingListOpen })),
}));