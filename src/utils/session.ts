"use client"

// Import the User type from your types directory
import type { User } from "@/types/user"

interface Session {
  user: User
  token: string
  timestamp: number
  rememberMe: boolean
  expiresAt: number
  lastActivity: number
}

// Session duration constants
const SESSION_DURATIONS = {
  SHORT: 24 * 60 * 60 * 1000, // 24 hours
  LONG: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const

const SESSION_KEY = "user_session"
const LAST_ACTIVITY_KEY = "last_activity"

// Enhanced session management with backward compatibility
export const getSession = (): Session | null => {
  if (typeof window === "undefined") return null

  try {
    const session = localStorage.getItem(SESSION_KEY)
    if (!session) return null

    const parsedSession = JSON.parse(session) as Session

    // Check if session is expired
    const now = new Date().getTime()
    if (now > parsedSession.expiresAt) {
      console.log("Session expired, clearing...")
      clearSession()
      return null
    }

    return parsedSession
  } catch (error) {
    console.error("Error parsing session:", error)
    clearSession()
    return null
  }
}

export const setSession = (session: Omit<Session, "timestamp" | "expiresAt" | "lastActivity">) => {
  try {
    const now = new Date().getTime()
    const duration = session.rememberMe ? SESSION_DURATIONS.LONG : SESSION_DURATIONS.SHORT

    const sessionWithTimestamp: Session = {
      user: session.user,
      token: session.token,
      rememberMe: session.rememberMe,
      timestamp: now,
      expiresAt: now + duration,
      lastActivity: now,
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionWithTimestamp))
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString())

    console.log(`Session set with ${session.rememberMe ? "7 days" : "24 hours"} duration`)
  } catch (error) {
    console.error("Error saving session:", error)
  }
}

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(LAST_ACTIVITY_KEY)
    // Also clear the old token for backward compatibility
    localStorage.removeItem("auth_token")
    sessionStorage.removeItem("auth_token")
  } catch (error) {
    console.error("Error clearing session:", error)
  }
}

export const updateSessionUser = (updatedUser: User) => {
  try {
    const currentSession = getSession()
    if (!currentSession) {
      console.warn("No active session to update")
      return false
    }

    setSession({
      user: updatedUser,
      token: currentSession.token,
      rememberMe: currentSession.rememberMe,
    })
    return true
  } catch (error) {
    console.error("Error updating session user:", error)
    return false
  }
}

export const getSessionUser = (): User | null => {
  const session = getSession()
  return session?.user || null
}

export const getSessionToken = (): string | null => {
  const session = getSession()
  return session?.token || null
}

export const isSessionValid = (): boolean => {
  const session = getSession()
  return !!session?.user && !!session?.token
}

export const updateLastActivity = () => {
  try {
    const now = new Date().getTime()
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString())

    // Update session's last activity
    const session = getSession()
    if (session) {
      const updatedSession = { ...session, lastActivity: now }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
    }
  } catch (error) {
    console.error("Error updating last activity:", error)
  }
}

export const getSessionTimeRemaining = (): number => {
  const session = getSession()
  if (!session?.expiresAt) return 0

  const now = new Date().getTime()
  return Math.max(0, session.expiresAt - now)
}

export const shouldRefreshSession = (): boolean => {
  const session = getSession()
  if (!session?.timestamp) return false

  const now = new Date().getTime()
  const sessionAge = now - session.timestamp
  const refreshThreshold = 12 * 60 * 60 * 1000 // 12 hours

  return sessionAge > refreshThreshold
}

export const refreshSessionTimestamp = () => {
  try {
    const session = getSession()
    if (session) {
      setSession({
        user: session.user,
        token: session.token,
        rememberMe: session.rememberMe,
      })
    }
  } catch (error) {
    console.error("Error refreshing session timestamp:", error)
  }
}

// Backward compatibility functions
export const getAuthToken = (): string | null => {
  // First try the new session system
  const sessionToken = getSessionToken()
  if (sessionToken) return sessionToken

  // Fallback to old token system for backward compatibility
  if (typeof window === "undefined") return null

  let token: string | null = null
  try {
    token = localStorage.getItem("auth_token")
    if (token) return token
  } catch (error) {
    console.error("Failed to get token from localStorage:", error)
  }

  try {
    token = sessionStorage.getItem("auth_token")
    if (token) return token
  } catch (error) {
    console.error("Failed to get token from sessionStorage:", error)
  }

  return null
}

export const setAuthToken = (token: string, rememberMe = false): void => {
  // For backward compatibility, we'll create a minimal session
  // This should be updated when we have user data
  if (typeof window === "undefined") return

  try {
    // Store in old format for backward compatibility
    localStorage.setItem("auth_token", token)

    // Also create a session if we don't have one
    const existingSession = getSession()
    if (!existingSession) {
      // Create a minimal session - this should be updated with real user data later
      const now = new Date().getTime()
      const duration = rememberMe ? SESSION_DURATIONS.LONG : SESSION_DURATIONS.SHORT

      const minimalSession: Session = {
        user: {
          id: "",
          fullName: "",
          phoneNumber: "",
          role: "",
        } as User, // Cast to User type to satisfy TypeScript
        token,
        rememberMe,
        timestamp: now,
        expiresAt: now + duration,
        lastActivity: now,
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify(minimalSession))
    }
  } catch (error) {
    console.error("Error setting auth token:", error)
  }
}

export const removeAuthToken = (): void => {
  clearSession()
}

// Export types
export type { Session }
export { SESSION_DURATIONS }
