"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { authApi } from "@/lib/api-service"

interface User {
  id: string
  email: string
  fullName: string
  isSeller: boolean
  sellerRating?: number
  sellerSales: number
  lightningAddress?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => void
  becomeSeller: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('bitmarket_token')
        
        if (token) {
          // Get current user data
          const { user } = await authApi.getCurrentUser()
          setUser(user)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        // Clear invalid token
        localStorage.removeItem('bitmarket_token')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await authApi.login({ email, password })
      
      setUser(user)
      
      toast({
        title: "Welcome back!",
        description: `You've successfully signed in as ${user.fullName || user.email}`,
      })
      
      return user
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
      const { user } = await authApi.register({ email, password, fullName })
      
      setUser(user)
      
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      })
      
      return user
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
    authApi.logout()
    setUser(null)
    router.push("/")
    
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    })
  }

  const becomeSeller = async () => {
    try {
      const { user: updatedUser } = await authApi.becomeSeller()
      
      setUser(updatedUser)
      
      return updatedUser
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

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { user: updatedUser } = await authApi.updateProfile(data)
      
      setUser(updatedUser)
      
      return updatedUser
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
      })
      throw error
    }
  }

  const refreshProfile = async () => {
    try {
      const { user: updatedUser } = await authApi.getCurrentUser()
      
      setUser(updatedUser)
      
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
        updateProfile,
        refreshProfile,
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