// components/RateProductModal.tsx
import React, { useState } from "react";
import { Modal, Rate, Button } from "antd";

interface RateProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
  productName: string;
}

export const RateProductModal: React.FC<RateProductModalProps> = ({
  visible,
  onClose,
  onSubmit,
  productName,
}) => {
  const [rating, setRating] = useState<number>(0);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  return (
    <Modal
      title={`Rate ${productName}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          style={{ backgroundColor: "#FF6600", borderColor: "#FF6600" }}
        >
          Submit
        </Button>,
      ]}
    >
      <div className="flex flex-col items-center">
        <p className="mb-4">How would you rate this product?</p>
        <Rate onChange={setRating} value={rating} />
      </div>
    </Modal>
  );
};
