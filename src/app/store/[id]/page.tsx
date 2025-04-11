"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation"; // Add useSearchParams
import { AnimatePresence } from "framer-motion";
// import HeaderStore from "@/components/HeaderStore";
// import FooterStore from "@/components/FooterStore";
import ItemModal from "@/components/modal/ItemModal";
import BusinessMismatchModal from "@/components/modal/BusinessMismatchModal";
import BusinessInfoSection from "@/components/BusinessInfoSection";
import CategoriesSection from "@/components/store/CategoriesSection";
import MenuItemsSection from "@/components/store/MenuItemsSection";
import CartSection from "@/components/store/CartSection";
import FloatingCheckoutButton from "@/components/cart/FloatingCheckoutButton";
import CartModal from "@/components/cart/CartModal";
import { fetchBusinessById } from "@/services/useBusiness";
import { groupProductsByCategory } from "@/utils/groupProductsByCategory";
import { useBusinessStore } from "@/stores/business-store";
import { useCart, CartItem } from "@/contexts/cart-context";
import StoreDetailsSkeleton from "@/components/skeletons/StoreDetailsSkeleton";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  popular?: boolean;
  businessId?: string;
};

type BusinessDetails = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  deliveryOptions: string[];
  image: string | null;
  openingTime: string;
  closingTime: string;
  contactNumber: string;
  rating: string;
  totalRatings: number;
  isActive: boolean;
  products: MenuItem[];
  businessType: string;
};

export default function StoreItem() {
  const params = useParams();
  const searchParams = useSearchParams(); // Add this to read query params
  const id = params?.id as string;
  const productId = searchParams?.get("productId"); // Get productId from URL

  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedProducts, setGroupedProducts] = useState<{
    [category: string]: MenuItem[];
  }>({});
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null);

  const { setBusinessInfo } = useBusinessStore();
  const { state, dispatch } = useCart();

  const parsePrice = (price: string): number =>
    parseFloat(price.replace(/[^\d.]/g, "")) || 0;

  const getMenuItems = (): MenuItem[] => {
    const items =
      activeCategory === "all"
        ? Object.values(groupedProducts).flat()
        : groupedProducts[activeCategory] || [];
    return items.filter((item) => {
      const itemPrice = parsePrice(item.price);
      return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    });
  };

  const handleCheckout = () => setIsCartOpen(true);

  useEffect(() => {
    const getBusiness = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchBusinessById(id, "products");
        setBusiness(response.business);
        setBusinessInfo({
          name: response.business.name,
          id: response.business.id,
        });
        const grouped = groupProductsByCategory(response.business.products);
        setGroupedProducts(grouped);
        const categoryList = Object.keys(grouped);
        setCategories(categoryList);
        if (categoryList.length > 0) setActiveCategory(categoryList[0]);

        // Check for productId and set selectedItem
        if (productId && response.business.products) {
          const selected = response.business.products.find(
            (item: { id: string }) => item.id === productId
          );
          if (selected) {
            setSelectedItem(selected);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch business"
        );
        console.error("Error fetching business:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) getBusiness();
  }, [id, productId, setBusinessInfo]); // Add productId to dependencies

  const getCategoryCounts = () =>
    Object.fromEntries(
      Object.entries(groupedProducts).map(([category, items]) => [
        category,
        items.length,
      ])
    );

  const checkBusinessMismatch = (newItem: CartItem) => {
    if (state.packs.length === 0) return false;
    const currentBusinessId = state.packs[0].items[0]?.businessId;
    return currentBusinessId && currentBusinessId !== newItem.businessId;
  };

  const handleAddToCart = (newItem: CartItem) => {
    if (checkBusinessMismatch(newItem)) {
      setPendingItem(newItem);
      setIsMismatchModalOpen(true);
    } else {
      addItemToCart(newItem);
    }
  };

  const addItemToCart = (item: CartItem) => {
    let currentPackId = state.activePackId;
    if (!currentPackId || state.packs.length === 0) {
      currentPackId = `Pack: ${state.packs.length + 1}`;
      dispatch({ type: "ADD_PACK" });
    }
    dispatch({
      type: "ADD_ITEM_TO_PACK",
      payload: { packId: currentPackId, item },
    });
  };

  const handleConfirmMismatch = () => {
    dispatch({ type: "SAVE_AND_CLEAR_CART" });
    if (pendingItem) addItemToCart(pendingItem);
    setIsMismatchModalOpen(false);
    setPendingItem(null);
  };

  const handleCancelMismatch = () => {
    setIsMismatchModalOpen(false);
    setPendingItem(null);
  };

  const getCurrentVendorName = () => {
    if (state.packs.length === 0 || !state.packs[0].items[0]?.businessName)
      return "another vendor";
    return state.packs[0].items[0].businessName;
  };

  const getCurrentVendorId = () => {
    if (state.packs.length === 0 || !state.packs[0].items[0]?.businessId)
      return "";
    return state.packs[0].items[0].businessId;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* <HeaderStore /> */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <StoreDetailsSkeleton />
        </main>
        {/* <FooterStore /> */}
      </div>
    );
  }

  if (error || !business) return <div>{error || "Business not found"}</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* <HeaderStore /> */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <BusinessInfoSection business={business} isLoading={isLoading} />
            <CategoriesSection
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={categories}
              categoryCounts={getCategoryCounts()}
              isLoading={isLoading}
            />
            <MenuItemsSection
              activeCategory={activeCategory}
              menuItems={getMenuItems()}
              setSelectedItem={setSelectedItem}
              isLoading={isLoading}
            />
          </div>
          <CartSection />
        </div>
      </main>
      {/* <FooterStore /> */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal
            item={{
              ...selectedItem,
              businessId: business.id,
              businessName: business.name,
            }}
            onClose={() => setSelectedItem(null)}
            onAddToCart={handleAddToCart}
            key="item-modal"
          />
        )}
      </AnimatePresence>
      <BusinessMismatchModal
        isOpen={isMismatchModalOpen}
        currentVendorName={getCurrentVendorName()}
        currentVendorId={getCurrentVendorId()}
        newVendorName={business.name}
        onConfirm={handleConfirmMismatch}
        onCancel={handleCancelMismatch}
      />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FloatingCheckoutButton onCheckout={handleCheckout} />
    </div>
  );
}
