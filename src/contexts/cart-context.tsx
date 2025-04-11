// contexts/cart-context.tsx
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";
import { getAuthToken } from "@/utils/auth";
import { useBusinessStore } from "@/stores/business-store";

// Export CartItem interface with businessName
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  businessId?: string;
  businessName?: string; // Add businessName
}

interface Pack {
  id: string;
  items: CartItem[];
}

export interface CartState {
  packs: Pack[];
  activePackId: string | null;
  brownBagQuantity: number;
}

type CartAction =
  | { type: "ADD_PACK" }
  | { type: "REMOVE_PACK"; payload: string }
  | { type: "DUPLICATE_PACK"; payload: string }
  | { type: "ADD_ITEM_TO_PACK"; payload: { packId: string; item: CartItem } }
  | { type: "UPDATE_ITEM_QUANTITY"; payload: { packId: string; itemId: string; quantity: number } }
  | { type: "SET_ACTIVE_PACK"; payload: string }
  | { type: "SET_BROWN_BAG_QUANTITY"; payload: number }
  | { type: "CLEAR_CART" }
  | { type: "RESTORE_CART"; payload: CartState }
  | { type: "SAVE_AND_CLEAR_CART" };

const CartContext = createContext<
  { state: CartState; dispatch: React.Dispatch<CartAction> } | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_PACK":
      return {
        ...state,
        packs: [...state.packs, { id: `Pack: ${state.packs.length + 1}`, items: [] }],
        activePackId: `Pack: ${state.packs.length + 1}`,
      };

    case "REMOVE_PACK":
      return {
        ...state,
        packs: state.packs.filter((pack) => pack.id !== action.payload),
        activePackId: state.packs[0]?.id || null,
      };

    case "DUPLICATE_PACK": {
      const packToDuplicate = state.packs.find((pack) => pack.id === action.payload);
      if (!packToDuplicate) return state;
      const newPack = { id: `Pack: ${state.packs.length + 1}`, items: [...packToDuplicate.items] };
      return { ...state, packs: [...state.packs, newPack], activePackId: newPack.id };
    }

    case "ADD_ITEM_TO_PACK": {
      return {
        ...state,
        packs: state.packs.map((pack) =>
          pack.id === action.payload.packId
            ? {
                ...pack,
                items: pack.items.some((item) => item.id === action.payload.item.id)
                  ? pack.items.map((item) =>
                      item.id === action.payload.item.id
                        ? { ...item, quantity: item.quantity + action.payload.item.quantity }
                        : item
                    )
                  : [...pack.items, action.payload.item],
              }
            : pack
        ),
      };
    }

    case "UPDATE_ITEM_QUANTITY": {
      return {
        ...state,
        packs: state.packs
          .map((pack) => {
            if (pack.id === action.payload.packId) {
              if (action.payload.quantity < 1) {
                return { ...pack, items: pack.items.filter((item) => item.id !== action.payload.itemId) };
              }
              return {
                ...pack,
                items: pack.items.map((item) =>
                  item.id === action.payload.itemId ? { ...item, quantity: action.payload.quantity } : item
                ),
              };
            }
            return pack;
          })
          .filter((pack) => pack.items.length > 0),
      };
    }

    case "SET_ACTIVE_PACK":
      return { ...state, activePackId: action.payload };

    case "SET_BROWN_BAG_QUANTITY":
      return { ...state, brownBagQuantity: action.payload };

    case "CLEAR_CART":
      return { packs: [], activePackId: null, brownBagQuantity: 0 };

    case "RESTORE_CART":
      return { ...state, ...action.payload };

    case "SAVE_AND_CLEAR_CART": {
      if (state.packs.length > 0) {
        const { businessInfo } = useBusinessStore.getState();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const token = getAuthToken();

        const payload = {
          source: "web",
          vendor_id: businessInfo?.id,
          cart: state,
        };

        fetch(`${baseUrl}/api/save-for-later`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Failed to save cart");
            return response.json();
          })
          .then(() => toast.success("Cart saved to Saved Items!"))
          .catch((error) => {
            console.error("Error saving cart:", error);
            toast.error("Failed to save cart");
          });
      }
      return { packs: [], activePackId: null, brownBagQuantity: 0 };
    }

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    packs: [],
    activePackId: null,
    brownBagQuantity: 0,
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.packs.forEach((pack: Pack) => {
          dispatch({ type: "ADD_PACK" });
          pack.items.forEach((item: CartItem) => {
            dispatch({ type: "ADD_ITEM_TO_PACK", payload: { packId: pack.id, item } });
          });
        });
        if (parsedCart.brownBagQuantity) {
          dispatch({ type: "SET_BROWN_BAG_QUANTITY", payload: parsedCart.brownBagQuantity });
        }
        if (parsedCart.activePackId) {
          dispatch({ type: "SET_ACTIVE_PACK", payload: parsedCart.activePackId });
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};