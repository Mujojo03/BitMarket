// Mock data types
export interface User {
  id: string
  email: string
  fullName: string
  username?: string
  avatarUrl?: string
  bio?: string
  website?: string
  isSeller: boolean
  sellerRating: number
  sellerSales: number
  sellerSince?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl: string
  productCount: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: string
  category?: Category
  sellerId: string
  seller?: User
  isDigital: boolean
  isFeatured: boolean
  stockQuantity: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  user?: User
  rating: number
  comment?: string
  createdAt: string
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  product?: Product
  quantity: number
  createdAt: string
}

export interface Order {
  id: string
  buyerId: string
  status: "pending" | "paid" | "shipped" | "delivered" | "completed" | "cancelled" | "refunded"
  totalAmount: number
  lightningInvoice?: string
  shippingAddress?: any
  createdAt: string
  updatedAt: string
  orderItems?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: number
  createdAt: string
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "user1",
    email: "user@example.com",
    fullName: "Test User",
    username: "testuser",
    isSeller: false,
    sellerRating: 0,
    sellerSales: 0,
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "seller1",
    email: "seller@example.com",
    fullName: "Bitcoin Artisan",
    username: "bitcoinartisan",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    bio: "I create unique Bitcoin-themed products and art.",
    website: "https://example.com",
    isSeller: true,
    sellerRating: 4.8,
    sellerSales: 243,
    sellerSince: "2023-01-15T00:00:00Z",
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "seller2",
    email: "seller2@example.com",
    fullName: "Satoshi Crafts",
    username: "satoshicrafts",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    isSeller: true,
    sellerRating: 4.9,
    sellerSales: 189,
    sellerSince: "2023-03-22T00:00:00Z",
    createdAt: "2023-03-22T00:00:00Z",
  },
  {
    id: "seller3",
    email: "seller3@example.com",
    fullName: "Lightning Store",
    username: "lightningstore",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    isSeller: true,
    sellerRating: 4.7,
    sellerSales: 312,
    sellerSince: "2022-11-05T00:00:00Z",
    createdAt: "2022-11-05T00:00:00Z",
  },
  {
    id: "seller4",
    email: "seller4@example.com",
    fullName: "Blockchain Goods",
    username: "blockchaingoods",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    isSeller: true,
    sellerRating: 4.6,
    sellerSales: 156,
    sellerSince: "2023-05-18T00:00:00Z",
    createdAt: "2023-05-18T00:00:00Z",
  },
]

// Mock categories
export const mockCategories: Category[] = [
  {
    id: "cat1",
    name: "Art & Collectibles",
    slug: "art-collectibles",
    description: "Unique art and collectible items",
    imageUrl: "/placeholder.svg?height=200&width=200",
    productCount: 156,
  },
  {
    id: "cat2",
    name: "Digital Products",
    slug: "digital-products",
    description: "Digital downloads and services",
    imageUrl: "/placeholder.svg?height=200&width=200",
    productCount: 243,
  },
  {
    id: "cat3",
    name: "Clothing",
    slug: "clothing",
    description: "Apparel and accessories",
    imageUrl: "/placeholder.svg?height=200&width=200",
    productCount: 189,
  },
  {
    id: "cat4",
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets and electronic items",
    imageUrl: "/placeholder.svg?height=200&width=200",
    productCount: 112,
  },
  {
    id: "cat5",
    name: "Home & Living",
    slug: "home-living",
    description: "Items for your home",
    imageUrl: "/placeholder.svg?height=200&width=200",
    productCount: 178,
  },
  {
    id: "cat6",
    name: "Accessories",
    slug: "accessories",
    description: "Personal accessories",
    imageUrl: "/placeholder.svg?height=200&width=200",
    productCount: 203,
  },
]

// Mock products
export const mockProducts: Product[] = [
  {
    id: "product1",
    name: "Handcrafted Bitcoin Leather Wallet",
    description:
      "A premium leather wallet with a subtle Bitcoin logo embossed on the front. Perfect for storing your cards and cash while showing your Bitcoin pride.",
    price: 150000, // in sats
    imageUrl: "/placeholder.svg?height=300&width=300",
    categoryId: "cat6",
    sellerId: "seller1",
    isDigital: false,
    isFeatured: true,
    stockQuantity: 10,
    rating: 4.8,
    reviewCount: 32,
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z",
  },
  {
    id: "product2",
    name: "Bitcoin: A Peer-to-Peer Electronic Cash System (Signed Print)",
    description:
      "A beautifully printed and framed copy of the original Bitcoin whitepaper, perfect for your home office or as a gift for a fellow Bitcoin enthusiast.",
    price: 75000, // in sats
    imageUrl: "/placeholder.svg?height=300&width=300",
    categoryId: "cat1",
    sellerId: "seller2",
    isDigital: false,
    isFeatured: true,
    stockQuantity: 5,
    rating: 4.9,
    reviewCount: 18,
    createdAt: "2023-07-10T00:00:00Z",
    updatedAt: "2023-07-10T00:00:00Z",
  },
  {
    id: "product3",
    name: "Lightning Network Development Course",
    description:
      "A comprehensive digital course teaching you how to build applications on the Lightning Network. Includes code examples and practical projects.",
    price: 250000, // in sats
    imageUrl: "/placeholder.svg?height=300&width=300",
    categoryId: "cat2",
    sellerId: "seller3",
    isDigital: true,
    isFeatured: true,
    stockQuantity: 999,
    rating: 4.7,
    reviewCount: 45,
    createdAt: "2023-05-22T00:00:00Z",
    updatedAt: "2023-05-22T00:00:00Z",
  },
  {
    id: "product4",
    name: "Handmade Bitcoin Ceramic Mug",
    description:
      "A beautiful handcrafted ceramic mug featuring a Bitcoin design. Each mug is unique and made with care by our artisan.",
    price: 45000, // in sats
    imageUrl: "/placeholder.svg?height=300&width=300",
    categoryId: "cat5",
    sellerId: "seller4",
    isDigital: false,
    isFeatured: true,
    stockQuantity: 15,
    rating: 4.6,
    reviewCount: 27,
    createdAt: "2023-08-05T00:00:00Z",
    updatedAt: "2023-08-05T00:00:00Z",
  },
  {
    id: "product5",
    name: "Bitcoin Node Hardware Kit",
    description: "Everything you need to run your own Bitcoin node. Pre-configured for easy setup.",
    price: 500000, // in sats
    imageUrl: "/placeholder.svg?height=300&width=300",
    categoryId: "cat4",
    sellerId: "seller3",
    isDigital: false,
    isFeatured: false,
    stockQuantity: 3,
    rating: 4.9,
    reviewCount: 15,
    createdAt: "2023-04-18T00:00:00Z",
    updatedAt: "2023-04-18T00:00:00Z",
  },
  {
    id: "product6",
    name: "Crypto Trading Strategy Guide",
    description: "A comprehensive digital guide to trading Bitcoin and other cryptocurrencies.",
    price: 100000, // in sats
    imageUrl: "/placeholder.svg?height=300&width=300",
    categoryId: "cat2",
    sellerId: "seller2",
    isDigital: true,
    isFeatured: false,
    stockQuantity: 999,
    rating: 4.5,
    reviewCount: 23,
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2023-09-01T00:00:00Z",
  },
  {
    id: "product7",
    name: "Bitcoin T-Shirt",
    description: "A comfortable cotton t-shirt featuring a stylish Bitcoin design.",
    price: 35000, // in sats
    imageUrl: "/placeholder.svg?height=300&width=300",
    categoryId: "cat3",
    sellerId: "seller1",
    isDigital: false,
    isFeatured: false,
    stockQuantity: 25,
    rating: 4.7,
    reviewCount: 42,
    createdAt: "2023-07-25T00:00:00Z",
    updatedAt: "2023-07-25T00:00:00Z",
  },
  {
    id: "product8",
    name: "Cryptocurrency Security Guide",
    description: "Learn how to secure your Bitcoin and other cryptocurrencies with this comprehensive guide.",
    price: 80000, // in sats
    imageUrl: "/placeholder.svg?height=300&width=300",
    categoryId: "cat2",
    sellerId: "seller4",
    isDigital: true,
    isFeatured: false,
    stockQuantity: 999,
    rating: 4.8,
    reviewCount: 19,
    createdAt: "2023-08-15T00:00:00Z",
    updatedAt: "2023-08-15T00:00:00Z",
  },
]

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: "review1",
    productId: "product1",
    userId: "user1",
    rating: 5,
    comment: "Excellent quality wallet! The Bitcoin logo is subtle but recognizable.",
    createdAt: "2023-07-10T00:00:00Z",
  },
  {
    id: "review2",
    productId: "product1",
    userId: "seller2",
    rating: 4,
    comment: "Good quality, but shipping took longer than expected.",
    createdAt: "2023-07-15T00:00:00Z",
  },
  {
    id: "review3",
    productId: "product2",
    userId: "user1",
    rating: 5,
    comment: "Beautiful print! Looks amazing in my office.",
    createdAt: "2023-08-05T00:00:00Z",
  },
  {
    id: "review4",
    productId: "product3",
    userId: "seller1",
    rating: 5,
    comment: "Incredibly informative course. I learned a lot about Lightning Network development.",
    createdAt: "2023-06-20T00:00:00Z",
  },
]

// Mock cart items
export const mockCartItems: CartItem[] = [
  {
    id: "cart1",
    userId: "user1",
    productId: "product1",
    quantity: 1,
    createdAt: "2023-09-15T00:00:00Z",
  },
  {
    id: "cart2",
    userId: "user1",
    productId: "product3",
    quantity: 1,
    createdAt: "2023-09-15T00:00:00Z",
  },
]

// Mock orders
export const mockOrders: Order[] = [
  {
    id: "order1",
    buyerId: "user1",
    status: "completed",
    totalAmount: 150000,
    lightningInvoice: "lnbc1500u1p3hkzm2pp...",
    shippingAddress: {
      name: "Test User",
      address: "123 Bitcoin St",
      city: "Crypto City",
      state: "BT",
      zip: "12345",
      country: "USA",
    },
    createdAt: "2023-08-10T00:00:00Z",
    updatedAt: "2023-08-15T00:00:00Z",
  },
  {
    id: "order2",
    buyerId: "user1",
    status: "shipped",
    totalAmount: 45000,
    lightningInvoice: "lnbc450u1p3hkzm2pp...",
    shippingAddress: {
      name: "Test User",
      address: "123 Bitcoin St",
      city: "Crypto City",
      state: "BT",
      zip: "12345",
      country: "USA",
    },
    createdAt: "2023-09-05T00:00:00Z",
    updatedAt: "2023-09-07T00:00:00Z",
  },
]

// Mock order items
export const mockOrderItems: OrderItem[] = [
  {
    id: "orderItem1",
    orderId: "order1",
    productId: "product1",
    quantity: 1,
    price: 150000,
    createdAt: "2023-08-10T00:00:00Z",
  },
  {
    id: "orderItem2",
    orderId: "order2",
    productId: "product4",
    quantity: 1,
    price: 45000,
    createdAt: "2023-09-05T00:00:00Z",
  },
]

// Helper function to get products with related data
export function getProductsWithRelations(products = mockProducts): (Product & { category: Category; seller: User })[] {
  return products.map((product) => ({
    ...product,
    category: mockCategories.find((c) => c.id === product.categoryId) || mockCategories[0],
    seller: mockUsers.find((u) => u.id === product.sellerId) || mockUsers[0],
  }))
}

// Helper function to get featured products
export function getFeaturedProducts(): (Product & { category: Category; seller: User })[] {
  return getProductsWithRelations(mockProducts.filter((p) => p.isFeatured))
}

// Helper function to get product by ID
export function getProductById(id: string): (Product & { category: Category; seller: User }) | undefined {
  const product = mockProducts.find((p) => p.id === id)
  if (!product) return undefined

  return {
    ...product,
    category: mockCategories.find((c) => c.id === product.categoryId) || mockCategories[0],
    seller: mockUsers.find((u) => u.id === product.sellerId) || mockUsers[0],
  }
}

// Helper function to get products by category
export function getProductsByCategory(categoryId: string): (Product & { category: Category; seller: User })[] {
  return getProductsWithRelations(mockProducts.filter((p) => p.categoryId === categoryId))
}

// Helper function to get products by seller
export function getProductsBySeller(sellerId: string): (Product & { category: Category; seller: User })[] {
  return getProductsWithRelations(mockProducts.filter((p) => p.sellerId === sellerId))
}

// Helper function to get reviews for a product
export function getReviewsForProduct(productId: string): (Review & { user: User })[] {
  return mockReviews
    .filter((r) => r.productId === productId)
    .map((review) => ({
      ...review,
      user: mockUsers.find((u) => u.id === review.userId) || mockUsers[0],
    }))
}

// Helper function to get cart items for a user
export function getCartItemsForUser(
  userId: string,
): (CartItem & { product: Product & { category: Category; seller: User } })[] {
  return mockCartItems
    .filter((c) => c.userId === userId)
    .map((cartItem) => ({
      ...cartItem,
      product: getProductById(cartItem.productId)!,
    }))
}

// Helper function to get orders for a user
export function getOrdersForUser(
  userId: string,
): (Order & { orderItems: (OrderItem & { product: Product & { category: Category; seller: User } })[] })[] {
  return mockOrders
    .filter((o) => o.buyerId === userId)
    .map((order) => ({
      ...order,
      orderItems: mockOrderItems
        .filter((oi) => oi.orderId === order.id)
        .map((orderItem) => ({
          ...orderItem,
          product: getProductById(orderItem.productId)!,
        })),
    }))
}

// Helper function to get order by ID
export function getOrderById(
  id: string,
): (Order & { orderItems: (OrderItem & { product: Product & { category: Category; seller: User } })[] }) | undefined {
  const order = mockOrders.find((o) => o.id === id)
  if (!order) return undefined

  return {
    ...order,
    orderItems: mockOrderItems
      .filter((oi) => oi.orderId === order.id)
      .map((orderItem) => ({
        ...orderItem,
        product: getProductById(orderItem.productId)!,
      })),
  }
}

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id)
}

// Helper function to get seller by ID
export function getSellerById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id && u.isSeller)
}
