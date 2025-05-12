import type { Product, Category, Seller } from "./types"

export const sellers: Seller[] = [
  {
    id: "seller1",
    name: "BitcoinArtisan",
    rating: 4.8,
    sales: 243,
    joinedDate: "2023-01-15",
  },
  {
    id: "seller2",
    name: "SatoshiCrafts",
    rating: 4.9,
    sales: 189,
    joinedDate: "2023-03-22",
  },
  {
    id: "seller3",
    name: "LightningStore",
    rating: 4.7,
    sales: 312,
    joinedDate: "2022-11-05",
  },
  {
    id: "seller4",
    name: "BlockchainGoods",
    rating: 4.6,
    sales: 156,
    joinedDate: "2023-05-18",
  },
]

export const featuredProducts: Product[] = [
  {
    id: "product1",
    name: "Handcrafted Bitcoin Leather Wallet",
    description:
      "A premium leather wallet with a subtle Bitcoin logo embossed on the front. Perfect for storing your cards and cash while showing your Bitcoin pride.",
    price: 150000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "accessories",
    seller: sellers[0],
    rating: 4.8,
    reviews: 32,
    featured: true,
    digital: false,
  },
  {
    id: "product2",
    name: "Bitcoin: A Peer-to-Peer Electronic Cash System (Signed Print)",
    description:
      "A beautifully printed and framed copy of the original Bitcoin whitepaper, perfect for your home office or as a gift for a fellow Bitcoin enthusiast.",
    price: 75000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "art",
    seller: sellers[1],
    rating: 4.9,
    reviews: 18,
    featured: true,
    digital: false,
  },
  {
    id: "product3",
    name: "Lightning Network Development Course",
    description:
      "A comprehensive digital course teaching you how to build applications on the Lightning Network. Includes code examples and practical projects.",
    price: 250000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "digital",
    seller: sellers[2],
    rating: 4.7,
    reviews: 45,
    featured: true,
    digital: true,
  },
  {
    id: "product4",
    name: "Handmade Bitcoin Ceramic Mug",
    description:
      "A beautiful handcrafted ceramic mug featuring a Bitcoin design. Each mug is unique and made with care by our artisan.",
    price: 45000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "home",
    seller: sellers[3],
    rating: 4.6,
    reviews: 27,
    featured: true,
    digital: false,
  },
]

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Art & Collectibles",
    slug: "art-collectibles",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 156,
  },
  {
    id: "cat2",
    name: "Digital Products",
    slug: "digital-products",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 243,
  },
  {
    id: "cat3",
    name: "Clothing",
    slug: "clothing",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 189,
  },
  {
    id: "cat4",
    name: "Electronics",
    slug: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 112,
  },
  {
    id: "cat5",
    name: "Home & Living",
    slug: "home-living",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 178,
  },
  {
    id: "cat6",
    name: "Accessories",
    slug: "accessories",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 203,
  },
]

export const allProducts: Product[] = [
  ...featuredProducts,
  {
    id: "product5",
    name: "Bitcoin Node Hardware Kit",
    description: "Everything you need to run your own Bitcoin node. Pre-configured for easy setup.",
    price: 500000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    seller: sellers[2],
    rating: 4.9,
    reviews: 15,
    featured: false,
    digital: false,
  },
  {
    id: "product6",
    name: "Crypto Trading Strategy Guide",
    description: "A comprehensive digital guide to trading Bitcoin and other cryptocurrencies.",
    price: 100000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "digital",
    seller: sellers[1],
    rating: 4.5,
    reviews: 23,
    featured: false,
    digital: true,
  },
  {
    id: "product7",
    name: "Bitcoin T-Shirt",
    description: "A comfortable cotton t-shirt featuring a stylish Bitcoin design.",
    price: 35000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
    seller: sellers[0],
    rating: 4.7,
    reviews: 42,
    featured: false,
    digital: false,
  },
  {
    id: "product8",
    name: "Cryptocurrency Security Guide",
    description: "Learn how to secure your Bitcoin and other cryptocurrencies with this comprehensive guide.",
    price: 80000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "digital",
    seller: sellers[3],
    rating: 4.8,
    reviews: 19,
    featured: false,
    digital: true,
  },
]
