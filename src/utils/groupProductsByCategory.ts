import type { Product, ProductCategory } from "../services/productService"

type GroupedProducts = {
  [category: string]: Product[]
}

export const groupProductsByCategory = (products: Product[]): GroupedProducts => {
  return products.reduce<GroupedProducts>((acc, product) => {
    // Handle the new categories structure - array of category objects
    if (product.categories && product.categories.length > 0) {
      // Group product under each of its categories
      product.categories.forEach((categoryObj: ProductCategory) => {
        const categoryName = categoryObj.name || "Uncategorized"
        if (!acc[categoryName]) {
          acc[categoryName] = []
        }
        acc[categoryName].push(product)
      })
    } else {
      // Fallback for products without categories
      const categoryName = "Uncategorized"
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(product)
    }

    return acc
  }, {})
}

// New function to filter grouped products by available categories
export const filterProductsByAvailableCategories = (
  groupedProducts: GroupedProducts,
  availableCategories: string[],
): GroupedProducts => {
  const filtered: GroupedProducts = {}

  // Only include categories that are in the available categories list
  availableCategories.forEach((category) => {
    if (groupedProducts[category] && groupedProducts[category].length > 0) {
      filtered[category] = groupedProducts[category]
    }
  })

  return filtered
}

// Helper function to get all unique categories from products (kept for backward compatibility)
export const getCategoriesFromProducts = (products: Product[]): string[] => {
  const categorySet = new Set<string>()

  products.forEach((product) => {
    if (product.categories && product.categories.length > 0) {
      product.categories.forEach((categoryObj: ProductCategory) => {
        if (categoryObj.name) {
          categorySet.add(categoryObj.name)
        }
      })
    } else {
      categorySet.add("Uncategorized")
    }
  })

  return Array.from(categorySet).sort()
}
