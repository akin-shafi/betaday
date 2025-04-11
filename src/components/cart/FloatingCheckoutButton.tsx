import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";

interface FloatingCheckoutButtonProps {
  onCheckout: () => void;
}

const FloatingCheckoutButton = ({
  onCheckout,
}: FloatingCheckoutButtonProps) => {
  const { state } = useCart();

  // Calculate total items
  const totalItems = state.packs.reduce((total, pack) => {
    return (
      total +
      pack.items.reduce((packTotal, item) => packTotal + item.quantity, 0)
    );
  }, 0);

  // Calculate total price
  const totalPrice = state.packs.reduce((total, pack) => {
    return (
      total +
      pack.items.reduce(
        (packTotal, item) => packTotal + item.price * item.quantity,
        0
      )
    );
  }, 0);

  if (totalItems === 0) return null;

  return (
    <button
      onClick={onCheckout}
      className="fixed bottom-12 left-4 right-4 bg-[#292d32] text-white py-3 px-4 rounded-lg shadow-lg md:hidden flex items-center justify-between"
    >
      <span className="text-sm font-medium">
        Proceed to order {totalItems} {totalItems === 1 ? "item" : "items"}
      </span>
      <span className="font-semibold">{formatPrice(totalPrice)}</span>
    </button>
  );
};

export default FloatingCheckoutButton;
