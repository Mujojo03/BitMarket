import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Zap, Shield, Wallet, ShoppingBag, Package, CheckCircle, ArrowRight, Mail, Phone, MapPin } from 'lucide-react'
import Navbar from "../components/Navbar"

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-[#00264D] to-blue-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">How SatSoko Works</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              SatSoko is a Bitcoin-native marketplace that connects buyers and sellers worldwide through the Lightning
              Network.
            </p>
          </div>
        </section>

        {/* For Buyers Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#00264D] text-center mb-12">For Buyers</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-10 h-10 text-white" />
                  </div>
                  <div className="bg-[#00264D] text-white rounded-full px-6 py-2 text-sm font-semibold mb-4 inline-block">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-[#00264D] mb-4">Connect Your Wallet</h3>
                  <p className="text-gray-700">
                    Connect your Lightning wallet (like Bitnob) to SatSoko to make instant Bitcoin payments.
                  </p>
                </div>

                <div className="text-center animate-fade-in-up delay-200">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </div>
                  <div className="bg-[#00264D] text-white rounded-full px-6 py-2 text-sm font-semibold mb-4 inline-block">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-[#00264D] mb-4">Browse & Purchase</h3>
                  <p className="text-gray-700">
                    Browse products from African sellers worldwide and make purchases with Bitcoin.
                  </p>
                </div>

                <div className="text-center animate-fade-in-up delay-300">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <div className="bg-[#00264D] text-white rounded-full px-6 py-2 text-sm font-semibold mb-4 inline-block">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-[#00264D] mb-4">Receive Your Items</h3>
                  <p className="text-gray-700">
                    Receive physical items via shipping or instant access to digital products.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/marketplace"
                  className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* For Sellers Section */}
        <section className="py-16 bg-[#F0F0F0]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#00264D] text-center mb-12">For Sellers</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-xl p-6 text-center shadow-lg animate-fade-in-up">
                  <div className="bg-[#00264D] text-white rounded-full px-4 py-2 text-sm font-semibold mb-4 inline-block">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-[#00264D] mb-3">Create Seller Account</h3>
                  <p className="text-gray-700 text-sm">Sign up and create your seller profile on SatSoko.</p>
                </div>

                <div className="bg-white rounded-xl p-6 text-center shadow-lg animate-fade-in-up delay-100">
                  <div className="bg-[#00264D] text-white rounded-full px-4 py-2 text-sm font-semibold mb-4 inline-block">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-[#00264D] mb-3">Connect Lightning Wallet</h3>
                  <p className="text-gray-700 text-sm">Connect your Lightning wallet to receive payments.</p>
                </div>

                <div className="bg-white rounded-xl p-6 text-center shadow-lg animate-fade-in-up delay-200">
                  <div className="bg-[#00264D] text-white rounded-full px-4 py-2 text-sm font-semibold mb-4 inline-block">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-[#00264D] mb-3">List Your Products</h3>
                  <p className="text-gray-700 text-sm">Create listings for your physical or digital products.</p>
                </div>

                <div className="bg-white rounded-xl p-6 text-center shadow-lg animate-fade-in-up delay-300">
                  <div className="bg-[#00264D] text-white rounded-full px-4 py-2 text-sm font-semibold mb-4 inline-block">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-[#00264D] mb-3">Get Paid in Bitcoin</h3>
                  <p className="text-gray-700 text-sm">Receive instant payments in Bitcoin for your sales.</p>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/auth/signup"
                  className="bg-[#00264D] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#00264D]/90 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                >
                  Become a Seller
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-[#00264D]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Contact Us</h2>
              <p className="text-gray-300 text-center mb-12">Have questions or feedback? We're here to help.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="animate-fade-in-up">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                  <p className="text-gray-300 mb-2">support@satsoko.com</p>
                  <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
                </div>

                <div className="animate-fade-in-up delay-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                  <p className="text-gray-300 mb-2">+254 113325992</p>
                  <p className="text-gray-400 text-sm">Monday-Friday, 9AM-5PM EAT</p>
                </div>

                <div className="animate-fade-in-up delay-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Office</h3>
                  <p className="text-gray-300 mb-2">Bitcoin Dada</p>
                  <p className="text-gray-400 text-sm">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage