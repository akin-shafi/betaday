"use client"
import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import ItemModal from "@/components/modal/ItemModal"
import BusinessMismatchModal from "@/components/modal/BusinessMismatchModal"
import BusinessInfoSection from "@/components/BusinessInfoSection"
import CategoriesSection from "@/components/store/CategoriesSection"
import MenuItemsSection from "@/components/store/MenuItemsSection"
import CartSection from "@/components/store/CartSection"
import FloatingCheckoutButton from "@/components/cart/FloatingCheckoutButton"
import CartModal from "@/components/cart/CartModal"
import { fetchProducts, fetchBusinessDetails, type Product } from "@/services/productService"
import { groupProductsByCategory } from "@/utils/groupProductsByCategory"
import { useBusinessStore } from "@/stores/business-store"
import { useCart, type CartItem } from "@/contexts/cart-context"
import StoreDetailsSkeleton from "@/components/skeletons/StoreDetailsSkeleton"
import type { ProductBusiness } from "@/services/productService"
import { fetchBusinessCategories } from "@/services/categoryService"
import { filterProductsByAvailableCategories } from "@/utils/groupProductsByCategory"
import { isBusinessCurrentlyOpen } from "@/utils/businessHours"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"

type MenuItem = Product

type BusinessDetails = ProductBusiness & {
  status?: "open" | "closed"
  products?: Product[]
}

export default function StoreItem() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params?.id as string
  const productId = searchParams?.get("productId")
  const queryClient = useQueryClient()

  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [business, setBusiness] = useState<BusinessDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groupedProducts, setGroupedProducts] = useState<{
    [category: string]: MenuItem[]
  }>({})
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false)
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null)
  const { setBusinessInfo } = useBusinessStore()
  const { state, dispatch } = useCart()

  const getMenuItems = (): MenuItem[] => {
    // If there's a search query, search across ALL items regardless of active category
    if (searchQuery.trim()) {
      const allItems = Object.values(groupedProducts).flat()
      const filteredItems = allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      // Auto-update the active category based on search results
      if (filteredItems.length > 0) {
        // Find the category with the most matching items
        const categoryMatches: { [category: string]: number } = {}
        filteredItems.forEach((item) => {
          // Get the first category name from the categories array, or use "Other" if none exists
          const itemCategory = item.categories && item.categories.length > 0 ? item.categories[0].name : "Other"
          categoryMatches[itemCategory] = (categoryMatches[itemCategory] || 0) + 1
        })

        // Get the category with most matches
        const topCategory = Object.entries(categoryMatches).sort(([, a], [, b]) => b - a)[0]?.[0]

        // Only update if it's different from current active category
        if (topCategory && topCategory !== activeCategory && categories.includes(topCategory)) {
          setActiveCategory(topCategory)
        }
      }

      return filteredItems
    }

    // If no search query, return items from active category as before
    return activeCategory === "all" ? Object.values(groupedProducts).flat() : groupedProducts[activeCategory] || []
  }

  const handleCheckout = () => setIsCartOpen(true)

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // If clearing search, reset to first category
    if (!query.trim() && categories.length > 0) {
      setActiveCategory(categories[0])
    }
  }

  // Reset state and clear cache when business ID changes
  useEffect(() => {
    if (id) {
      console.log(`🔄 Business ID changed to: ${id}`)

      // Clear React Query cache for this business
      queryClient.removeQueries({ queryKey: ["products", id] })
      queryClient.removeQueries({ queryKey: ["business", id] })
      queryClient.removeQueries({ queryKey: ["categories", id] })

      // Reset all state when switching businesses
      setBusiness(null)
      setCategories([])
      setActiveCategory("")
      setGroupedProducts({})
      setSelectedItem(null)
      setError(null)
      setSearchQuery("")
      setIsLoading(true)
    }
  }, [id, queryClient])

  // Memoize the getBusiness function to prevent unnecessary re-renders
  const getBusiness = useCallback(async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)

      console.log(`📡 Fetching data for business: ${id}`)

      // Fetch products, business details, and categories in parallel
      const [products, businessDetails, businessCategories] = await Promise.all([
        fetchProducts(id),
        fetchBusinessDetails(id),
        fetchBusinessCategories(id),
      ])

      console.log(`📦 Received ${products.length} products for business ${id}`)
      console.log(`🏪 Received business details: ${businessDetails.name}`)
      console.log(`📂 Received ${businessCategories.length} categories for business ${id}`)

      if (products.length === 0) {
        throw new Error("No products found for this business")
      }

      // Use the enhanced business hours logic
      const isOpen = isBusinessCurrentlyOpen(
        businessDetails.openingTime,
        businessDetails.closingTime,
        businessDetails.businessDays,
        businessDetails.isActive,
      )

      // Add status field and products
      const businessWithStatus: BusinessDetails = {
        ...businessDetails,
        status: isOpen ? "open" : "closed",
        products,
      }

      console.log(`✅ Setting business: ${businessWithStatus.name} (${businessWithStatus.id})`)
      setBusiness(businessWithStatus)

      setBusinessInfo({
        name: businessWithStatus.name,
        id: businessWithStatus.id,
      })

      // Group products by category first
      const allGroupedProducts = groupProductsByCategory(products)

      // Filter to only show categories that exist in the business categories endpoint
      const filteredGroupedProducts = filterProductsByAvailableCategories(allGroupedProducts, businessCategories)

      setGroupedProducts(filteredGroupedProducts)

      // Use the categories from the API endpoint
      setCategories(businessCategories)

      // Set the first available category as active
      if (businessCategories.length > 0) {
        setActiveCategory(businessCategories[0])
      }

      // Check for productId and set selectedItem (only if business is open)
      if (productId && products && businessWithStatus.status === "open") {
        const selected = products.find((item: Product) => item.id === productId)
        if (selected) {
          console.log(`Selected product from URL: ${selected.name}, id: ${selected.id}`)
          setSelectedItem(selected)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch business"
      setError(errorMessage)
      console.error("❌ Error fetching business:", err)
    } finally {
      setIsLoading(false)
    }
  }, [id, productId, setBusinessInfo])

  // Fetch business data when ID changes
  useEffect(() => {
    getBusiness()
  }, [getBusiness])

  const getCategoryCounts = () =>
    Object.fromEntries(Object.entries(groupedProducts).map(([category, items]) => [category, items.length]))

  const checkBusinessMismatch = (newItem: CartItem) => {
    if (state.packs.length === 0) return false
    const currentBusinessId = state.packs[0].items[0]?.businessId
    return currentBusinessId && currentBusinessId !== newItem.businessId
  }

  const handleAddToCart = (newItem: CartItem) => {
    // Check business status
    if (business?.status !== "open") {
      return
    }

    if (checkBusinessMismatch(newItem)) {
      setPendingItem(newItem)
      setIsMismatchModalOpen(true)
    } else {
      addItemToCart(newItem)
    }
  }

  const addItemToCart = (item: CartItem) => {
    let currentPackId = state.activePackId
    if (!currentPackId || state.packs.length === 0) {
      currentPackId = `Pack: ${state.packs.length + 1}`
      dispatch({ type: "ADD_PACK" })
    }
    dispatch({
      type: "ADD_ITEM_TO_PACK",
      payload: { packId: currentPackId, item },
    })
  }

  const handleConfirmMismatch = () => {
    dispatch({ type: "SAVE_AND_CLEAR_CART" })
    if (pendingItem) addItemToCart(pendingItem)
    setIsMismatchModalOpen(false)
    setPendingItem(null)
  }

  const handleCancelMismatch = () => {
    setIsMismatchModalOpen(false)
    setPendingItem(null)
  }

  const getCurrentVendorName = () => {
    if (state.packs.length === 0 || !state.packs[0].items[0]?.businessName) return "another vendor"
    return state.packs[0].items[0].businessName
  }

  const getCurrentVendorId = () => {
    if (state.packs.length === 0 || !state.packs[0].items[0]?.businessId) return ""
    return state.packs[0].items[0].businessId
  }

  // Handle item selection
  const handleItemSelection = (item: MenuItem | null) => {
    if (business?.status !== "open" && item) {
      // Don't allow selection if business is closed
      return
    }
    setSelectedItem(item)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto">
          <StoreDetailsSkeleton />
        </main>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The requested business could not be found."}</p>
          <Link href="/store" className="text-brandmain hover:text-brandmain/80">
            ← Back to Businesses
          </Link>
        </div>
      </div>
    )
  }

  // Get business open status
  const isOpen = business.status === "open"

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <BusinessInfoSection business={business} isLoading={isLoading} />
            <CategoriesSection
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categories={categories}
              categoryCounts={getCategoryCounts()}
              isLoading={isLoading}
              onSearch={handleSearch}
              searchQuery={searchQuery}
            />

            <MenuItemsSection
              activeCategory={activeCategory}
              menuItems={getMenuItems()}
              setSelectedItem={handleItemSelection}
              isLoading={isLoading}
              isBusinessOpen={isOpen}
              businessName={business.name}
            />
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

      {/* Only show floating checkout button if business is open */}
      {isOpen && <FloatingCheckoutButton onCheckout={handleCheckout} />}
    </div>
  )
}
