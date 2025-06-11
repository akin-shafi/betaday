/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import ItemModal from "@/components/modal/ItemModal";
import BusinessMismatchModal from "@/components/modal/BusinessMismatchModal";
import BusinessInfoSection from "@/components/BusinessInfoSection";
import CategoriesSection from "@/components/store/CategoriesSection";
import MenuItemsSection from "@/components/store/MenuItemsSection";
import CartSection from "@/components/store/CartSection";
import FloatingCheckoutButton from "@/components/cart/FloatingCheckoutButton";
import CartModal from "@/components/cart/CartModal";
import {
  fetchBusinessDetails,
  fetchProductsByBusinessId,
  fetchCategoriesByBusinessId,
  type Product,
} from "@/services/productService";
import { groupProductsByCategory } from "@/utils/groupProductsByCategory";
import { useBusinessStore } from "@/stores/business-store";
import { useCart, type CartItem } from "@/contexts/cart-context";
import StoreDetailsSkeleton from "@/components/skeletons/StoreDetailsSkeleton";
import type { ProductBusiness } from "@/services/productService";
import Link from "next/link";

type MenuItem = Product;

type BusinessDetails = ProductBusiness & {
  products?: Product[];
};

export default function StoreItem() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const productId = searchParams?.get("productId");

  const isFetchingRef = useRef(false);
  const lastFetchedIdRef = useRef<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  const getMenuItems = (): MenuItem[] => {
    if (!groupedProducts) return [];

    if (searchQuery.trim()) {
      const allItems = Object.values(groupedProducts).flat();
      const filteredItems = allItems.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredItems.length > 0) {
        const categoryMatches: { [category: string]: number } = {};
        filteredItems.forEach((item) => {
          const itemCategory =
            item.categories && item.categories.length > 0
              ? item.categories[0].name
              : "Other";
          categoryMatches[itemCategory] =
            (categoryMatches[itemCategory] || 0) + 1;
        });

        const topCategory = Object.entries(categoryMatches).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0];

        if (
          topCategory &&
          topCategory !== activeCategory &&
          categories.includes(topCategory)
        ) {
          setActiveCategory(topCategory);
        }
      }

      return filteredItems || [];
    }

    const categoryItems =
      activeCategory === "all"
        ? Object.values(groupedProducts).flat()
        : groupedProducts[activeCategory] || [];

    return categoryItems || [];
  };

  const handleCheckout = () => setIsCartOpen(true);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim() && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  };

  const getBusiness = async (
    businessId: string,
    selectedProductId?: string | null
  ) => {
    if (isFetchingRef.current && lastFetchedIdRef.current === businessId) {
      return;
    }

    try {
      isFetchingRef.current = true;
      lastFetchedIdRef.current = businessId;
      setIsLoading(true);
      setError(null);

      const businessData = await fetchBusinessDetails(businessId);
      let products: Product[] = [];

      try {
        products = await fetchProductsByBusinessId(businessData.id);
      } catch (productError) {
        products = [];
      }

      let apiCategories: string[] = [];

      try {
        apiCategories = await fetchCategoriesByBusinessId(businessData.id);
      } catch (categoryError) {
        apiCategories = [];
      }

      const businessWithStatus: BusinessDetails = {
        ...businessData,
        products,
      };

      setBusiness(businessWithStatus);

      setBusinessInfo({
        name: businessWithStatus.name,
        id: businessWithStatus.id,
      });

      if (products && products.length > 0) {
        const allGroupedProducts = groupProductsByCategory(products);
        setGroupedProducts(allGroupedProducts);

        let finalCategories: string[] = [];

        if (apiCategories.length > 0) {
          finalCategories = apiCategories.filter(
            (category) => allGroupedProducts[category]?.length > 0
          );
        }

        if (finalCategories.length === 0) {
          finalCategories = Object.keys(allGroupedProducts);
        }

        setCategories(finalCategories);

        if (finalCategories.length > 0) {
          setActiveCategory(finalCategories[0]);
        }

        if (selectedProductId && businessWithStatus.status === "open") {
          const selected = products.find(
            (item: Product) => item.id === selectedProductId
          );
          if (selected) {
            setSelectedItem(selected);
          }
        }
      } else {
        setCategories([]);
        setGroupedProducts({});
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch business";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (!id) return;

    if (lastFetchedIdRef.current !== id) {
      setBusiness(null);
      setCategories([]);
      setActiveCategory("");
      setGroupedProducts({});
      setSelectedItem(null);
      setError(null);
      setSearchQuery("");
      lastFetchedIdRef.current = null;
      isFetchingRef.current = false;
    }

    getBusiness(id, productId);
  }, [id, productId]);

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
    if (business?.status !== "open") {
      return;
    }

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

  const handleItemSelection = (item: MenuItem | null) => {
    if (business?.status !== "open" && item) {
      return;
    }
    setSelectedItem(item);
  };

  const isOpen = business?.status === "open";
  const hasProducts = Object.keys(groupedProducts).length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto">
          <StoreDetailsSkeleton />
        </main>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Business Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The requested business could not be found."}
          </p>
          <Link
            href="/store"
            className="text-brandmain hover:text-brandmain/80"
          >
            ← Back to Businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <BusinessInfoSection business={business} isLoading={false} />

            {hasProducts ? (
              <>
                <CategoriesSection
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  categories={categories}
                  categoryCounts={getCategoryCounts()}
                  isLoading={false}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
                />

                <MenuItemsSection
                  activeCategory={activeCategory}
                  menuItems={getMenuItems()}
                  setSelectedItem={handleItemSelection}
                  isLoading={false}
                  isBusinessOpen={isOpen}
                  businessName={business.name}
                  openingTime={business.openingTime}
                  closingTime={
                    business.closingTime === "22:00:00"
                      ? "23:00:00"
                      : business.closingTime
                  }
                  businessDays={business.businessDays}
                  isTwentyFourSeven={business.isTwentyFourSeven ?? false}
                  isTwentyFourHours={business.isTwentyFourHours ?? false}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products available
                </h3>
                <p className="text-gray-600">
                  This business {"hasn't"} added any products yet.
                </p>
              </div>
            )}
          </div>
          <CartSection />
        </div>
      </main>

      <AnimatePresence>
        {selectedItem && isOpen && (
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

      {isOpen && hasProducts && (
        <FloatingCheckoutButton onCheckout={handleCheckout} />
      )}
    </div>
  );
}
