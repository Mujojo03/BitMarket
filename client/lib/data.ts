import type { Product, Category, Seller } from "./types"

export const sellers: Seller[] = [
  {
    id: "seller1",
    name: "Hiking Gear",
    rating: 4.8,
    sales: 243,
    joinedDate: "2023-01-15",
  },
  {
    id: "seller2",
    name: "Dada Crafts",
    rating: 4.9,
    sales: 189,
    joinedDate: "2023-03-22",
  },
  {
    id: "seller3",
    name: "Electronics Hub",
    rating: 4.7,
    sales: 312,
    joinedDate: "2022-11-05",
  },
  {
    id: "seller4",
    name: "Makeup by Nkatha",
    rating: 4.6,
    sales: 156,
    joinedDate: "2023-05-18",
  },
]

export const featuredProducts: Product[] = [
  {
    id: "product1",
    name: "Handcrafted Leather Wallet with a bitcoin logo",
    description:
      "A premium leather wallet with a subtle Bitcoin logo embossed on the front. Perfect for storing your cards and cash while showing your Bitcoin pride.",
    price: 15000, // in sats
    image: "https://i.etsystatic.com/16327480/r/il/6a7cc9/1698407422/il_794xN.1698407422_dxxl.jpg",
    category: "accessories",
    seller: sellers[0],
    rating: 4.8,
    reviews: 32,
    featured: true,
    digital: false,
  },
  {
    id: "product2",
    name: "Dell Laptop",
    description:
      "Dell Laptop Core i7 with 16GB RAM and 512GB SSD. Perfect for all your computing needs.",
    price: 95000, // in sats
    image: "https://th.bing.com/th/id/R.b17d02f723bc495a97bf5b746ddfc86e?rik=FovMcW3geTWOGw&riu=http%3a%2f%2f3.bp.blogspot.com%2f--6dQqPnxKPk%2fVbxF66JpObI%2fAAAAAAAAAPs%2fMpPdoHXGl0o%2fw1200-h630-p-k-no-nu%2fDell%25252BInspiron%25252B14%25252B3452-driver.jpg&ehk=bj6q6%2biToqRjnIga3cMfl8z6rF3zRd6d71KmjHEg9ds%3d&risl=&pid=ImgRaw&r=0",
    category: "digital",
    seller: sellers[1],
    rating: 4.9,
    reviews: 18,
    featured: true,
    digital: false,
  },
  {
    id: "product3",
    name: "Singer Sewing Machine",
    description:
      "A comprehensive digital course teaching you how to build applications on the Lightning Network. Includes code examples and practical projects.",
    price: 85000, // in sats
    image: "https://i5.walmartimages.com/asr/1581be17-cb9f-4b87-80da-1a0c4b0318cd_1.9ab78c356b41fd9f30e55cf9549b758c.jpeg",
    category: "accessories",
    seller: sellers[2],
    rating: 4.7,
    reviews: 45,
    featured: true,
    digital: true,
  },
  {
    id: "product4",
    name: "Ceramic Mug with Bitcoin Logo",
    description:
      "A beautiful handcrafted ceramic mug featuring a Bitcoin design. Each mug is unique and made with care by our artisan.",
    price: 45000, // in sats
    image: "https://i.pinimg.com/originals/f7/41/9e/f7419ee8c5d6d597f84ebc363f11a084.jpg",
    category: "home",
    seller: sellers[3],
    rating: 4.6,
    reviews: 27,
    featured: true,
    digital: false,
  },
  {
    id: "product5",
    name: "Car Tyres",
    description: "High Quality car tyres for all vehicles.",
    price: 50000, // in sats
    image: "https://th.bing.com/th/id/OIP.e6u9VThsmXkJbNnVpB82oQHaE_?cb=iwp2&rs=1&pid=ImgDetMain",
    category: "accessories",
    seller: sellers[3],
    rating: 4.6,
    reviews: 27,
    featured: true,
    digital: false,
  }
]

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Art & Collectibles",
    slug: "art-collectibles",
    image: "https://assets.artandobject.co.nz/transforms/images/286592/MG_4937_9940f8f522c51b9d0f210cb5897b3675.jpg",
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
    price: 50000, // in sats
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
    price: 10000, // in sats
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
    price: 8000, // in sats
    image: "/placeholder.svg?height=300&width=300",
    category: "digital",
    seller: sellers[3],
    rating: 4.8,
    reviews: 19,
    featured: false,
    digital: true,
  },
]
