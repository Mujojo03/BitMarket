"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signup, login } from "../../api/auth"          // ⬅️ added login import
import {
  Eye, EyeOff, Zap, User, Mail, Lock,
  ArrowRight, CheckCircle
} from "lucide-react"
import { SellerDashboard } from '../SellerDashboard';

const SignupPage = () => {
  const navigate = useNavigate()

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("buyer")      // buyer | seller toggle
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    lightningAddress: "",
  })

  const handleInputChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      username: formData.username,
      email:    formData.email,
      password: formData.password,
    }

    const { ok, data } = await signup(userType, payload)

    if (!ok) {
      alert(data.msg || "Signup failed")
      return
    }

    const creds = { email: formData.email, password: formData.password }
    const { ok: loginOk, data: loginData } = await login(creds)

    if (!loginOk) {
      // Fallback: ask user to log in manually
      alert("Account created! Please log in.")
      navigate("/auth/login")
      return
    }

    // Store token / user locally
    localStorage.setItem("token", loginData.access_token)
    localStorage.setItem("user",  JSON.stringify(loginData.user))

    navigate(userType === "seller" ? "/seller-dashboard" : "/cart")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00264D] to-blue-900 flex items-center justify-center p-4">

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SatSoko</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Join SatSoko</h1>
          <p className="text-gray-300">Start your Bitcoin Lightning journey</p>
        </div>

        {/* Buyer / Seller toggle */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setUserType("buyer")}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                userType === "buyer"
                  ? "bg-white text-[#00264D] shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              🛒 I want to buy
            </button>
            <button
              type="button"
              onClick={() => setUserType("seller")}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                userType === "seller"
                  ? "bg-white text-[#00264D] shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              🛍️ I want to sell
            </button>
          </div>
        </div>

        {/* -------------------- SIGN‑UP FORM -------------------- */}
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.username}
                onChange={e => handleInputChange("username", e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={e => handleInputChange("password", e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Lightning Address (optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">
              Lightning Address (Optional)
              <span className="text-xs text-gray-500 ml-2">e.g., user@bitnob.com</span>
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.lightningAddress}
                onChange={e => handleInputChange("lightningAddress", e.target.value)}
                placeholder="your-address@bitnob.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You can add this later in your profile settings
            </p>
          </div>

          {/* Terms */}
          <div className="mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-[#FF8C1A] border-gray-300 rounded focus:ring-[#FF8C1A]"
              />
              <span className="text-sm text-gray-600">
                I agree to SatSoko’s{" "}
                <Link to="/auth/terms" className="text-[#FF8C1A] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/auth/privacy" className="text-[#FF8C1A] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            Create Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-[#FF8C1A] hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </form>

        {/* Benefits box (unchanged) */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-[#FF8C1A]" /> Why join SatSoko?
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-[#FF8C1A]" /> Instant Bitcoin Lightning payments
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-[#FF8C1A]" /> Secure escrow protection
            </li>
            <li className="flex items-center">
              <User className="w-4 h-4 mr-2 text-[#FF8C1A]" /> Connect with African entrepreneurs
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SignupPage