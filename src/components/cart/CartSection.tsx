interface BusinessInfo {
  name: string;
  id: string | number;
}

interface CartSectionProps {
  businessInfo: BusinessInfo;
}

export default function CartSection({ businessInfo }: CartSectionProps) {
  return (
    <div className="w-full lg:w-1/3">
      <div className="border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">{businessInfo.name}</h2>
        {/* Add your cart content here */}
      </div>
    </div>
  );
}
