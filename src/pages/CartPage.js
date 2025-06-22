"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { QRCodeCanvas } from "qrcode.react"
// import { createLightningInvoice } from "../api/payment";


import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Zap,
  ArrowRight,
  ShoppingCart
} from "lucide-react"
import Navbar from "../components/Navbar"

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [showSats, setShowSats] = useState(false)
  const [invoice, setInvoice] = useState(null) // For Lightning invoice

  useEffect(() => {
    const savedCart = localStorage.getItem("satsoko-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const updateCart = (newCart) => {
    setCartItems(newCart)
    localStorage.setItem("satsoko-cart", JSON.stringify(newCart))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    updateCart(updatedCart)
  }

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    updateCart(updatedCart)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = showSats ? item.price.sats : item.price.usd
      return total + price * item.quantity
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

const handleLightningCheckout = async () => {
  try {
    const satoshis = cartItems.reduce(
      (t, item) => t + item.price.sats * item.quantity,
      0
    );

    // 🔥 THIS is your own backend, not Bitnob
    const res = await axios.post("http://localhost:5000/invoices/create", {
      satoshis,
      customerEmail: "guest@example.com",
      description: `Checkout – ${getTotalItems()} item(s)`,
    });

    const { request } = res.data.data;        // Bitnob’s payload forwarded by Flask
    setInvoice({
      paymentRequest: request,
      invoiceUrl: `lightning:${request}`,
    });
  } catch (err) {
    console.error("Lightning error:", err);
    alert("Failed to create Lightning invoice – check console for details.");
  }
};


  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg p-12 text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-[#00264D] mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link
                to="/marketplace"
                className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00264D] mb-2">Shopping Cart</h1>
              <p className="text-gray-600">{getTotalItems()} items in your cart</p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-[#00264D]">USD</span>
              <button
                onClick={() => setShowSats(!showSats)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${showSats ? "bg-[#FF8C1A]" : "bg-gray-300"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${showSats ? "translate-x-7" : "translate-x-1"}`}
                ></div>
              </button>
              <span className="text-[#00264D] flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                SATS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#00264D] mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {item.seller}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-[#FF8C1A]">
                          {showSats ? `${item.price.sats.toLocaleString()} sats` : `$${item.price.usd}`}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Zap className="w-3 h-3 mr-1" />
                          Lightning
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32 animate-fade-in-up delay-300">
                <h3 className="text-xl font-semibold text-[#00264D] mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">
                      {showSats ? `${getTotalPrice().toLocaleString()} sats` : `$${getTotalPrice()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lightning Network Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-[#00264D]">Total</span>
                      <span className="text-2xl font-bold text-[#FF8C1A]">
                        {showSats ? `${getTotalPrice().toLocaleString()} sats` : `$${getTotalPrice()}`}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLightningCheckout}
                  className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center mb-4"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Pay with Lightning
                </button>

                <button
                  onClick={() => alert("M-Pesa checkout coming soon! 📲")}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mb-4"
                >
                  Pay with M-Pesa
                </button>

                <Link to="/marketplace" className="w-full border-2 border-[#FF8C1A] text-[#FF8C1A] py-3 rounded-lg font-medium hover:bg-[#FF8C1A] hover:text-white transition-all duration-300 flex items-center justify-center">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-blue-800 font-medium text-sm">Secure Payment</h4>
                      <p className="text-blue-600 text-xs mt-1">
                        Your payment is protected by Lightning Network encryption and escrow.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {invoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">Scan to Pay</h2>
            <QRCodeCanvas value={invoice.paymentRequest} size={200} />
            <p className="text-xs mt-4 break-all">{invoice.paymentRequest}</p>
            <a
              href={invoice.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-sm text-blue-600 hover:underline"
            >
              Open in Wallet ↗
            </a>
            <button
              onClick={() => setInvoice(null)}
              className="mt-4 text-sm text-gray-500 hover:text-[#FF8C1A]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CartPage