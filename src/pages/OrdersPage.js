import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, RotateCcw, HelpCircle } from 'lucide-react'
import Navbar from "../components/Navbar"
import OrderCard from "../components/OrderCard"
import { getOrders } from "../api/order"

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Simplified tabs
  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ]

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders()
        setOrders(ordersData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [])

  // Filter orders based on active tab
  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab)

  // Calculate tab counts
  const tabsWithCounts = tabs.map(tab => ({
    ...tab,
    count: tab.id === "all" 
      ? orders.length 
      : orders.filter(o => o.status === tab.id).length
  }))

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#00264D] mb-4">My Orders</h1>
            <p className="text-gray-600">Track your purchases and manage your order history</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <div className="flex flex-wrap border-b border-gray-200">
              {tabsWithCounts.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-[#FF8C1A] border-b-2 border-[#FF8C1A]"
                      : "text-gray-600 hover:text-[#00264D]"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C1A]"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-[#00264D] mb-4">Error Loading Orders</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-[#00264D] mb-4">
                {activeTab === "all" ? "No orders yet" : `No ${activeTab} orders`}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {activeTab === "all"
                  ? "You haven't placed any orders yet. Start shopping to see your orders here."
                  : `You don't have any ${activeTab} orders at the moment.`}
              </p>
              <Link
                to="/marketplace"
                className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
              >
                <Package className="w-5 h-5 mr-2" />
                {activeTab === "all" ? "Start Shopping" : "Browse Marketplace"}
              </Link>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default OrdersPage