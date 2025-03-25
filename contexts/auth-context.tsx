"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client directly in the auth context to ensure it's available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking session:", error)
          setLoading(false)
          return
        }

        if (data.session) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || "",
          })
        }
      } catch (err) {
        console.error("Error in checkSession:", err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    let subscription: { unsubscribe: () => void } | null = null

    try {
      const authListener = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
          })
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          router.push("/")
        }
      })

      subscription = authListener.data.subscription
    } catch (err) {
      console.error("Error setting up auth listener:", err)
    }

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe()
        } catch (err) {
          console.error("Error unsubscribing:", err)
        }
      }
    }
  }, [router])

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error }
    } catch (err) {
      console.error("Error in signUp:", err)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error) {
        router.push("/admin/dashboard")
      }

      return { error }
    } catch (err) {
      console.error("Error in signIn:", err)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      console.error("Error in signOut:", err)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

