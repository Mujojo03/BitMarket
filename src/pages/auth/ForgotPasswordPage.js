"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Phone, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"

const ForgotPasswordPage = () => {
  const [resetMethod, setResetMethod] = useState("email")
  const [step, setStep] = useState("request")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setStep("sent")
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (step === "sent") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00264D] to-blue-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#00264D] mb-4">
              Check Your {resetMethod === "email" ? "Email" : "Phone"}
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset {resetMethod === "email" ? "link" : "code"} to{" "}
              <span className="font-medium">{resetMethod === "email" ? formData.email : formData.phone}</span>
            </p>
            <div className="space-y-4">
              <button
                onClick={() => alert("Resend functionality coming soon!")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Resend {resetMethod === "email" ? "Email" : "Code"}
              </button>
              <Link
                to="/auth/login"
                className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Back to Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00264D] to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-300">We'll help you get back into your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          {/* Reset Method Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-3">
              How would you like to reset your password?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResetMethod("email")}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  resetMethod === "email" ? "bg-[#FF8C1A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => setResetMethod("phone")}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  resetMethod === "phone" ? "bg-[#FF8C1A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📱 SMS
              </button>
            </div>
          </div>

          {/* Email or Phone */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#00264D] mb-2">
              {resetMethod === "email" ? "Email Address" : "Phone Number"}
            </label>
            <div className="relative">
              {resetMethod === "email" ? (
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              ) : (
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              )}
              <input
                type={resetMethod === "email" ? "email" : "tel"}
                value={resetMethod === "email" ? formData.email : formData.phone}
                onChange={(e) => handleInputChange(resetMethod, e.target.value)}
                placeholder={resetMethod === "email" ? "Enter your email address" : "Enter your phone number"}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {resetMethod === "email"
                ? "We'll send a reset link to this email address"
                : "We'll send a verification code to this phone number"}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            Send Reset {resetMethod === "email" ? "Link" : "Code"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link to="/auth/login" className="text-[#FF8C1A] hover:underline font-medium inline-flex items-center">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
