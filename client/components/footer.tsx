import Link from "next/link"
import { Bitcoin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-dark">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Bitcoin className="h-6 w-6 text-bitcoin" />
              <span className="text-xl font-bold">
                <span className="text-bitcoin">Bit</span>Merket
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-2">
              The global marketplace powered by Bitcoin. Buy and sell anything, anywhere in the world.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Sell on Bit Merket
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/featured" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Featured Items
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Bit Merket. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-bitcoin transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
