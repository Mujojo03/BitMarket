import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, Star, MessageCircle, RotateCcw, HelpCircle, Zap } from 'lucide-react'
import Navbar from "../components/Navbar"

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all")

  const tabs = [
    { id: "all", label: "All Orders", count: 0 },
    { id: "processing", label: "Processing", count: 0 },
    { id: "shipped", label: "Shipped", count: 0 },
    { id: "delivered", label: "Delivered", count: 0 },
    { id: "cancelled", label: "Cancelled", count: 0 },
  ]

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
              {tabs.map((tab) => (
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
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-[#00264D] mb-4">No orders yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/marketplace"
              className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              <Package className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrdersPage