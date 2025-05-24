/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

interface VoiceSearchAnalytics {
  originalQuery: string
  extractedKeywords: string[]
  detectedBusinessType?: string
  searchResults: number
  userClicked: boolean
  confidence: number
}

export const useVoiceSearchAnalytics = () => {
  const trackVoiceSearch = async (data: VoiceSearchAnalytics) => {
    try {
      // Track voice search usage for analytics
      const analyticsData = {
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        sessionId: getSessionId(),
      }

      // Send to analytics endpoint (you can implement this)
      console.log("Voice Search Analytics:", analyticsData)

      // Store locally for offline analytics
      const existingData = JSON.parse(localStorage.getItem("voiceSearchAnalytics") || "[]")
      existingData.push(analyticsData)

      // Keep only last 100 entries
      if (existingData.length > 100) {
        existingData.splice(0, existingData.length - 100)
      }

      localStorage.setItem("voiceSearchAnalytics", JSON.stringify(existingData))
    } catch (error) {
      console.error("Failed to track voice search analytics:", error)
    }
  }

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem("voiceSearchSessionId")
    if (!sessionId) {
      sessionId = `vs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("voiceSearchSessionId", sessionId)
    }
    return sessionId
  }

  const getVoiceSearchStats = () => {
    try {
      const data = JSON.parse(localStorage.getItem("voiceSearchAnalytics") || "[]")
      return {
        totalSearches: data.length,
        averageConfidence: data.reduce((acc: number, item: any) => acc + item.confidence, 0) / data.length || 0,
        mostSearchedBusinessType: getMostFrequent(data.map((item: any) => item.detectedBusinessType).filter(Boolean)),
        successRate: data.filter((item: any) => item.userClicked).length / data.length || 0,
      }
    } catch (error) {
      console.error("Failed to get voice search stats:", error)
      return null
    }
  }

  const getMostFrequent = (arr: string[]) => {
    if (arr.length === 0) return null
    const frequency: { [key: string]: number } = {}
    arr.forEach((item) => {
      frequency[item] = (frequency[item] || 0) + 1
    })
    return Object.keys(frequency).reduce((a, b) => (frequency[a] > frequency[b] ? a : b))
  }

  return {
    trackVoiceSearch,
    getVoiceSearchStats,
  }
}
