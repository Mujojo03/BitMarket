"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, ExternalLink, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatSats } from "@/lib/utils"
import { ordersApi } from "@/lib/api-service"
import type { User, Order, OrderItem, Product } from "@/lib/mock-data"

interface AccountOrdersProps {
  user: User
}

export function AccountOrders({ user }: AccountOrdersProps) {
  const [orders, setOrders] = useState<(Order & { orderItems: (OrderItem & { product: Product })[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const orders = await ordersApi.getOrdersForUser(user.id)
      setOrders(orders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500"
      case "paid":
        return "bg-blue-500/20 text-blue-500 border-blue-500"
      case "shipped":
        return "bg-purple-500/20 text-purple-500 border-purple-500"
      case "delivered":
        return "bg-green-500/20 text-green-500 border-green-500"
      case "completed":
        return "bg-green-500/20 text-green-500 border-green-500"
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500"
      case "refunded":
        return "bg-orange-500/20 text-orange-500 border-orange-500"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchOrders} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-gray-700 p-4 mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
          <p className="text-gray-400 text-center max-w-md mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/browse">
            <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black">Browse Products</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
              </div>
              <Badge variant="outline" className={getStatusBadgeColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-20 h-20 bg-gray-700 rounded-md overflow-hidden relative flex-shrink-0">
                    <img
                      src={item.product.imageUrl || "/placeholder.svg"}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Link href={`/product/${item.product.id}`} className="font-medium hover:text-bitcoin">
                        {item.product.name}
                      </Link>
                      <div className="text-bitcoin font-medium">{formatSats(item.price)} sats</div>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Quantity: {item.quantity}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {item.product.isDigital ? "Digital Product" : "Physical Product"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-700" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-lg font-bold text-bitcoin">{formatSats(order.totalAmount)} sats</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {order.status === "paid" && (
                  <Button variant="outline" className="border-bitcoin text-bitcoin">
                    <Package className="mr-2 h-4 w-4" /> Track Order
                  </Button>
                )}
                {order.lightningInvoice && (
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Invoice
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
