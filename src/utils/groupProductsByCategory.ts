// utils/groupProductsByCategory.ts
type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  categories: string; // Changed from string[] to string
  isAvailable: boolean;
  isActive: boolean;
};

type GroupedProducts = {
  [category: string]: Product[];
};

export const groupProductsByCategory = (products: Product[]): GroupedProducts => {
  return products.reduce<GroupedProducts>((acc, product) => {
    const category = product.categories || "Uncategorized"; // Fallback if category is empty
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
};