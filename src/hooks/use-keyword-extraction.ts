/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback } from "react"

interface KeywordExtractionResult {
  businessType?: string
  searchTerm: string
  keywords: string[]
  confidence: number
  language: string
  extractedAt: string
  suggestions?: string[]
}

interface KeywordExtractionOptions {
  language?: string
  useCache?: boolean
}

export const useKeywordExtraction = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getBaseUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
      }
      return process.env.NEXT_PUBLIC_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8500`
    }
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500"
  }, [])

  const extractKeywords = useCallback(
    async (query: string, options: KeywordExtractionOptions = {}): Promise<KeywordExtractionResult | null> => {
      if (!query.trim()) {
        setError("Query cannot be empty")
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const baseUrl = getBaseUrl()
        const response = await fetch(`${baseUrl}/keywords/extract`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: query.trim(),
            language: options.language || "en",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Keyword extraction failed")
        }

        console.log("Keyword extraction result:", data.data)
        return data.data
      } catch (err) {
        console.error("Keyword extraction error:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to extract keywords"
        setError(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [getBaseUrl],
  )

  const extractKeywordsBatch = useCallback(
    async (queries: string[], options: KeywordExtractionOptions = {}): Promise<KeywordExtractionResult[]> => {
      if (!queries.length) {
        setError("At least one query is required")
        return []
      }

      setIsLoading(true)
      setError(null)

      try {
        const baseUrl = getBaseUrl()
        const response = await fetch(`${baseUrl}/keywords/extract-batch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            queries: queries.filter((q) => q.trim()),
            language: options.language || "en",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Batch keyword extraction failed")
        }

        return data.data.filter((result: any) => !result.error)
      } catch (err) {
        console.error("Batch keyword extraction error:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to extract keywords"
        setError(errorMessage)
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [getBaseUrl],
  )

  const getPopularKeywords = useCallback(
    async (
      options: {
        limit?: number
        businessType?: string
        timeframe?: "1d" | "7d" | "30d" | "90d"
      } = {},
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const baseUrl = getBaseUrl()
        const params = new URLSearchParams()

        if (options.limit) params.append("limit", options.limit.toString())
        if (options.businessType) params.append("businessType", options.businessType)
        if (options.timeframe) params.append("timeframe", options.timeframe)

        const response = await fetch(`${baseUrl}/keywords/popular?${params.toString()}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to get popular keywords")
        }

        return data.data
      } catch (err) {
        console.error("Popular keywords error:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to get popular keywords"
        setError(errorMessage)
        return { keywords: [], timeframe: "7d", total: 0 }
      } finally {
        setIsLoading(false)
      }
    },
    [getBaseUrl],
  )

  return {
    extractKeywords,
    extractKeywordsBatch,
    getPopularKeywords,
    isLoading,
    error,
  }
}
