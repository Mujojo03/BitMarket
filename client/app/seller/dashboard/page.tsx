"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bitcoin, Package, ShoppingCart, Wallet, Plus, ArrowUpRight, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
// import { productsApi, ordersApi } from "@/lib/api-service"
// import type { Product, Order } from "@/lib/mock-data"

export default function SellerDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<(Product & { category: any; seller: any })[]>([])
  const [orders, setOrders] = useState<(Order & { orderItems: any[] })[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user && !user.isSeller) {
      router.push("/seller/create")
      return
    }

    const fetchData = async () => {
      try {
        if (user) {
          const [fetchedProducts, fetchedOrders] = await Promise.all([
            productsApi.getProducts({ sellerId: user.id }),
            ordersApi.getOrdersForUser(user.id),
          ])
          setProducts(fetchedProducts)
          setOrders(fetchedOrders)
        }
      } catch (error) {
        console.error("Error fetching seller data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your seller data. Please try again.",
        })
      } finally {
        setLoadingData(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, loading, router, toast])

  const calculateTotalEarnings = () => {
    return orders.filter((order) => order.status === "completed").reduce((total, order) => total + order.totalAmount, 0)
  }

  if (loading || loadingData) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your products, view orders, and track your earnings.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/seller/create-product">
            <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">
              <Plus className="mr-2 h-4 w-4" /> Create New Product
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-gray-800 border-b border-gray-700 mb-8">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="flex-1">
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex-1">
            Orders
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex-1">
            Earnings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-gray-400 mt-1">
                  {products.length === 0
                    ? "No products listed yet"
                    : products.length === 1
                      ? "1 product listed"
                      : `${products.length} products listed`}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-gray-400 mt-1">
                  {orders.length === 0
                    ? "No orders received yet"
                    : orders.length === 1
                      ? "1 order received"
                      : `${orders.length} orders received`}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <Wallet className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  <Bitcoin className="h-5 w-5 text-bitcoin mr-1" />
                  {calculateTotalEarnings().toLocaleString()} sats
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {calculateTotalEarnings() === 0
                    ? "No earnings yet"
                    : `From ${orders.filter((order) => order.status === "completed").length} completed orders`}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Active Listings</CardTitle>
                  <Link href="/seller/products">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View All <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Your currently listed products</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-6">
                    <Package className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No active listings yet.</h3>
                    <p className="text-sm text-gray-400 mb-4">Create your first product to get started.</p>
                    <Link href="/seller/create-product">
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Create Product
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={product.imageUrl || "/placeholder.svg?height=50&width=50"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{product.name}</h4>
                          <div className="flex items-center text-xs text-gray-400">
                            <Bitcoin className="h-3 w-3 text-bitcoin mr-1" />
                            <span>{product.price.toLocaleString()} sats</span>
                          </div>
                        </div>
                        <Link href={`/product/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {products.length > 0 && (
                <CardFooter>
                  <Link href="/seller/create-product" className="w-full">
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add New Product
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/seller/orders">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View All <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Your most recent customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-6">
                    <ShoppingCart className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No orders yet.</h3>
                    <p className="text-sm text-gray-400">Orders will appear here once customers make purchases.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            order.status === "completed"
                              ? "bg-green-500/20 text-green-500"
                              : order.status === "cancelled" || order.status === "refunded"
                                ? "bg-red-500/20 text-red-500"
                                : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">Order #{order.id.substring(0, 8)}</h4>
                          <div className="flex items-center text-xs">
                            <span
                              className={
                                order.status === "completed"
                                  ? "text-green-500"
                                  : order.status === "cancelled" || order.status === "refunded"
                                    ? "text-red-500"
                                    : "text-yellow-500"
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <span className="text-gray-400 mx-1">•</span>
                            <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Bitcoin className="h-3 w-3 text-bitcoin mr-1" />
                          <span>{order.totalAmount.toLocaleString()} sats</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Products</CardTitle>
                <Link href="/seller/create-product">
                  <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">
                    <Plus className="mr-2 h-4 w-4" /> Add New Product
                  </Button>
                </Link>
              </div>
              <CardDescription>Manage your product listings</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No products listed yet</h3>
                  <p className="text-gray-400 mb-6">Start selling by creating your first product listing.</p>
                  <Link href="/seller/create-product">
                    <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="bg-gray-700 border-gray-600">
                      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={product.imageUrl || "/placeholder.svg?height=200&width=300"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.isFeatured && (
                          <div className="absolute top-2 right-2 bg-bitcoin text-black text-xs font-medium px-2 py-1 rounded">
                            Featured
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex items-center text-sm text-gray-400">
                          <span>{product.category?.name || "Uncategorized"}</span>
                          <span className="mx-1">•</span>
                          <span>{product.isDigital ? "Digital" : "Physical"}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center text-lg font-bold mb-2">
                          <Bitcoin className="h-4 w-4 text-bitcoin mr-1" />
                          <span>{product.price.toLocaleString()} sats</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{product.description}</p>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Link href={`/product/${product.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View
                          </Button>
                        </Link>
                        <Link href={`/seller/edit-product/${product.id}`} className="flex-1">
                          <Button className="w-full">Edit</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>Manage and track customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                  <p className="text-gray-400">Orders will appear here once customers make purchases.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-sm">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Items</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Total</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-700">
                          <td className="py-3 px-4 text-sm">#{order.id.substring(0, 8)}</td>
                          <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "completed"
                                  ? "bg-green-500/20 text-green-500"
                                  : order.status === "cancelled" || order.status === "refunded"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-yellow-500/20 text-yellow-500"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? "s" : ""}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            <div className="flex items-center justify-end">
                              <Bitcoin className="h-3 w-3 text-bitcoin mr-1" />
                              <span>{order.totalAmount.toLocaleString()} sats</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <Wallet className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  <Bitcoin className="h-5 w-5 text-bitcoin mr-1" />
                  {calculateTotalEarnings().toLocaleString()} sats
                </div>
                <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter((order) => order.status === "completed").length}
                </div>
                <p className="text-xs text-gray-400 mt-1">Successfully fulfilled orders</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  <Bitcoin className="h-5 w-5 text-bitcoin mr-1" />
                  {orders.length > 0
                    ? Math.round(
                        orders.reduce((total, order) => total + order.totalAmount, 0) / orders.length,
                      ).toLocaleString()
                    : 0}{" "}
                  sats
                </div>
                <p className="text-xs text-gray-400 mt-1">Average value per order</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Your Earnings</CardTitle>
              <CardDescription>Track your sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {calculateTotalEarnings() === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No earnings yet</h3>
                  <p className="text-gray-400 mb-6">Start selling to see your earnings here.</p>
                  <Link href="/seller/create-product">
                    <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">Create a Product</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="h-64 w-full bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Earnings chart will be displayed here</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-sm">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Items</th>
                          <th className="text-right py-3 px-4 font-medium text-sm">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter((order) => order.status === "completed")
                          .map((order) => (
                            <tr key={order.id} className="border-b border-gray-700">
                              <td className="py-3 px-4 text-sm">#{order.id.substring(0, 8)}</td>
                              <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4 text-sm">
                                {order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? "s" : ""}
                              </td>
                              <td className="py-3 px-4 text-sm text-right">
                                <div className="flex items-center justify-end">
                                  <Bitcoin className="h-3 w-3 text-bitcoin mr-1" />
                                  <span>{order.totalAmount.toLocaleString()} sats</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
