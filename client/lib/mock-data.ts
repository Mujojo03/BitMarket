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
    email: "jane@gmail.com",
    fullName: "jane",
    username: "jane",
    isSeller: false,
    sellerRating: 0,
    sellerSales: 0,
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "user2",
    email: "sharonk@gmail.com",
    fullName: "sharonk",
    username: "sharon",
    isSeller: false,
    sellerRating: 0,
    sellerSales: 0,
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "user3",
    email: "busayo@gmail.com",
    fullName: "busayo",
    username: "busayo",
    isSeller: false,
    sellerRating: 0,
    sellerSales: 0,
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "user4",
    email: "sharonN@gmail.com",
    fullName: "sharonN",
    username: "sharonN",
    isSeller: false,
    sellerRating: 0,
    sellerSales: 0,
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "seller1",
    email: "rose@gmail.com",
    fullName: "Hiking Gear",
    username: "gearbyrose",
    avatarUrl: "https://imgcdn.stablediffusionweb.com/2024/5/16/b58ae580-d409-447d-910a-4d90c0657778.jpg",
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
    email: "dada@gmail.com",
    fullName: "Dada Crafts",
    username: "Dadacrafts",
    avatarUrl: "https://img.freepik.com/premium-vector/black-african-american-woman-avatar-face-icon-flat-style_768258-1056.jpg",
    isSeller: true,
    sellerRating: 4.9,
    sellerSales: 189,
    sellerSince: "2023-03-22T00:00:00Z",
    createdAt: "2023-03-22T00:00:00Z",
  },
  {
    id: "seller3",
    email: "kahira@gmail.com",
    fullName: "Electronics Hub",
    username: "kahiraElectronics",
    avatarUrl: "https://img.freepik.com/premium-vector/black-african-american-mulatto-hispanic-beautiful-woman-head-face-portrait-hairstyle_768258-3453.jpg",
    isSeller: true,
    sellerRating: 4.7,
    sellerSales: 312,
    sellerSince: "2022-11-05T00:00:00Z",
    createdAt: "2022-11-05T00:00:00Z",
  },
  {
    id: "seller4",
    email: "nkatha@gmail.com",
    fullName: "Makeup by Nkatha",
    username: "nkathaMakeup",
    avatarUrl: "https://img.freepik.com/premium-vector/face-young-beautiful-black-african-american-mulatto-hispanic-woman-avatar-icon-flat-style_768258-3451.jpg",
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
    imageUrl: "https://th.bing.com/th/id/R.4396b2e5838e4ccf5d43b0d287e0b817?rik=9ho9p7owU63Tmg&riu=http%3a%2f%2fcuriosityafricanboutique.com%2fcdn%2fshop%2fcollections%2fCuriosity_African_Boutique_African_Curio_Shop_in_South_Africa_on_Zulu_Nyala_Heritage_Safari_Lodge_Artisinal_and_Handcrafted_African_Products_Decor_Crafts_and_Art-34.jpg%3fv%3d1702028485%26width%3d2048&ehk=0s3MGIDGnlNXkfXU4%2bEo02Sc72z1Q0vohlBKRQRb%2b70%3d&risl=&pid=ImgRaw&r=0",
    productCount: 156,
  },
  {
    id: "cat2",
    name: "Digital Products",
    slug: "digital-products",
    description: "Digital downloads and services",
    imageUrl: "https://static.wixstatic.com/media/eaa617_25aaa68361ed43328d6654f54ec9b67a~mv2_d_6000_4396_s_4_2.jpeg/v1/crop/x_295,y_0,w_5410,h_4396/fill/w_320,h_260,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/AdobeStock_237119664.jpeg",
    productCount: 243,
  },
  {
    id: "cat3",
    name: "Clothing",
    slug: "clothing",
    description: "Apparel and accessories",
    imageUrl: "https://static.fibre2fashion.com/newsresource/images/281/28708560-m_293184.jpg",
    productCount: 189,
  },
  {
    id: "cat4",
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets and electronic items",
    imageUrl: "https://st3.depositphotos.com/1005404/13980/i/450/depositphotos_139809276-stock-photo-consumer-and-home-electronics.jpg",
    productCount: 112,
  },
  {
    id: "cat5",
    name: "Home & Living",
    slug: "home-living",
    description: "Items for your home",
    imageUrl: "https://img.freepik.com/premium-photo/natural-living-room-interior-home-mockup_1040334-2068.jpg",
    productCount: 178,
  },
  {
    id: "cat6",
    name: "Accessories",
    slug: "accessories",
    description: "Personal accessories",
    imageUrl: "https://i.etsystatic.com/16327480/r/il/6a7cc9/1698407422/il_794xN.1698407422_dxxl.jpg",
    productCount: 203,
  },
]

// Mock products
export const mockProducts: Product[] = [
  {
    id: "product1",
    name: "Handcrafted Leather Wallet with a bitcoin logo",
    description:
      "A premium leather wallet with a subtle Bitcoin logo embossed on the front. Perfect for storing your cards and cash while showing your Bitcoin pride.",
    price: 15000, // in sats
    imageUrl: "https://i.etsystatic.com/16327480/r/il/6a7cc9/1698407422/il_794xN.1698407422_dxxl.jpg",
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
    name: "Dell Laptop",
    description:
      "Dell Laptop Core i7 with 16GB RAM and 512GB SSD. Perfect for all your computing needs.",
    price: 95000, // in sats
    imageUrl: "https://th.bing.com/th/id/R.b17d02f723bc495a97bf5b746ddfc86e?rik=FovMcW3geTWOGw&riu=http%3a%2f%2f3.bp.blogspot.com%2f--6dQqPnxKPk%2fVbxF66JpObI%2fAAAAAAAAAPs%2fMpPdoHXGl0o%2fw1200-h630-p-k-no-nu%2fDell%25252BInspiron%25252B14%25252B3452-driver.jpg&ehk=bj6q6%2biToqRjnIga3cMfl8z6rF3zRd6d71KmjHEg9ds%3d&risl=&pid=ImgRaw&r=0",
    categoryId: "cat4",
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
    name: "Singer Sewing Machine",
    description:
      "Singer Sewing Machine, lightweight with multiple stitch patterns. Ideal for both beginners and experienced sewers, great for fashion and design.",
    price: 85000, // in sats
    imageUrl: "https://i5.walmartimages.com/asr/1581be17-cb9f-4b87-80da-1a0c4b0318cd_1.9ab78c356b41fd9f30e55cf9549b758c.jpeg",
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
    name: "Ceramic Mug with Bitcoin Logo",
    description:
      "A beautiful handcrafted ceramic mug featuring a Bitcoin design. Each mug is unique and made with care by our artisan.",
    price: 45000, // in sats
    imageUrl: "https://i.pinimg.com/originals/f7/41/9e/f7419ee8c5d6d597f84ebc363f11a084.jpg",
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
    name: "Car Tyres",
    description: "High Quality car tyres for all vehicles.",
    price: 50000, // in sats
    imageUrl: "https://th.bing.com/th/id/OIP.e6u9VThsmXkJbNnVpB82oQHaE_?cb=iwp2&rs=1&pid=ImgDetMain",
    categoryId: "cat2",
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
    name: "Beauty Products",
    description: "Make-up and Beauty product for all skin types.",
    price: 10000, // in sats
    imageUrl: "https://makeupobsessedmom.com/wp-content/uploads/2023/07/multitasking-beauty-products.png",
    categoryId: "cat6",
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
    name: "Black T-Shirt with Bitcoin Logo",
    description: "A comfortable black cotton t-shirt featuring a stylish Bitcoin design.",
    price: 35000, // in sats
    imageUrl: "https://i.etsystatic.com/20884421/c/1739/1739/141/0/il/e25544/3417101588/il_600x600.3417101588_1clk.jpg",
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
    name: "Baby Carriage",
    description: "A stylish and comfortable baby carriage for your little one.",
    price: 80000, // in sats
    imageUrl: "https://api-beta-game.walmart.com/medias/Default-Product-Default-WF-null?context=bWFzdGVyfHByb2Nlc3NlZHwyMDAzNXxpbWFnZS9qcGVnfGgxYS9oZmYvMTI2MTEwNDM1OTAxNzQvRGVmYXVsdC1Qcm9kdWN0X0RlZmF1bHQtV0ZfbnVsbHxlYTlhNTMyM2M0ZDYxZTM5YzU2NjgzNjNmNjc5YmJmODllZDIxYjQ4MWNkODc3MWY2OWY4ZjczMzdlYjhhNjNm",
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
    {
    id: "product9",
    name: "Wooden Chair",
    description: "A stylish and comfortable Lounge chair for your living room.",
    price: 80000, // in sats
    imageUrl: "https://i.pinimg.com/474x/66/48/bf/6648bf2023b10cf8692549969e1fd677--wooden-chairs-wooden-furniture.jpg",
    categoryId: "cat5",
    sellerId: "seller4",
    isDigital: true,
    isFeatured: false,
    stockQuantity: 999,
    rating: 4.8,
    reviewCount: 19,
    createdAt: "2023-08-15T00:00:00Z",
    updatedAt: "2023-08-15T00:00:00Z",
  },

    {
    id: "product10",
    name: "Canvas",
    description: "Canvas for your art.",
    price: 80000, // in sats
    imageUrl: "https://assets.artandobject.co.nz/transforms/images/286592/MG_4937_9940f8f522c51b9d0f210cb5897b3675.jpg",
    categoryId: "cat1",
    sellerId: "seller4",
    isDigital: true,
    isFeatured: false,
    stockQuantity: 999,
    rating: 4.8,
    reviewCount: 19,
    createdAt: "2023-08-15T00:00:00Z",
    updatedAt: "2023-08-15T00:00:00Z",
  }
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
    totalAmount: 15000,
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
    price: 15000,
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
