import Link from "next/link"
import { Bitcoin, ShieldCheck, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { CategoryCard } from "@/components/category-card"
// import { getFeaturedProducts } from "@/lib/mock-data"
// import { mockCategories } from "@/lib/mock-data"

export default function Home() {
  const featuredProducts = getFeaturedProducts()
  const categories = mockCategories

  return (
    <div className="flex flex-col">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-bitcoin/10 via-transparent to-transparent opacity-60" />
        <div className="container relative px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
              The Global Marketplace
              <br />
              <span className="text-bitcoin">Powered by Bitcoin</span>
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-8">
              Buy and sell anything, anywhere in the world. Instant payments, low fees, no borders, no gatekeepers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/cart">
                <Button className="bg-dark hover:bg-bitcoin hover:text-black hover:border-bitcoin text-white border border-gray-600 px-8 py-6 text-lg w-full sm:w-auto transition-colors duration-300">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/seller/create">
                <Button className="bg-dark hover:bg-bitcoin hover:text-black hover:border-bitcoin text-white border border-gray-600 px-8 py-6 text-lg w-full sm:w-auto transition-colors duration-300">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform">
          <div className="h-16 w-[1px] bg-gradient-to-b from-gray-700 to-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why SatSoko?</h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A marketplace built for the Bitcoin era, designed to empower sellers and buyers worldwide.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-800 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10">
                <Zap className="h-8 w-8 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold">Instant Payments</h3>
              <p className="text-sm text-gray-400">Lightning-fast transactions with Bitcoin's Lightning Network.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-800 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10">
                <ShieldCheck className="h-8 w-8 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold">Secure Escrow</h3>
              <p className="text-sm text-gray-400">Built-in escrow system protects both buyers and sellers.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-800 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10">
                <Globe className="h-8 w-8 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold">Global Access</h3>
              <p className="text-sm text-gray-400">Open to anyone with a smartphone, anywhere in the world.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-800 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10">
                <Bitcoin className="h-8 w-8 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold">Low Fees</h3>
              <p className="text-sm text-gray-400">Minimal fees compared to traditional marketplaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-dark py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">Popular Categories</h2>
              <p className="text-gray-300">Explore our most popular product categories</p>
            </div>
            <Link href="/browse">
              <Button variant="link" className="text-bitcoin">
                View All Categories
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 py-8 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-900 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">Featured Products</h2>
              <p className="text-gray-300">Discover our handpicked selection of unique items</p>
            </div>
            <Link href="/browse">
              <Button variant="link" className="text-bitcoin">
                View All Products
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bitcoin py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-black sm:text-4xl">Ready to Start Selling?</h2>
              <p className="max-w-[900px] text-black/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of sellers already earning Bitcoin on SatSoko.
              </p>
            </div>
            <Link href="/seller/create">
              <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg">
                Open Your Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
