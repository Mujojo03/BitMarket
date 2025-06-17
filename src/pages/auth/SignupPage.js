"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Zap, User, Mail, Phone, Lock, ArrowRight, CheckCircle } from "lucide-react"

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("buyer")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    lightningAddress: "",
    contactMethod: "email",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`🎉 Welcome to SatSoko! Account creation for ${userType}s coming soon!`)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00264D] to-blue-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-bounce">
          <Zap className="w-8 h-8 text-[#FF8C1A] opacity-30" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse">
          <div className="w-4 h-4 bg-[#FF8C1A] rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-1000">
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
          <h1 className="text-3xl font-bold text-white mb-2">Join SatSoko</h1>
          <p className="text-gray-300">Start your Bitcoin Lightning journey</p>
        </div>

        {/* User Type Toggle */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setUserType("buyer")}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                userType === "buyer" ? "bg-white text-[#00264D] shadow-lg" : "text-white hover:bg-white/10"
              }`}
            >
              🛒 I want to buy
            </button>
            <button
              onClick={() => setUserType("seller")}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                userType === "seller" ? "bg-white text-[#00264D] shadow-lg" : "text-white hover:bg-white/10"
              }`}
            >
              🛍️ I want to sell
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Contact Method Toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#00264D] mb-2">How would you like to be contacted?</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleInputChange("contactMethod", "email")}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  formData.contactMethod === "email"
                    ? "bg-[#FF8C1A] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("contactMethod", "phone")}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  formData.contactMethod === "phone"
                    ? "bg-[#FF8C1A] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📱 Phone
              </button>
            </div>
          </div>

          {/* Email or Phone */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">
              {formData.contactMethod === "email" ? "Email Address" : "Phone Number"}
            </label>
            <div className="relative">
              {formData.contactMethod === "email" ? (
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              ) : (
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              )}
              <input
                type={formData.contactMethod === "email" ? "email" : "tel"}
                value={formData.contactMethod === "email" ? formData.email : formData.phone}
                onChange={(e) => handleInputChange(formData.contactMethod, e.target.value)}
                placeholder={
                  formData.contactMethod === "email" ? "Enter your email address" : "Enter your phone number"
                }
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
                placeholder="Create a strong password"
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

          {/* Lightning Address (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">
              Lightning Address (Optional)
              <span className="text-xs text-gray-500 ml-2">e.g., user@bitnob.com</span>
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.lightningAddress}
                onChange={(e) => handleInputChange("lightningAddress", e.target.value)}
                placeholder="your-address@bitnob.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">You can add this later in your profile settings</p>
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
                I agree to SatSoko's{" "}
                <Link to="/terms" className="text-[#FF8C1A] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#FF8C1A] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            Create Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-[#FF8C1A] hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </form>

        {/* Benefits */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-[#FF8C1A]" />
            Why join SatSoko?
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-[#FF8C1A]" />
              Instant Bitcoin Lightning payments
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-[#FF8C1A]" />
              Secure escrow protection
            </li>
            <li className="flex items-center">
              <User className="w-4 h-4 mr-2 text-[#FF8C1A]" />
              Connect with African entrepreneurs
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
