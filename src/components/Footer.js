import { Link } from "react-router-dom"
import { Zap } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-[#00264D] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SatSoko</span>
            </div>
            <p className="text-gray-300">Empowering African entrepreneurs through Bitcoin Lightning technology.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/marketplace" className="hover:text-[#FF8C1A] transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#FF8C1A] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/sellers" className="hover:text-[#FF8C1A] transition-colors">
                  Top Sellers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/help" className="hover:text-[#FF8C1A] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FF8C1A] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/disputes" className="hover:text-[#FF8C1A] transition-colors">
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#FF8C1A] transition-colors cursor-pointer transform hover:scale-110">
                <span className="text-sm">𝕏</span>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#FF8C1A] transition-colors cursor-pointer transform hover:scale-110">
                <span className="text-sm">📘</span>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#FF8C1A] transition-colors cursor-pointer transform hover:scale-110">
                <span className="text-sm">📷</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 SatSoko. All rights reserved. Built with ⚡ for Africa.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
