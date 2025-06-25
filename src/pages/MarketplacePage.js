import { useState, useEffect } from "react"
import { Link } from "react-router-dom"  
import {
  Search,
  Filter,
  Heart,
  Star,
  MapPin,
  Zap,
  CheckCircle,
} from "lucide-react"
import Navbar from "../components/Navbar"

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [showSats, setShowSats] = useState(false)

  const categories = [
    "All Categories",
    "Fashion & Textiles",
    "Crafts & Art",
    "Electronics",
    "Home & Garden",
    "Food & Beverages",
  ]

  const products = [
    {
      id: 1,
      name: "Traditional Ankara Dress",
      price: { usd: 6, sats: 65 },
      image: "https://imgs.search.brave.com/IgEh8oWakkF_VcAOp9P8WmuQ2ofkU4-2EPz0dp0rZVU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFPRnVhbWtoaUwu/anBn",
      seller: "Adunni Fashion",
      rating: 4.9,
      verified: true,
      location: "Lagos, Nigeria",
      category: "Fashion & Textiles",
    },
    {
      id: 2,
      name: "Hand-carved Wooden Mask",
      price: { usd: 8, sats: 85 },
      image: "https://www.retourdevoyage.com/6686-facebook_image/djimini-ligbi-masq.jpg",
      seller: "Tribal Arts Co",
      rating: 4.8,
      verified: true,
      location: "Nairobi, Kenya",
      category: "Crafts & Art",
    },
    {
      id: 3,
      name: "Solar Power Bank",
      price: { usd: 4, sats: 45 },
      image: "https://skalhuset.dk/images/zoom/8227768_3.jpg",
      seller: "GreenTech Africa",
      rating: 4.7,
      verified: true,
      location: "Cape Town, South Africa",
      category: "Electronics",
    },
    {
      id: 4,
      name: "Baobab Seed Oil",
      price: { usd: 3, sats: 31 },
      image: "https://imgs.search.brave.com/uIr7Kmj9YIs7yaZB8KS6eFN_9j3hYnGju_rLE8REvG8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEt/bGlicmFyeS1zZXJ2/aWNlLW1lZGlhL2Y4/ZDZhMDgwLTRmNTkt/NGUxNC1iNTNmLTIw/NTFjMjEwOTQyMi5f/X0NSMCwwLDk3MCw2/MDBfUFQwX1NYOTcw/X1YxX19fLnBuZw",
      seller: "Natural Remedies",
      rating: 4.6,
      verified: false,
      location: "Dakar, Senegal",
      category: "Food & Beverages",
    },
    {
      id: 5,
      name: "Woven Basket Set",
      price: { usd: 5, sats: 50},
      image: "https://imgs.search.brave.com/w_B40qRgcDknYdSRSA1deC03_euGFYIZkMjHFYwSeKM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFaVXJDOUhqRVMu/anBn",
      seller: "Rwandan Crafts",
      rating: 4.8,
      verified: true,
      location: "Kigali, Rwanda",
      category: "Home & Garden",
    },
    {
      id: 6,
      name: "Shea Butter Soap",
      price: { usd: 15, sats: 150 },
      image: "https://imgs.search.brave.com/vHbQvRdn3ZEENQUyfSn1ZgmzKw8GlFbGFtkJJn-ffEY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFzK1pkaXpUSEwu/anBn",
      seller: "Pure Naturals",
      rating: 4.5,
      verified: true,
      location: "Accra, Ghana",
      category: "Food & Beverages",
    },
  ]

  useEffect(() => {
  // Save products once on mount
  localStorage.setItem("satsoko-products", JSON.stringify(products));
  }, []);


  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesPrice = showSats
      ? product.price.sats >= priceRange[0] * 1000 && product.price.sats <= priceRange[1] * 10
      : product.price.usd >= priceRange[0] && product.price.usd <= priceRange[1]

    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 bg-gradient-to-r from-[#00264D] to-blue-900 rounded-2xl p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">SatSoko Marketplace</h1>
            <p className="text-white/90 text-lg">Discover amazing products from African entrepreneurs</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent transition-all duration-300"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 bg-[#00264D] text-white rounded-lg hover:bg-[#00264D]/90 transition-colors"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-[#00264D]">USD</span>
                <button
                  onClick={() => setShowSats(!showSats)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    showSats ? "bg-[#FF8C1A]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      showSats ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </button>
                <span className="text-[#00264D] flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  SATS
                </span>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#00264D] mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category === "All Categories" ? "all" : category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00264D] mb-2">
                      Price Range ({showSats ? "sats" : "USD"})
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max={showSats ? "100" : "100"}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">
                        {showSats ? `${priceRange[0]}k` : `$${priceRange[0]}`} -{" "}
                        {showSats ? `${priceRange[1]}k` : `$${priceRange[1]}`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00264D] mb-2">Rating</label>
                    <div className="flex items-center space-x-2">
                      {[4, 4.5, 5].map((rating) => (
                        <button
                          key={rating}
                          className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:border-[#FF8C1A] transition-colors"
                        >
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{rating}+</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Navigation */}
          <div className="flex overflow-x-auto space-x-4 mb-8 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === "All Categories" ? "all" : category)}
                className={`whitespace-nowrap px-6 py-3 rounded-full transition-all duration-300 ${
                  (selectedCategory === "all" && category === "All Categories") || selectedCategory === category
                    ? "bg-[#FF8C1A] text-white shadow-lg"
                    : "bg-white text-[#00264D] hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#FF8C1A] text-white px-2 py-1 rounded-full text-xs flex items-center animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    Lightning
                  </div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${favorites.includes(product.id) ? "text-red-500 fill-current" : "text-gray-600"} transition-colors`}
                    />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-[#00264D] mb-2 text-lg">{product.name}</h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-[#FF8C1A]">
                      {showSats ? `${product.price.sats.toLocaleString()} sats` : `$${product.price.usd}`}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{product.seller}</span>
                      {product.verified && <CheckCircle className="w-4 h-4 text-green-500 ml-1" />}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.location}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                  <Link
                      to={`/product/${product.id}`}
                      className="flex-1 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-3 rounded-lg text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
                      View Details
                  </Link>
                    <button
                      onClick={() => alert("Lightning payment coming soon! ⚡")}
                      className="px-4 py-3 border-2 border-[#FF8C1A] text-[#FF8C1A] rounded-lg hover:bg-[#FF8C1A] hover:text-white transition-all duration-300"
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#00264D] mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MarketplacePage