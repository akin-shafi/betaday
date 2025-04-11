// CartSection component
import Cart from "@/components/cart/cart";

interface CartSectionProps {
  isLoading?: boolean;
}

export default function CartSection({ isLoading = false }: CartSectionProps) {
  if (isLoading) {
    return (
      <div className="w-full md:w-1/3 mt-8 md:mt-0 hidden md:block">
        <div className="sticky top-24">
          <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-10 w-full bg-gray-200 rounded mt-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 mt-8 md:mt-0 hidden md:block">
      <div className="sticky top-24">
        <Cart />
      </div>
    </div>
  );
}
