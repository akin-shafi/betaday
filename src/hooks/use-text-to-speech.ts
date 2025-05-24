"use client"

import { useState, useEffect, useCallback } from "react"

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported("speechSynthesis" in window)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || isSpeaking) return

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    },
    [isSupported, isSpeaking],
  )

  const stop = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported, isSpeaking])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: isSupported,
  }
}
