"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { login } from "../../api/auth"

const LoginPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("buyer")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const creds = {
      email: formData.email,
      password: formData.password,
    }
    const { ok, data } = await login(creds)
    if (ok) {
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      navigate(role === "seller" ? "/add-product" : "/cart")
    } else {
      alert(data.msg || "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00264D] to-blue-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 animate-bounce">
          <Zap className="w-8 h-8 text-[#FF8C1A] opacity-30" />
        </div>
        <div className="absolute top-40 left-20 animate-pulse">
          <div className="w-4 h-4 bg-[#FF8C1A] rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-40 right-20 animate-bounce delay-1000">
          <div className="w-3 h-3 bg-white rounded-full opacity-30"></div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SatSoko</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Continue your Bitcoin Lightning journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">Login as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                className="w-4 h-4 text-[#FF8C1A] border-gray-300 rounded focus:ring-[#FF8C1A]"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/auth/forgot-password" className="text-sm text-[#FF8C1A] hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            Log In
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-[#FF8C1A] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Quick Login Options */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-[#FF8C1A]" />
            Quick Access
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => alert("Lightning wallet login coming soon! ⚡")}
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
            >
              🔗 Login with Lightning Wallet
            </button>
            <button
              onClick={() => alert("Bitnob integration coming soon! 🚀")}
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
            >
              ⚡ Login with Bitnob
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-500/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-300 mt-0.5" />
            <div>
              <h4 className="text-blue-200 font-medium text-sm">Secure Login</h4>
              <p className="text-blue-300 text-xs mt-1">
                Your login is protected with end-to-end encryption and Lightning Network security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage