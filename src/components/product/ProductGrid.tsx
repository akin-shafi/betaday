import React from "react";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    image: string | null;
    business: { name: string; id?: string }; // Add id to business
  }>;
  onSelectItem: (item: {
    id: string;
    name: string;
    price: string;
    description: string;
    image: string | null;
    businessId: string;
    businessName: string;
  }) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onSelectItem }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          businessName={product.business.name}
          name={product.name}
          price={product.price}
          description={product.description}
          image={product.image}
          onSelect={() =>
            onSelectItem({
              id: product.id,
              name: product.name,
              price: product.price,
              description: product.description,
              image: product.image,
              businessId: product.business.id || "unknown", // Use actual business ID if available
              businessName: product.business.name,
            })
          }
        />
      ))}
    </div>
  );
};