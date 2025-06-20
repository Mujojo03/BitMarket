"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Zap, ShoppingCart, Menu, X, Plus, BarChart3 } from "lucide-react"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("satsoko-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 transition-all duration-300">
      <div
        className={`bg-[#00264D]/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 ${
          isScrolled ? "shadow-2xl" : ""
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SatSoko</span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-white hover:text-[#FF8C1A] transition-colors ${
                  location.pathname === "/" ? "text-[#FF8C1A]" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className={`text-white hover:text-[#FF8C1A] transition-colors ${
                  location.pathname === "/marketplace" ? "text-[#FF8C1A]" : ""
                }`}
              >
                Marketplace
              </Link>
              <Link
                to="/about"
                className={`text-white hover:text-[#FF8C1A] transition-colors ${
                  location.pathname === "/about" ? "text-[#FF8C1A]" : ""
                }`}
              >
                About
              </Link>
              <Link
                to="/orders"
                className={`text-white hover:text-[#FF8C1A] transition-colors ${
                  location.pathname === "/orders" ? "text-[#FF8C1A]" : ""
                }`}
              >
                Orders
              </Link>
              <Link
                to="/add-product"
                className={`text-white hover:text-[#FF8C1A] transition-colors ${
                  location.pathname === "/add-product" ? "text-[#FF8C1A]" : ""
                }`}
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Sell
              </Link>
              <Link
                to="/seller/dashboard"
                className={`text-white hover:text-[#FF8C1A] transition-colors ${
                  location.pathname === "/seller/dashboard" ? "text-[#FF8C1A]" : ""
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 text-white hover:text-[#FF8C1A] transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF8C1A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/auth/login"
                className="text-white hover:text-[#FF8C1A] transition-colors px-4 py-2 hidden md:block"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 hidden md:block"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-fade-in-up">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className={`text-white hover:text-[#FF8C1A] transition-colors ${
                    location.pathname === "/" ? "text-[#FF8C1A]" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/marketplace"
                  className={`text-white hover:text-[#FF8C1A] transition-colors ${
                    location.pathname === "/marketplace" ? "text-[#FF8C1A]" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  to="/about"
                  className={`text-white hover:text-[#FF8C1A] transition-colors ${
                    location.pathname === "/about" ? "text-[#FF8C1A]" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/orders"
                  className={`text-white hover:text-[#FF8C1A] transition-colors ${
                    location.pathname === "/orders" ? "text-[#FF8C1A]" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/add-product"
                  className={`text-white hover:text-[#FF8C1A] transition-colors ${
                    location.pathname === "/add-product" ? "text-[#FF8C1A]" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Sell
                </Link>
                <Link
                  to="/seller/dashboard"
                  className={`text-white hover:text-[#FF8C1A] transition-colors ${
                    location.pathname === "/seller/dashboard" ? "text-[#FF8C1A]" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  Dashboard
                </Link>
                <div className="flex space-x-2 pt-2">
                  <Link
                    to="/auth/login"
                    className="text-white hover:text-[#FF8C1A] transition-colors px-4 py-2 border border-white/20 rounded-lg flex-1 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex-1 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

