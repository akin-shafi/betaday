/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "login" | "signup" | "otp" | null; // Added "otp" to the union type

interface ModalContextType {
  modalType: ModalType;
  modalProps: any; // To store props like phoneNumber
  openModal: (type: ModalType, props?: any) => void; // Updated to accept props
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<any>({}); // Added state for props

  const openModal = (type: ModalType, props = {}) => {
    setModalType(type);
    setModalProps(props); // Store the props (e.g., phoneNumber)
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps({}); // Clear props when closing
  };

  const value = {
    modalType,
    modalProps, // Include modalProps in the context value
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
