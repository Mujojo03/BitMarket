"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { Order as SharedOrder } from "@/lib/types"
import $ from "jquery"

interface OrderContextType {
  orders: SharedOrder[]
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No token found")
      }

      const data = await new Promise<any[]>((resolve, reject) => {
        $.ajax({
          url: "http://localhost:5000/orders",
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          success: (res) => resolve(res),
          error: (xhr) => {
            console.error("AJAX error:", xhr.responseText)
            reject(new Error("Failed to fetch orders"))
          },
        })
      })

      setOrders(data)
    } catch (err: any) {
      console.error("Error fetching orders:", err)
      setError(err.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <OrderContext.Provider
      value={{
        orders: orders as SharedOrder[],
        loading,
        error,
        fetchOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
