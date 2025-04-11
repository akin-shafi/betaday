// components/store/MenuItemsSection.tsx
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null; // Changed to match page.tsx
  popular?: boolean;
}

interface MenuItemsSectionProps {
  activeCategory: string;
  menuItems: MenuItem[];
  setSelectedItem: (item: MenuItem | null) => void;
  isLoading?: boolean;
}

export default function MenuItemsSection({
  activeCategory,
  menuItems,
  setSelectedItem,
  isLoading = false,
}: MenuItemsSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-[120px] h-[120px] bg-gray-200 rounded-md" />
              <div className="flex-1">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-full bg-gray-200 rounded mb-1" />
                <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
                <div className="h-5 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-start gap-4 p-4">
              <div className="relative flex-shrink-0 w-[120px] h-[120px]">
                <Image
                  src={item.image || "/images/food.png"}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="rounded-md transform group-hover:scale-105 transition-transform duration-300"
                />

                {item.popular && (
                  <span className="absolute top-2 left-2 bg-[#ff6600] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex-1 text-[#292d32]">
                <h3 className="font-medium text-md">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1A2E20]">{item.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
