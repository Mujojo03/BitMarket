"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Zap, Shield, Star, CheckCircle, MapPin, Heart, Search } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom";


const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <HowItWorksSection />
      <FinalCTABanner />
      <Footer />
    </div>
  )
}

const HeroSection = () => {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const taglines = [
    {
      main: "Get Paid Instantly for What You Create",
      sub: "No banks. No waiting. Just your earnings, right away.",
    },
    {
      main: "Trust Built In, Every Step of the Way",
      sub: "Safe payments. Real reviews. Peace of mind for buyers and sellers.",
    },
    {
      main: "Turn Your Craft Into Global Opportunity",
      sub: "Reach buyers worldwide, instantly.",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length)
        setIsVisible(true)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [taglines.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00264D] to-blue-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-bounce">
          <Zap className="w-6 h-6 text-[#FF8C1A] opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse">
          <div className="w-3 h-3 bg-[#FF8C1A] rounded-full"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-1000">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Animated Taglines */}
          <div className="mb-8 min-h-[200px] md:min-h-[240px] flex flex-col justify-center">
            <div
              className={`transition-all duration-500 ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
                }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {taglines[currentTaglineIndex].main}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 animate-fade-in-up">
                {taglines[currentTaglineIndex].sub}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/auth/signup"
              className="group bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-bounce-in"
            >
              <span className="flex items-center">
                Start Selling
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              to="/marketplace"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#00264D] transition-all duration-300 transform hover:scale-105 animate-bounce-in delay-200"
            >
              Explore Market
            </Link>
          </div>

          {/* Tagline Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {taglines.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(() => {
                    setCurrentTaglineIndex(index)
                    setIsVisible(true)
                  }, 250)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTaglineIndex ? "bg-[#FF8C1A] scale-125" : "bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const FeaturedProducts = () => {
  const [favorites, setFavorites] = useState([])
  const [showSats, setShowSats] = useState(false)
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Handwoven Kente Cloth",
      price: { usd: 45, sats: 450 },
      image: "https://i.etsystatic.com/6171992/r/il/25e478/6423691903/il_fullxfull.6423691903_lz4x.jpg",
      seller: "Akosua Crafts",
      rating: 4.8,
      verified: true,
      location: "Ghana",
    },
    {
      id: 2,
      name: "Wooden Sculpture Set",
      price: { usd: 32, sats: 320 },
      image: "https://5.imimg.com/data5/WHATSAPP/Default/2024/2/393429358/HX/RQ/EU/2943039/wooden-fine-carving-elephant-set-of-4-pcs-500x500.jpeg",
      seller: "Mbeki Arts",
      rating: 4.9,
      verified: true,
      location: "Kenya",
    },
    {
      id: 3,
      name: "Organic Coffee Beans",
      price: { usd: 18, sats: 180 },
      image: "https://dewerstone.com/cdn/shop/files/single-origin-speciality-peru-alta-montana-dawn-roasters-coffee-co-848230.jpg?v=1743545483&width=1080",
      seller: "Ethiopian Highlands",
      rating: 4.7,
      verified: true,
      location: "Ethiopia",
    },
    {
      id: 4,
      name: "Beaded Jewelry Set",
      price: { usd: 28, sats: 280 },
      image: "https://i.etsystatic.com/23657601/r/il/60707b/2557679548/il_570xN.2557679548_e3xs.jpg",
      seller: "Zulu Beads Co",
      rating: 4.6,
      verified: true,
      location: "South Africa",
    },
    {
      id: 5,
      name: "Handcrafted Pottery",
      price: { usd: 22, sats: 220 },
      image: "https://cdn.pixabay.com/photo/2017/03/27/14/33/ancient-2179091_1280.jpg",
      seller: "Pottery by Jane",
      rating: 4.8,
      verified: true,
      location: "Morocco",
    },
    {
      id: 6,
      name: "Traditional Maasai Shuka",
      price: { usd: 35, sats: 350 },
      image: "https://m.media-amazon.com/images/I/71YwJpyumrS._AC_SX679_.jpg",
      seller: "Maasai Heritage",
      rating: 4.9,
      verified: true,
      location: "Tanzania",
    },
    {
      id: 7,
      name: "African Print Tote Bag",
      price: { usd: 15, sats: 150 },
      image: "https://nkeoma.com/cdn/shop/products/IMG_4773_jpg_1024x.jpg?v=1669320184",
      seller: "Kente Creations",
      rating: 4.5,
      verified: true,
      location: "Ghana",
    },
    {
      id: 8,
      name: "Handmade Leather Sandals",
      price: { usd: 40, sats: 400 },
      image: "https://greek-sandals.com/wp-content/uploads/2019/07/IMG_20190324_120310.jpg",
      seller: "Sahara Footwear",
      rating: 4.7,
      verified: true,
      location: "Egypt",
    },
  ]

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00264D] mb-4 md:mb-0">Featured Products</h2>

          <div className="flex items-center space-x-4">
            <span className="text-[#00264D]">USD</span>
            <button
              onClick={() => setShowSats(!showSats)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${showSats ? "bg-[#FF8C1A]" : "bg-gray-300"
                }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${showSats ? "translate-x-7" : "translate-x-1"
                  }`}
              ></div>
            </button>
            <span className="text-[#00264D] flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              SATS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#FF8C1A] text-white px-2 py-1 rounded-full text-xs flex items-center animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  Lightning
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.includes(product.id) ? "text-red-500 fill-current" : "text-gray-600"
                      } transition-colors`}
                  />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[#00264D] mb-2">{product.name}</h3>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-[#FF8C1A]">
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

                <button
                  onClick={() => {
                    const cart = JSON.parse(localStorage.getItem("satsoko-cart")) || [];
                    const exists = cart.find((item) => item.id === product.id);

                    const updatedCart = exists
                      ? cart.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                      )
                      : [...cart, { ...product, quantity: 1 }];

                    localStorage.setItem("satsoko-cart", JSON.stringify(updatedCart));
                    navigate("/cart");
                  }}
                  className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Quick Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: "Discover Product",
      description: "Browse our marketplace of authentic African goods",
    },
    {
      icon: Zap,
      title: "Pay via Lightning",
      description: "Fast, secure Bitcoin Lightning payments",
    },
    // {
    //   icon: Shield,
    //   title: "Escrow Holds Funds",
    //   description: "Your payment is safely held until delivery",
    // },
    {
      icon: CheckCircle,
      title: "Receive & Confirm",
      description: "Get your product and confirm delivery",
    },
  ]

  return (
    <section className="py-16 bg-[#00264D]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FinalCTABanner = () => {
  const [transactionCount, setTransactionCount] = useState(0)
  const [vendorCount, setVendorCount] = useState(0)

  useEffect(() => {
    const transactionTarget = 15420
    const vendorTarget = 2847

    const transactionInterval = setInterval(() => {
      setTransactionCount((prev) => {
        if (prev < transactionTarget) {
          return Math.min(prev + Math.ceil(transactionTarget / 100), transactionTarget)
        }
        clearInterval(transactionInterval)
        return prev
      })
    }, 50)

    const vendorInterval = setInterval(() => {
      setVendorCount((prev) => {
        if (prev < vendorTarget) {
          return Math.min(prev + Math.ceil(vendorTarget / 100), vendorTarget)
        }
        clearInterval(vendorInterval)
        return prev
      })
    }, 50)

    return () => {
      clearInterval(transactionInterval)
      clearInterval(vendorInterval)
    }
  }, [])

  return (
    <section className="py-16 bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] relative overflow-hidden">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-slide-in-left">
        <Zap className="w-12 h-12 text-white/30" />
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-slide-in-right">
        <Zap className="w-12 h-12 text-white/30" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Africa's Growing Bitcoin Economy</h2>
        <p className="text-xl text-white/90 mb-8">Start your journey with SatSoko today</p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{transactionCount.toLocaleString()}</div>
            <div className="text-white/80">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{vendorCount.toLocaleString()}</div>
            <div className="text-white/80">Active Vendors</div>
          </div>
        </div>

        <Link
          to="/auth/signup"
          className="bg-white text-[#FF8C1A] px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-block"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  )
}

export default HomePage
