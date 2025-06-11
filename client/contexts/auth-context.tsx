"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { User } from "@/lib/types"
import $ from "jquery"

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: "buyer" | "seller"
  ) => Promise<void>
  signOut: () => void
  becomeSeller: () => Promise<User>
  refreshProfile: () => Promise<User>
  updateProfile: (data: Partial<User>) => Promise<User> // ✅ Added here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("bitmerket_user")
    const storedToken = localStorage.getItem("bitmerket_token")
    if (storedUser) setUser(JSON.parse(storedUser) as User)
    if (storedToken) setToken(storedToken)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      $.ajax({
        url: "http://localhost:5000/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email, password }),
        success: (data) => {
          const { access_token, user, roles } = data
          const userWithRoles = { ...user, roles }
          localStorage.setItem("bitmerket_token", access_token)
          localStorage.setItem("bitmerket_user", JSON.stringify(userWithRoles))
          setUser(userWithRoles)
          setToken(access_token)
          toast({ title: "Logged in successfully" })
          router.push("/")
          resolve()
        },
        error: (jqXHR) => {
          const message = jqXHR.responseJSON?.message || "Login failed"
          toast({ title: "Login Error", description: message, variant: "destructive" })
          reject(new Error(message))
        },
      })
    })
  }

  const signUp = async  (
    email: string,
    password: string,
    fullName: string,
    role: "buyer" | "seller" = "buyer"
  ) => {
    return new Promise<void>((resolve, reject) => {
      $.ajax({
        url: `http://localhost:5000/register/${role}`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ username: fullName, email, password }),
        success: (data) => {
          const { access_token, data: user } = data
          const userWithRoles = { ...user, roles: [role] }
          localStorage.setItem("bitmerket_token", access_token)
          localStorage.setItem("bitmerket_user", JSON.stringify(userWithRoles))
          setUser(userWithRoles)
          setToken(access_token)
          toast({ title: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` })
          router.push("/")
          resolve()
        },
        error: (jqXHR) => {
          const message = jqXHR.responseJSON?.message || "Signup failed"
          toast({ title: "Signup Error", description: message, variant: "destructive" })
          reject(new Error(message))
        },
      })
    })
  }

  const signOut = () => {
    localStorage.removeItem("bitmerket_token")
    localStorage.removeItem("bitmerket_user")
    setUser(null)
    setToken(null)
    toast({ title: "Signed out successfully" })
    router.push("/login")
  }

  const becomeSeller = (): Promise<User> => {
    if (!user) return Promise.reject(new Error("No user logged in"))
    if (!token) return Promise.reject(new Error("No auth token found"))

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://localhost:5000/users/${user.id}`,
        method: "PATCH",
        contentType: "application/json",
        headers: { Authorization: `Bearer ${token}` },
        data: JSON.stringify({ roles: ["buyer", "seller"] }),
        success: (data) => {
          const updatedUser = { ...data.data, roles: data.data.roles }
          localStorage.setItem("bitmerket_user", JSON.stringify(updatedUser))
          setUser(updatedUser)
          toast({ title: "You are now a seller!" })
          resolve(updatedUser)
        },
        error: (xhr) => {
          const message = xhr.responseJSON?.message || "Failed to become seller"
          toast({ title: "Error", description: message, variant: "destructive" })
          reject(new Error(message))
        },
      })
    })
  }

  const refreshProfile = (): Promise<User> => {
    if (!user) return Promise.reject(new Error("Not logged in"))
    const token = localStorage.getItem("bitmerket_token")
    if (!token) return Promise.reject(new Error("No auth token found"))

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://localhost:5000/users/${user.id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        success: (data) => {
          const refreshedUser = { ...data.data, roles: data.data.roles }
          setUser(refreshedUser)
          localStorage.setItem("bitmerket_user", JSON.stringify(refreshedUser))
          resolve(refreshedUser)
        },
        error: (xhr) => {
          const message = xhr.responseJSON?.message || "Failed to fetch profile"
          reject(new Error(message))
        },
      })
    })
  }

  // ✅ Added updateProfile
  const updateProfile = (data: Partial<User>): Promise<User> => {
    if (!user) return Promise.reject(new Error("Not logged in"))
    if (!token) return Promise.reject(new Error("No auth token found"))

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://localhost:5000/users/${user.id}`,
        method: "PATCH",
        contentType: "application/json",
        headers: { Authorization: `Bearer ${token}` },
        data: JSON.stringify(data),
        success: (res) => {
          const updatedUser = { ...res.data, roles: res.data.roles }
          setUser(updatedUser)
          localStorage.setItem("bitmerket_user", JSON.stringify(updatedUser))
          resolve(updatedUser)
        },
        error: (xhr) => {
          const message = xhr.responseJSON?.message || "Failed to update profile"
          reject(new Error(message))
        },
      })
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        becomeSeller,
        refreshProfile,
        updateProfile, // ✅ Included in context
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// "use client"

// import type React from "react"

// import { createContext, useContext, useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useToast } from "@/components/ui/use-toast"
// // import { mockUsers, type User } from "@/lib/mock-data"
// // import { usersApi } from "@/lib/api-service"

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   signIn: (email: string, password: string) => Promise<void>
//   signUp: (email: string, password: string, fullName: string) => Promise<void>
//   signOut: () => void
//   becomeSeller: () => Promise<void>
//   refreshProfile: () => Promise<User>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const { toast } = useToast()

//   // Check for existing session on mount
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const storedUser = localStorage.getItem("bitmerket_user")
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser)
//           setUser(parsedUser)
//         }
//       } catch (error) {
//         console.error("Error checking session:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     checkSession()
//   }, [])

//   // const signIn = async (email: string, password: string) => {
//   //   try {
//   //     // For demo purposes, we'll just find a user with matching email
//   //     const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

//   //     if (!foundUser) {
//   //       throw new Error("Invalid email or password")
//   //     }

//   //     // In a real app, we would verify the password here

//   //     // Set user in state and localStorage
//   //     setUser(foundUser)
//   //     localStorage.setItem("bitmerket_user", JSON.stringify(foundUser))

//   //     toast({
//   //       title: "Welcome back!",
//   //       description: `You've successfully signed in as ${foundUser.fullName || foundUser.email}`,
//   //     })

//   //     // No return value to match AuthContextType
//   //   } catch (error) {
//   //     console.error("Error signing in:", error)
//   //     toast({
//   //       variant: "destructive",
//   //       title: "Sign in failed",
//   //       description: error instanceof Error ? error.message : "Failed to sign in. Please try again.",
//   //     })
//   //     throw error
//   //   }
//   // }

//   // const signUp = async (email: string, password: string, fullName: string) => {
//   //   try {
//   //     // Check if user already exists
//   //     const existingUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

//   //     if (existingUser) {
//   //       throw new Error("User with this email already exists")
//   //     }

//   //     // Create new user
//   //     const newUser: User = {
//   //       id: `user${Date.now()}`,
//   //       email,
//   //       fullName,
//   //       isSeller: false,
//   //       sellerRating: 0,
//   //       sellerSales: 0,
//   //       createdAt: new Date().toISOString(),
//   //     }

//   //     // Add to mock users (in a real app, this would be a database operation)
//   //     mockUsers.push(newUser)

//   //     // Set user in state and localStorage
//   //     setUser(newUser)
//   //     localStorage.setItem("bitmerket_user", JSON.stringify(newUser))

//   //     toast({
//   //       title: "Account created!",
//   //       description: "Your account has been created successfully.",
//   //     })

//   //     // No return value to match AuthContextType
//   //   } catch (error) {
//   //     console.error("Error signing up:", error)
//   //     toast({
//   //       variant: "destructive",
//   //       title: "Sign up failed",
//   //       description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
//   //     })
//   //     throw error
//   //   }
//   // }

//   // const signOut = () => {
//   //   setUser(null)
//   //   localStorage.removeItem("bitmerket_user")
//   //   router.push("/")

//   //   toast({
//   //     title: "Signed out",
//   //     description: "You've been signed out successfully.",
//   //   })
//   // }

//   // const becomeSeller = async () => {
//   //   try {
//   //     if (!user) {
//   //       throw new Error("You must be logged in to become a seller")
//   //     }

//   //     // Update user to become a seller
//   //     const updatedUser = await usersApi.becomeSeller(user.id)

//   //     // Update user in state and localStorage
//   //     setUser(updatedUser)
//   //     localStorage.setItem("bitmerket_user", JSON.stringify(updatedUser))

//   //     // No return value to match AuthContextType
//   //   } catch (error) {
//   //     console.error("Error becoming seller:", error)
//   //     toast({
//   //       variant: "destructive",
//   //       title: "Error",
//   //       description: error instanceof Error ? error.message : "Failed to become a seller. Please try again.",
//   //     })
//   //     throw error
//   //   }
//   // }
//   const signIn = async (email: string, password: string) => {
//   try {
//     // Accept any email/password (basic version
//     const loggedInUser: User = {
//       id: `user-${Date.now()}`,
//       email,
//       fullName: "",
//       isSeller: false, // Default value; change this if needed
//       sellerRating: 0,
//       sellerSales: 0,
//       createdAt: new Date().toISOString(),
//     }

//     // Save to state/localStorage
//     setUser(loggedInUser)
//     localStorage.setItem("bitmerket_user", JSON.stringify(loggedInUser))

//     toast({
//       title: "Welcome back!",
//       description: `You've successfully signed in as ${email}`,
//     })

//     // 🚀 Redirect based on user role
//     if (loggedInUser.isSeller) {
//       router.push("/seller/dashboard")
//     } else {
//       router.push("/") // Or any landing page for regular users
//     }

//   } catch (error) {
//     console.error("Error signing in:", error)
//     toast({
//       variant: "destructive",
//       title: "Sign in failed",
//       description: error instanceof Error ? error.message : "Failed to sign in. Please try again.",
//     })
//     throw error
//   }
// }

// const signUp = async (email: string, password: string, fullName: string) => {
//   try {
//     // Placeholder for sign-up logic (e.g., API call)
//     console.log("Signing up:", { email, password, fullName })

//     // Example: Pretend sign-up succeeded
//     toast({
//       title: "Account created",
//       description: `Welcome, ${fullName}`,
//     })
//     //log user in
//     console.log("User signed up:", { email, fullName })

//   } catch (error) {
//     console.error("Sign up error:", error)
//     toast({
//       variant: "destructive",
//       title: "Sign up failed",
//       description: "Unable to create account. Please try again.",
//     })
//     throw error
//   }
// }

// const signOut = () => {
//   // Remove user from state
//   setUser(null)

//   // Delete user from localStorage
//   localStorage.removeItem("bitmerket_user")

//   console.log("user logged out")

//   // Redirect to login page
//   router.push("/login")

//   // Show toast
//   toast({
//     title: "Account deleted",
//     description: "You have been signed out successfully.",
//   })
// }


// const becomeSeller = async () => {
//   try {
//     // Placeholder for become-seller logic (e.g., API call)
//     console.log("Becoming seller")

//     toast({
//       title: "You're now a seller!",
//       description: "Seller features unlocked.",
//     })
//   } catch (error) {
//     console.error("Become seller error:", error)
//     toast({
//       variant: "destructive",
//       title: "Error",
//       description: "Failed to become a seller. Try again later.",
//     })
//     throw error
//   }
// }


//   const refreshProfile = async () => {
//     try {
//       if (!user) {
//         throw new Error("No user logged in")
//       }

//       // Get updated user profile
//       const updatedUser = await usersApi.getUserById(user.id)

//       if (!updatedUser) {
//         throw new Error("User not found")
//       }

//       // Update user in state and localStorage
//       setUser(updatedUser)
//       localStorage.setItem("bitmerket_user", JSON.stringify(updatedUser))

//       return updatedUser
//     } catch (error) {
//       console.error("Error refreshing profile:", error)
//       throw error
//     }
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signIn,
//         signUp,
//         signOut,
//         becomeSeller,
//         refreshProfile,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
