// import {
//   mockCategories,
//   mockProducts,
//   mockReviews,
//   mockCartItems,
//   mockOrders,
//   mockOrderItems,
//   getProductsWithRelations,
//   getProductById,
//   getReviewsForProduct,
//   getCartItemsForUser,
//   getOrdersForUser,
//   getOrderById,
//   getUserById,
//   getSellerById,
//   type Product,
//   type User,
//   type Review,
//   type CartItem,
//   type Order,
//   type OrderItem,
//   mockUsers, // Import mockUsers
// } from "@/lib/mock-data"

// // This service simulates API calls to a backend
// // In a real app, these would be actual fetch calls to your Flask backend

// // Helper to simulate API delay
// const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// // Products API
// export const productsApi = {
//   // Get all products
//   async getProducts(options?: {
//     categoryId?: string
//     featured?: boolean
//     sellerId?: string
//     limit?: number
//   }) {
//     await simulateDelay()

//     let products = getProductsWithRelations()

//     if (options?.categoryId) {
//       products = products.filter((p) => p.categoryId === options.categoryId)
//     }

//     if (options?.featured) {
//       products = products.filter((p) => p.isFeatured)
//     }

//     if (options?.sellerId) {
//       products = products.filter((p) => p.sellerId === options.sellerId)
//     }

//     if (options?.limit) {
//       products = products.slice(0, options.limit)
//     }

//     return products
//   },

//   // Get product by ID
//   async getProductById(id: string) {
//     await simulateDelay()
//     return getProductById(id)
//   },

//   // Create product
//   async createProduct(productData: Partial<Product>) {
//     await simulateDelay()

//     const newProduct: Product = {
//       id: `product${Date.now()}`,
//       name: productData.name || "New Product",
//       description: productData.description || "",
//       price: productData.price || 0,
//       imageUrl: productData.imageUrl || "/placeholder.svg?height=300&width=300",
//       categoryId: productData.categoryId || mockCategories[0].id,
//       sellerId: productData.sellerId || "",
//       isDigital: productData.isDigital || false,
//       isFeatured: productData.isFeatured || false,
//       stockQuantity: productData.stockQuantity || 1,
//       rating: 0,
//       reviewCount: 0,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     // In a real app, this would be saved to the database
//     mockProducts.push(newProduct)

//     return {
//       ...newProduct,
//       category: mockCategories.find((c) => c.id === newProduct.categoryId)!,
//       seller: getUserById(newProduct.sellerId)!,
//     }
//   },

//   // Update product
//   async updateProduct(id: string, updates: Partial<Product>) {
//     await simulateDelay()

//     const productIndex = mockProducts.findIndex((p) => p.id === id)
//     if (productIndex === -1) {
//       throw new Error("Product not found")
//     }

//     const updatedProduct = {
//       ...mockProducts[productIndex],
//       ...updates,
//       updatedAt: new Date().toISOString(),
//     }

//     mockProducts[productIndex] = updatedProduct

//     return {
//       ...updatedProduct,
//       category: mockCategories.find((c) => c.id === updatedProduct.categoryId)!,
//       seller: getUserById(updatedProduct.sellerId)!,
//     }
//   },

//   // Delete product
//   async deleteProduct(id: string) {
//     await simulateDelay()

//     const productIndex = mockProducts.findIndex((p) => p.id === id)
//     if (productIndex === -1) {
//       throw new Error("Product not found")
//     }

//     mockProducts.splice(productIndex, 1)

//     return { success: true }
//   },
// }

// // Categories API
// export const categoriesApi = {
//   // Get all categories
//   async getCategories() {
//     await simulateDelay()
//     return mockCategories
//   },

//   // Get category by ID
//   async getCategoryById(id: string) {
//     await simulateDelay()
//     return mockCategories.find((c) => c.id === id)
//   },
// }

// // Reviews API
// export const reviewsApi = {
//   // Get reviews for product
//   async getReviewsForProduct(productId: string) {
//     await simulateDelay()
//     return getReviewsForProduct(productId)
//   },

//   // Create review
//   async createReview(reviewData: { productId: string; userId: string; rating: number; comment?: string }) {
//     await simulateDelay()

//     const newReview: Review = {
//       id: `review${Date.now()}`,
//       productId: reviewData.productId,
//       userId: reviewData.userId,
//       rating: reviewData.rating,
//       comment: reviewData.comment,
//       createdAt: new Date().toISOString(),
//     }

//     // In a real app, this would be saved to the database
//     mockReviews.push(newReview)

//     return {
//       ...newReview,
//       user: getUserById(newReview.userId)!,
//     }
//   },
// }

// // Cart API
// export const cartApi = {
//   // Get cart for user
//   async getCartForUser(userId: string) {
//     await simulateDelay()
//     return getCartItemsForUser(userId)
//   },

//   // Add item to cart
//   async addToCart(userId: string, productId: string, quantity = 1) {
//     await simulateDelay()

//     // Check if item already in cart
//     const existingItem = mockCartItems.find((c) => c.userId === userId && c.productId === productId)

//     if (existingItem) {
//       // Update quantity
//       existingItem.quantity += quantity
//       return getCartItemsForUser(userId)
//     }

//     // Add new item
//     const newCartItem: CartItem = {
//       id: `cart${Date.now()}`,
//       userId,
//       productId,
//       quantity,
//       createdAt: new Date().toISOString(),
//     }

//     mockCartItems.push(newCartItem)

//     return getCartItemsForUser(userId)
//   },

//   // Update cart item
//   async updateCartItem(userId: string, cartItemId: string, quantity: number) {
//     await simulateDelay()

//     const cartItemIndex = mockCartItems.findIndex((c) => c.id === cartItemId && c.userId === userId)

//     if (cartItemIndex === -1) {
//       throw new Error("Cart item not found")
//     }

//     if (quantity <= 0) {
//       // Remove item
//       mockCartItems.splice(cartItemIndex, 1)
//     } else {
//       // Update quantity
//       mockCartItems[cartItemIndex].quantity = quantity
//     }

//     return getCartItemsForUser(userId)
//   },

//   // Remove item from cart
//   async removeFromCart(userId: string, cartItemId: string) {
//     await simulateDelay()

//     const cartItemIndex = mockCartItems.findIndex((c) => c.id === cartItemId && c.userId === userId)

//     if (cartItemIndex === -1) {
//       throw new Error("Cart item not found")
//     }

//     mockCartItems.splice(cartItemIndex, 1)

//     return getCartItemsForUser(userId)
//   },

//   // Clear cart
//   async clearCart(userId: string) {
//     await simulateDelay()

//     const userCartItems = mockCartItems.filter((c) => c.userId === userId)

//     for (const item of userCartItems) {
//       const index = mockCartItems.findIndex((c) => c.id === item.id)
//       mockCartItems.splice(index, 1)
//     }

//     return []
//   },
// }

// // Orders API
// export const ordersApi = {
//   // Get orders for user
//   async getOrdersForUser(userId: string) {
//     await simulateDelay()
//     return getOrdersForUser(userId)
//   },

//   // Get order by ID
//   async getOrderById(id: string) {
//     await simulateDelay()
//     return getOrderById(id)
//   },

//   // Create order
//   async createOrder(orderData: {
//     buyerId: string
//     shippingAddress: any
//     cartItems: CartItem[]
//   }) {
//     await simulateDelay()

//     // Calculate total amount
//     let totalAmount = 0
//     for (const item of orderData.cartItems) {
//       const product = getProductById(item.productId)
//       if (product) {
//         totalAmount += product.price * item.quantity
//       }
//     }

//     // Create order
//     const newOrder: Order = {
//       id: `order${Date.now()}`,
//       buyerId: orderData.buyerId,
//       status: "pending",
//       totalAmount,
//       shippingAddress: orderData.shippingAddress,
//       lightningInvoice: `lnbc${totalAmount}u1p3hkzm2pp...`, // Mock invoice
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     mockOrders.push(newOrder)

//     // Create order items
//     const orderItems: OrderItem[] = []

//     for (const item of orderData.cartItems) {
//       const product = getProductById(item.productId)
//       if (product) {
//         const orderItem: OrderItem = {
//           id: `orderItem${Date.now()}-${item.productId}`,
//           orderId: newOrder.id,
//           productId: item.productId,
//           quantity: item.quantity,
//           price: product.price,
//           createdAt: new Date().toISOString(),
//         }

//         mockOrderItems.push(orderItem)
//         orderItems.push(orderItem)
//       }
//     }

//     // Clear cart
//     await cartApi.clearCart(orderData.buyerId)

//     return {
//       ...newOrder,
//       orderItems: orderItems.map((item) => ({
//         ...item,
//         product: getProductById(item.productId)!,
//       })),
//     }
//   },

//   // Update order status
//   async updateOrderStatus(id: string, status: Order["status"]) {
//     await simulateDelay()

//     const orderIndex = mockOrders.findIndex((o) => o.id === id)

//     if (orderIndex === -1) {
//       throw new Error("Order not found")
//     }

//     mockOrders[orderIndex].status = status
//     mockOrders[orderIndex].updatedAt = new Date().toISOString()

//     return getOrderById(id)
//   },
// }

// // Users API
// export const usersApi = {
//   // Get user by ID
//   async getUserById(id: string) {
//     await simulateDelay()
//     return getUserById(id)
//   },

//   // Get seller by ID
//   async getSellerById(id: string) {
//     await simulateDelay()
//     return getSellerById(id)
//   },

//   // Update user profile
//   async updateUserProfile(id: string, updates: Partial<User>) {
//     await simulateDelay()

//     const userIndex = mockUsers.findIndex((u) => u.id === id)

//     if (userIndex === -1) {
//       throw new Error("User not found")
//     }

//     const updatedUser = {
//       ...mockUsers[userIndex],
//       ...updates,
//     }

//     mockUsers[userIndex] = updatedUser

//     return updatedUser
//   },

//   // Become a seller
//   async becomeSeller(id: string) {
//     await simulateDelay()

//     const userIndex = mockUsers.findIndex((u) => u.id === id)

//     if (userIndex === -1) {
//       throw new Error("User not found")
//     }

//     if (mockUsers[userIndex].isSeller) {
//       throw new Error("User is already a seller")
//     }

//     mockUsers[userIndex].isSeller = true
//     mockUsers[userIndex].sellerSince = new Date().toISOString()

//     return mockUsers[userIndex]
//   },
// }
