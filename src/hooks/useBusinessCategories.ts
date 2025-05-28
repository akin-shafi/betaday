import { useQuery } from "@tanstack/react-query"
import { fetchBusinessCategories } from "@/services/categoryService"

interface UseBusinessCategoriesProps {
  businessId: string | null
  token?: string
  enabled?: boolean
}

export const useBusinessCategories = ({ businessId, token, enabled = true }: UseBusinessCategoriesProps) => {
  return useQuery({
    queryKey: ["business-categories", businessId],
    queryFn: () => {
      if (!businessId) {
        throw new Error("Business ID is required")
      }
      return fetchBusinessCategories(businessId, token)
    },
    enabled: enabled && !!businessId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
