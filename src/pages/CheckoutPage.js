"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Zap, Smartphone, Shield, Download, ExternalLink } from "lucide-react"
import Navbar from "../components/Navbar"

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [showMpesaPin, setShowMpesaPin] = useState(false)
  const [mpesaPin, setMpesaPin] = useState("")
  const [showLightningOptions, setShowLightningOptions] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [showSats, setShowSats] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedCart = localStorage.getItem("satsoko-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    } else {
      navigate("/cart")
    }
  }, [navigate])

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = showSats ? item.price.sats : item.price.usd
      return total + price * item.quantity
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method)
    if (method === "mpesa") {
      setShowMpesaPin(true)
      setShowLightningOptions(false)
    } else if (method === "lightning") {
      setShowLightningOptions(true)
      setShowMpesaPin(false)
    }
  }

  const handleMpesaPayment = () => {
    if (mpesaPin.length !== 4) {
      alert("Please enter a valid 4-digit M-Pesa PIN")
      return
    }

    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      alert("🎉 Payment successful! Your order has been placed.")
      localStorage.removeItem("satsoko-cart")
      navigate("/orders")
    }, 3000)
  }

  const handleLightningPayment = (wallet) => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      alert(`🎉 Lightning payment successful via ${wallet}! Your order has been placed.`)
      localStorage.removeItem("satsoko-cart")
      navigate("/orders")
    }, 2000)
  }

  const checkWalletInstalled = (wallet) => {
    // Simulate checking if wallet is installed
    const isInstalled = Math.random() > 0.5 // Random for demo

    if (!isInstalled) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 animate-fade-in-up">
          <div className="flex items-start space-x-3">
            <Download className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">{wallet} Not Installed</h4>
              <p className="text-yellow-700 text-sm mb-3">You need to install {wallet} to make Lightning payments.</p>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download from Play Store
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#00264D] mb-4">No items to checkout</h1>
              <Link to="/marketplace" className="text-[#FF8C1A] hover:underline">
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
          {/* Header */}
          <div className="flex items-center mb-8 animate-fade-in-up">
            <Link
              to="/cart"
              className="flex items-center text-[#FF8C1A] hover:text-[#FF8C1A]/80 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00264D] mb-2">Checkout</h1>
              <p className="text-gray-600">Complete your purchase securely</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
                <h3 className="text-xl font-semibold text-[#00264D] mb-4">Order Summary</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-[#00264D]">{item.name}</h4>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#FF8C1A]">
                          {showSats
                            ? `${(item.price.sats * item.quantity).toLocaleString()} sats`
                            : `$${item.price.usd * item.quantity}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up delay-200">
                <h3 className="text-xl font-semibold text-[#00264D] mb-6">Choose Payment Method</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* M-Pesa Option */}
                  <button
                    onClick={() => handlePaymentMethodSelect("mpesa")}
                    className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                      paymentMethod === "mpesa"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-800">M-Pesa</h4>
                        <p className="text-gray-600 text-sm">Pay with your mobile money</p>
                      </div>
                    </div>
                  </button>

                  {/* Lightning Option */}
                  <button
                    onClick={() => handlePaymentMethodSelect("lightning")}
                    className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                      paymentMethod === "lightning"
                        ? "border-[#FF8C1A] bg-orange-50"
                        : "border-gray-200 hover:border-[#FF8C1A]"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-[#FF8C1A]" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-800">Lightning Network</h4>
                        <p className="text-gray-600 text-sm">Instant Bitcoin payments</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* M-Pesa PIN Input */}
                {showMpesaPin && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 animate-fade-in-up">
                    <div className="flex items-center space-x-3 mb-4">
                      <Smartphone className="w-6 h-6 text-green-600" />
                      <h4 className="font-semibold text-green-800">M-Pesa Payment</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <p className="text-green-700 text-sm mb-2">
                          <strong>Amount:</strong> KES {(getTotalPrice() * 130).toLocaleString()}{" "}
                          {/* Assuming 1 USD = 130 KES */}
                        </p>
                        <p className="text-green-700 text-sm">
                          <strong>Merchant:</strong> SatSoko Marketplace
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">Enter your M-Pesa PIN</label>
                        <input
                          type="password"
                          maxLength="4"
                          value={mpesaPin}
                          onChange={(e) => setMpesaPin(e.target.value.replace(/\D/g, ""))}
                          placeholder="••••"
                          className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
                        />
                      </div>

                      <button
                        onClick={handleMpesaPayment}
                        disabled={mpesaPin.length !== 4 || processing}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {processing ? "Processing Payment..." : "Pay with M-Pesa"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Lightning Wallet Options */}
                {showLightningOptions && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 animate-fade-in-up">
                    <div className="flex items-center space-x-3 mb-4">
                      <Zap className="w-6 h-6 text-[#FF8C1A]" />
                      <h4 className="font-semibold text-orange-800">Lightning Payment</h4>
                    </div>

                    <div className="space-y-4">
                      {/* Bitnob Option */}
                      <div>
                        <button
                          onClick={() => handleLightningPayment("Bitnob")}
                          disabled={processing}
                          className="w-full bg-[#FF8C1A] text-white py-3 rounded-lg font-semibold hover:bg-[#FF8C1A]/90 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          {processing ? "Processing..." : "Pay with Bitnob"}
                        </button>
                        {checkWalletInstalled("Bitnob")}
                      </div>

                      {/* Blink Option */}
                      <div>
                        <button
                          onClick={() => handleLightningPayment("Blink")}
                          disabled={processing}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          {processing ? "Processing..." : "Pay with Blink"}
                        </button>
                        {checkWalletInstalled("Blink")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32 animate-fade-in-up delay-300">
                <h3 className="text-xl font-semibold text-[#00264D] mb-6">Payment Summary</h3>

                <div className="flex items-center justify-between mb-4">
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

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">
                      {showSats ? `${getTotalPrice().toLocaleString()} sats` : `$${getTotalPrice()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee</span>
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

                {/* Security Notice */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-blue-800 font-medium text-sm">Secure Payment</h4>
                      <p className="text-blue-600 text-xs mt-1">Your payment is protected by escrow and encryption.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutPage
