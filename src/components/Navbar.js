"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, ShoppingCart } from "lucide-react";
import { useApp } from "../contexts/AppContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const firstLetter = user?.username?.[0]?.toUpperCase() || "U";

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 transition-all duration-300">
      <div
        className={`bg-[#00264D]/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 ${
          isScrolled ? "shadow-2xl" : ""
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SatSoko</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-white hover:text-[#FF8C1A] ${
                  location.pathname === "/" ? "text-[#FF8C1A]" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className={`text-white hover:text-[#FF8C1A] ${
                  location.pathname === "/marketplace" ? "text-[#FF8C1A]" : ""
                }`}
              >
                Marketplace
              </Link>
              <Link
                to="/about"
                className={`text-white hover:text-[#FF8C1A] ${
                  location.pathname === "/about" ? "text-[#FF8C1A]" : ""
                }`}
              >
                About
              </Link>
              <Link
                to="/orders"
                className={`text-white hover:text-[#FF8C1A] ${
                  location.pathname === "/orders" ? "text-[#FF8C1A]" : ""
                }`}
              >
                Orders
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                to="/cart"
                className={`text-white hover:text-[#FF8C1A] ${
                  location.pathname === "/cart" ? "text-[#FF8C1A]" : ""
                }`}
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>

              {/* If logged in: Show Profile Letter */}
              {user ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="bg-[#FF8C1A] text-white rounded-full w-9 h-9 flex items-center justify-center font-bold"
                  title="Profile"
                >
                  {firstLetter}
                </button>
              ) : (
                <>
                  <Link to="/auth/login" className="text-white hover:text-[#FF8C1A] px-3">
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
