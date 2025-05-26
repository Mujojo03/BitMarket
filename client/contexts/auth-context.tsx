"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { mockUsers, type User } from "@/lib/mock-data"
import { usersApi } from "@/lib/api-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => void
  becomeSeller: () => Promise<void>
  refreshProfile: () => Promise<User>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("bitmerket_user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll just find a user with matching email
      const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // In a real app, we would verify the password here

      // Set user in state and localStorage
      setUser(foundUser)
      localStorage.setItem("bitmerket_user", JSON.stringify(foundUser))

      toast({
        title: "Welcome back!",
        description: `You've successfully signed in as ${foundUser.fullName || foundUser.email}`,
      })

      // No return value to match AuthContextType
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Failed to sign in. Please try again.",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (existingUser) {
        throw new Error("User with this email already exists")
      }

      // Create new user
      const newUser: User = {
        id: `user${Date.now()}`,
        email,
        fullName,
        isSeller: false,
        sellerRating: 0,
        sellerSales: 0,
        createdAt: new Date().toISOString(),
      }

      // Add to mock users (in a real app, this would be a database operation)
      mockUsers.push(newUser)

      // Set user in state and localStorage
      setUser(newUser)
      localStorage.setItem("bitmerket_user", JSON.stringify(newUser))

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      })

      // No return value to match AuthContextType
    } catch (error) {
      console.error("Error signing up:", error)
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
      })
      throw error
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("bitmerket_user")
    router.push("/")

    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    })
  }

  const becomeSeller = async () => {
    try {
      if (!user) {
        throw new Error("You must be logged in to become a seller")
      }

      // Update user to become a seller
      const updatedUser = await usersApi.becomeSeller(user.id)

      // Update user in state and localStorage
      setUser(updatedUser)
      localStorage.setItem("bitmerket_user", JSON.stringify(updatedUser))

      // No return value to match AuthContextType
    } catch (error) {
      console.error("Error becoming seller:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to become a seller. Please try again.",
      })
      throw error
    }
  }

  const refreshProfile = async () => {
    try {
      if (!user) {
        throw new Error("No user logged in")
      }

      // Get updated user profile
      const updatedUser = await usersApi.getUserById(user.id)

      if (!updatedUser) {
        throw new Error("User not found")
      }

      // Update user in state and localStorage
      setUser(updatedUser)
      localStorage.setItem("bitmerket_user", JSON.stringify(updatedUser))

      return updatedUser
    } catch (error) {
      console.error("Error refreshing profile:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        becomeSeller,
        refreshProfile,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
