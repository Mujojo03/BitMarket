"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  Zap,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
} from "lucide-react"
import Navbar from "../components/Navbar"

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [showSats, setShowSats] = useState(false)

  // Mock data for seller dashboard
  const stats = {
    totalProducts: 12,
    totalSales: showSats ? 450000 : 450,
    totalOrders: 28,
    rating: 4.8,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      product: "Traditional Ankara Dress",
      customer: "Sarah K.",
      amount: { usd: 65, sats: 65000 },
      status: "pending",
      date: "2025-05-15",
      image: "https://imgs.search.brave.com/IgEh8oWakkF_VcAOp9P8WmuQ2ofkU4-2EPz0dp0rZVU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFPRnVhbWtoaUwu/anBn",
    },
    {
      id: "ORD-002",
      product: "Hand-carved Wooden Mask",
      customer: "John M.",
      amount: { usd: 85, sats: 85000 },
      status: "shipped",
      date: "2025-05-16",
      image: "https://www.retourdevoyage.com/6686-facebook_image/djimini-ligbi-masq.jpg",
    },
    {
      id: "ORD-003",
      product: "Woven Basket Set",
      customer: "Mary L.",
      amount: { usd: 35, sats: 35000 },
      status: "delivered",
      date: "2025-05-17",
      image: "https://imgs.search.brave.com/w_B40qRgcDknYdSRSA1deC03_euGFYIZkMjHFYwSeKM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFaVXJDOUhqRVMu/anBn",
    },
  ]

  const products = [
    {
      id: 1,
      name: "Traditional Ankara Dress",
      price: { usd: 65, sats: 65000 },
      image: "https://imgs.search.brave.com/IgEh8oWakkF_VcAOp9P8WmuQ2ofkU4-2EPz0dp0rZVU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFPRnVhbWtoaUwu/anBn",
      stock: 5,
      sales: 12,
      rating: 4.9,
      status: "active",
    },
    {
      id: 2,
      name: "Hand-carved Wooden Mask",
      price: { usd: 85, sats: 85000 },
      image: "https://www.retourdevoyage.com/6686-facebook_image/djimini-ligbi-masq.jpg",
      stock: 3,
      sales: 8,
      rating: 4.8,
      status: "active",
    },
    {
      id: 3,
      name: "Woven Basket Set",
      price: { usd: 35, sats: 35000 },
      image: "https://imgs.search.brave.com/w_B40qRgcDknYdSRSA1deC03_euGFYIZkMjHFYwSeKM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFaVXJDOUhqRVMu/anBn",
      stock: 0,
      sales: 15,
      rating: 4.7,
      status: "out_of_stock",
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-500" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00264D] mb-2">Seller Dashboard</h1>
              <p className="text-gray-600">Manage your products and track your sales</p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-[#00264D]">USD</span>
                <button
                  onClick={() => setShowSats(!showSats)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    showSats ? "bg-[#FF8C1A]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      showSats ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </button>
                <span className="text-[#00264D] flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  SATS
                </span>
              </div>

              <Link
                to="/add-product"
                className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-[#00264D]">{stats.totalProducts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up delay-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-[#FF8C1A]">
                    {showSats ? `${stats.totalSales.toLocaleString()} sats` : `$${stats.totalSales}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#FF8C1A]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up delay-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-[#00264D]">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up delay-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Rating</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-[#00264D] mr-2">{stats.rating}</p>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-8 animate-fade-in-up delay-400">
            <div className="flex flex-wrap border-b border-gray-200">
              {[
                { id: "overview", label: "Overview" },
                { id: "products", label: "Products" },
                { id: "orders", label: "Orders" },
                { id: "analytics", label: "Analytics" },
              ].map((tab) => (
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
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
                <h3 className="text-xl font-semibold text-[#00264D] mb-6">Recent Orders</h3>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div
                      key={order.id}
                      className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <img
                        src={order.image || "/placeholder.svg"}
                        alt={order.product}
                        className="w-16 h-16 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h4 className="font-medium text-[#00264D]">{order.product}</h4>
                        <p className="text-gray-600 text-sm">Customer: {order.customer}</p>
                        <p className="text-gray-500 text-xs">{order.date}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-[#FF8C1A] mb-1">
                          {showSats ? `${order.amount.sats.toLocaleString()} sats` : `$${order.amount.usd}`}
                        </p>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#00264D]">My Products</h3>
                <Link
                  to="/add-product"
                  className="bg-[#FF8C1A] text-white px-4 py-2 rounded-lg hover:bg-[#FF8C1A]/90 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div
                        className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status === "active" ? "Active" : "Out of Stock"}
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-semibold text-[#00264D] mb-2">{product.name}</h4>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-[#FF8C1A]">
                          {showSats ? `${product.price.sats.toLocaleString()} sats` : `$${product.price.usd}`}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                        <span>Stock: {product.stock}</span>
                        <span>Sales: {product.sales}</span>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
              <h3 className="text-xl font-semibold text-[#00264D] mb-6">All Orders</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="py-4 px-4 font-medium text-[#00264D]">{order.id}</td>
                        <td className="py-4 px-4">{order.product}</td>
                        <td className="py-4 px-4">{order.customer}</td>
                        <td className="py-4 px-4 font-semibold text-[#FF8C1A]">
                          {showSats ? `${order.amount.sats.toLocaleString()} sats` : `$${order.amount.usd}`}
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
              <h3 className="text-xl font-semibold text-[#00264D] mb-6">Analytics</h3>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">Analytics Coming Soon</h4>
                <p className="text-gray-500">Detailed sales analytics and insights will be available here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SellerDashboard