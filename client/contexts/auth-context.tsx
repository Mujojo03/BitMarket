"use client"

import { createContext, useContext, useState } from "react"
import { useRouter } from "next/navigation"

const API_BASE = "http://localhost:5000"  // Or the deployed Flask API base

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")

      // Optionally store token or user info
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/")  // redirect to home/dashboard
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/register/buyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Registration failed")
      
      router.push("/login?registered=true")  // Optional redirect
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signUp, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)