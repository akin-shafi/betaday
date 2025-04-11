"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartState } from "./cart-context";

interface SavedCart {
  id: string;
  restaurantName: string;
  date: string;
  items: CartState;
}

interface ShoppingListState {
  savedCarts: SavedCart[];
}

type ShoppingListAction =
  | { type: "ADD_TO_SHOPPING_LIST"; payload: SavedCart }
  | { type: "REMOVE_FROM_SHOPPING_LIST"; payload: string }
  | { type: "RESTORE_CART"; payload: string };

const ShoppingListContext = createContext<
  | {
      state: ShoppingListState;
      dispatch: React.Dispatch<ShoppingListAction>;
    }
  | undefined
>(undefined);

const shoppingListReducer = (
  state: ShoppingListState,
  action: ShoppingListAction
): ShoppingListState => {
  switch (action.type) {
    case "ADD_TO_SHOPPING_LIST":
      return {
        ...state,
        savedCarts: [...state.savedCarts, action.payload],
      };

    case "REMOVE_FROM_SHOPPING_LIST":
      return {
        ...state,
        savedCarts: state.savedCarts.filter(
          (cart) => cart.id !== action.payload
        ),
      };

    case "RESTORE_CART":
      return {
        ...state,
        savedCarts: state.savedCarts.filter(
          (cart) => cart.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(shoppingListReducer, {
    savedCarts: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      const parsedSaved = JSON.parse(saved);
      parsedSaved.savedCarts.forEach((cart: SavedCart) => {
        dispatch({ type: "ADD_TO_SHOPPING_LIST", payload: cart });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(state));
  }, [state]);

  return (
    <ShoppingListContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error(
      "useShoppingList must be used within a ShoppingListProvider"
    );
  }
  return context;
};
