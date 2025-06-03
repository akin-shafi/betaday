/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export const useEnhancedVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTranscript, setLastTranscript] = useState("")
  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"
      recognitionRef.current.maxAlternatives = 3
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setIsProcessing(false)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isListening])

  const startListening = useCallback(
    (onResult: (transcript: string) => void, onError?: (error: string) => void) => {
      if (!recognitionRef.current || isListening) return

      setIsListening(true)
      setIsProcessing(false)
      setLastTranscript("")

      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          stopListening()
          onError?.("Voice input timeout. Please try again.")
        }
      }, 10000)

      recognitionRef.current.onresult = (event: any) => {
        const results = Array.from(event.results)
        const transcript = results
          .map((result: any) => result[0].transcript)
          .join("")
          .trim()

        setLastTranscript(transcript)

        if (event.results[event.results.length - 1].isFinal) {
          setIsProcessing(true)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          setTimeout(() => {
            onResult(transcript)
            setIsListening(false)
            setIsProcessing(false)
          }, 500)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        setIsProcessing(false)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        let errorMessage = "Voice recognition failed. Please try again."
        switch (event.error) {
          case "not-allowed":
            errorMessage = "Microphone access denied. Please allow microphone access and try again."
            break
          case "no-speech":
            errorMessage = "No speech detected. Please speak clearly and try again."
            break
          case "network":
            errorMessage = "Network error. Please check your connection and try again."
            break
          case "audio-capture":
            errorMessage = "Microphone not found. Please check your microphone and try again."
            break
          case "aborted":
            errorMessage = "Voice input was cancelled."
            break
        }

        onError?.(errorMessage)
      }

      recognitionRef.current.onend = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        if (!isProcessing) {
          setIsListening(false)
        }
      }

      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Failed to start speech recognition:", error)
        setIsListening(false)
        setIsProcessing(false)
        onError?.("Failed to start voice recognition. Please try again.")
      }
    },
    [isListening, isProcessing, stopListening],
  )

  return {
    isListening,
    isSupported,
    isProcessing,
    lastTranscript,
    startListening,
    stopListening,
  }
}
