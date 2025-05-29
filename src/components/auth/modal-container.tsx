"use client";

import { useModal } from "@/contexts/modal-context";
import LoginModal from "./login-modal";
import SignupModal from "./signup-modal";
import OTPModal from "./otp-modal";
import ForgotPasswordModal from "./forgot-password-modal";
import ResetPasswordModal from "./reset-password-modal";

export default function ModalContainer() {
  const { modalType, modalProps, closeModal } = useModal();

  if (!modalType) return null;

  return (
    <>
      {modalType === "login" && (
        <LoginModal isOpen={true} onClose={closeModal} {...modalProps} />
      )}
      {modalType === "signup" && (
        <SignupModal isOpen={true} onClose={closeModal} />
      )}
      {modalType === "otp" && (
        <OTPModal
          isOpen={true}
          onClose={closeModal}
          phoneNumber={modalProps.phoneNumber}
          source={modalProps.source}
        />
      )}
      {modalType === "forgot-password" && (
        <ForgotPasswordModal isOpen={true} onClose={closeModal} />
      )}
      {modalType === "reset-password" && (
        <ResetPasswordModal
          isOpen={true}
          onClose={closeModal}
          identifier={modalProps.identifier}
        />
      )}
    </>
  );
}
