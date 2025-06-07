/* eslint-disable react/no-unescaped-entities */
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
import { isBusinessCurrentlyOpen } from "@/utils/businessHours";
import Link from "next/link";

type MenuItem = Product;

type BusinessDetails = ProductBusiness & {
  status?: "open" | "closed";
  products?: Product[];
};

export default function StoreItem() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const productId = searchParams?.get("productId");

  // Use ref to track if we're already fetching to prevent duplicate calls
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
    // If there's a search query, search across ALL items regardless of active category
    if (searchQuery.trim()) {
      const allItems = Object.values(groupedProducts).flat();
      const filteredItems = allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Auto-update the active category based on search results
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

      return filteredItems;
    }

    // If no search query, return items from active category
    const categoryItems =
      activeCategory === "all"
        ? Object.values(groupedProducts).flat()
        : groupedProducts[activeCategory] || [];

    return categoryItems;
  };

  const handleCheckout = () => setIsCartOpen(true);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // If clearing search, reset to first category
    if (!query.trim() && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  };

  // Simplified data fetching function without useCallback to prevent recreation
  const getBusiness = async (
    businessId: string,
    selectedProductId?: string | null
  ) => {
    // Prevent duplicate calls
    if (isFetchingRef.current && lastFetchedIdRef.current === businessId) {
      console.log(
        `🚫 Already fetching business ${businessId}, skipping duplicate call`
      );
      return;
    }

    try {
      isFetchingRef.current = true;
      lastFetchedIdRef.current = businessId;
      setIsLoading(true);
      setError(null);

      console.log(`🚀 === STARTING FETCH FOR BUSINESS SLUG: ${businessId} ===`);

      // Step 1: Fetch business details by slug
      console.log(`📡 Step 1: Fetching business details...`);
      const businessData = await fetchBusinessDetails(businessId);

      console.log(
        `✅ Business fetched: ${businessData.name} (ID: ${businessData.id})`
      );

      // Check if business is open
      const isOpen = isBusinessCurrentlyOpen(
        businessData.openingTime,
        businessData.closingTime,
        businessData.businessDays,
        businessData.isActive
      );

      console.log(`🕐 Business is open: ${isOpen}`);

      // Step 2: Fetch products using business ID
      console.log(
        `📡 Step 2: Fetching products for business ID: ${businessData.id}`
      );
      let products: Product[] = [];

      try {
        products = await fetchProductsByBusinessId(businessData.id);
        console.log(`✅ Products fetched: ${products.length} items`);

        // Log first few products for debugging
        if (products.length > 0) {
          console.log(`📦 Sample products:`, products.slice(0, 3));
        }
      } catch (productError) {
        console.error("❌ Error fetching products:", productError);
        // Continue without products rather than failing completely
        products = [];
      }

      // Step 3: Fetch categories using business ID
      console.log(
        `📡 Step 3: Fetching categories for business ID: ${businessData.id}`
      );
      let apiCategories: string[] = [];

      try {
        apiCategories = await fetchCategoriesByBusinessId(businessData.id);
        console.log(
          `✅ Categories fetched: ${apiCategories.length} items:`,
          apiCategories
        );
      } catch (categoryError) {
        console.error("❌ Error fetching categories:", categoryError);
        // Continue without API categories, will fall back to product-derived categories
        apiCategories = [];
      }

      // Create business object with status and products
      const businessWithStatus: BusinessDetails = {
        ...businessData,
        status: isOpen ? "open" : "closed",
        products: products,
      };

      console.log(`🏪 Setting business with ${products.length} products`);
      setBusiness(businessWithStatus);

      // Set business info in store
      setBusinessInfo({
        name: businessWithStatus.name,
        id: businessWithStatus.id,
      });

      // Handle products and categories
      if (products && products.length > 0) {
        console.log(`🔄 Processing ${products.length} products...`);

        // Group products by category
        const allGroupedProducts = groupProductsByCategory(products);
        console.log(`📂 Grouped products:`, Object.keys(allGroupedProducts));
        console.log(
          `📂 Products per category:`,
          Object.fromEntries(
            Object.entries(allGroupedProducts).map(([key, items]) => [
              key,
              items.length,
            ])
          )
        );
        setGroupedProducts(allGroupedProducts);

        // Use API categories if available, otherwise fall back to product-derived categories
        let finalCategories: string[] = [];

        if (apiCategories.length > 0) {
          // Filter API categories to only include those that have products
          finalCategories = apiCategories.filter(
            (category) => allGroupedProducts[category]?.length > 0
          );
          console.log(
            `📂 Using API categories (filtered): ${finalCategories.length} items:`,
            finalCategories
          );
        }

        // If no valid API categories, fall back to product-derived categories
        if (finalCategories.length === 0) {
          finalCategories = Object.keys(allGroupedProducts);
          console.log(
            `📂 Falling back to product-derived categories: ${finalCategories.length} items:`,
            finalCategories
          );
        }

        setCategories(finalCategories);

        // Set the first available category as active
        if (finalCategories.length > 0) {
          console.log(`🎯 Setting active category to: ${finalCategories[0]}`);
          setActiveCategory(finalCategories[0]);
        }

        // Handle product selection from URL
        if (selectedProductId && businessWithStatus.status === "open") {
          const selected = products.find(
            (item: Product) => item.id === selectedProductId
          );
          if (selected) {
            console.log(`🎯 Selected product from URL: ${selected.name}`);
            setSelectedItem(selected);
          }
        }
      } else {
        // No products found
        console.log("⚠️ Business found but no products available");
        setCategories([]);
        setGroupedProducts({});
      }

      console.log(
        `🏁 === FINISHED PROCESSING BUSINESS: ${businessData.name} ===`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch business";
      setError(errorMessage);
      console.error("❌ Error fetching business:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Single useEffect with proper dependency management
  useEffect(() => {
    if (!id) return;

    // Reset state when ID changes
    if (lastFetchedIdRef.current !== id) {
      console.log(`🔄 ID changed to: ${id}, resetting state...`);
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

    // Fetch business data
    getBusiness(id, productId);
  }, [id, productId]); // Only depend on id and productId, not on functions

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
    // Check business status
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

  // Get business open status
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
                />
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products available
                </h3>
                <p className="text-gray-600">
                  This business hasn't added any products yet.
                </p>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
                  <p>
                    <strong>Debug info:</strong>
                  </p>
                  <p>Business ID: {business?.id}</p>
                  <p>Categories: {categories.length}</p>
                  <p>
                    Grouped products keys: {Object.keys(groupedProducts).length}
                  </p>
                  <p>
                    Business has products: {business?.products?.length || 0}
                  </p>
                </div>
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
