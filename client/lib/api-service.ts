import {
  mockCategories,
  mockProducts,
  mockReviews,
  mockCartItems,
  mockOrders,
  mockOrderItems,
  getProductsWithRelations,
  getProductById,
  getReviewsForProduct,
  getCartItemsForUser,
  getOrdersForUser,
  getOrderById,
  getUserById,
  getSellerById,
  type Product,
  type User,
  type Review,
  type CartItem,
  type Order,
  type OrderItem,
  mockUsers,
} from "@/lib/mock-data"

// This file contains both mock API services and real API services
// In a production app, these would typically be in separate files

// ==================== MOCK API SERVICES ====================
// Helper to simulate API delay
const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock Products API
export const mockProductsApi = {
  // Get all products
  async getProducts(options?: {
    categoryId?: string
    featured?: boolean
    sellerId?: string
    limit?: number
  }) {
    await simulateDelay()

    let products = getProductsWithRelations()

    if (options?.categoryId) {
      products = products.filter((p) => p.categoryId === options.categoryId)
    }

    if (options?.featured) {
      products = products.filter((p) => p.isFeatured)
    }

    if (options?.sellerId) {
      products = products.filter((p) => p.sellerId === options.sellerId)
    }

    if (options?.limit) {
      products = products.slice(0, options.limit)
    }

    return products
  },

  // Get product by ID
  async getProductById(id: string) {
    await simulateDelay()
    return getProductById(id)
  },

  // Create product
  async createProduct(productData: Partial<Product>) {
    await simulateDelay()

    const newProduct: Product = {
      id: `product${Date.now()}`,
      name: productData.name || "New Product",
      description: productData.description || "",
      price: productData.price || 0,
      imageUrl: productData.imageUrl || "/placeholder.svg?height=300&width=300",
      categoryId: productData.categoryId || mockCategories[0].id,
      sellerId: productData.sellerId || "",
      isDigital: productData.isDigital || false,
      isFeatured: productData.isFeatured || false,
      stockQuantity: productData.stockQuantity || 1,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, this would be saved to the database
    mockProducts.push(newProduct)

    return {
      ...newProduct,
      category: mockCategories.find((c) => c.id === newProduct.categoryId)!,
      seller: getUserById(newProduct.sellerId)!,
    }
  },

  // Update product
  async updateProduct(id: string, updates: Partial<Product>) {
    await simulateDelay()

    const productIndex = mockProducts.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      throw new Error("Product not found")
    }

    const updatedProduct = {
      ...mockProducts[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    mockProducts[productIndex] = updatedProduct

    return {
      ...updatedProduct,
      category: mockCategories.find((c) => c.id === updatedProduct.categoryId)!,
      seller: getUserById(updatedProduct.sellerId)!,
    }
  },

  // Delete product
  async deleteProduct(id: string) {
    await simulateDelay()

    const productIndex = mockProducts.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      throw new Error("Product not found")
    }

    mockProducts.splice(productIndex, 1)

    return { success: true }
  },
}

// Mock Categories API
export const mockCategoriesApi = {
  // Get all categories
  async getCategories() {
    await simulateDelay()
    return mockCategories
  },

  // Get category by ID
  async getCategoryById(id: string) {
    await simulateDelay()
    return mockCategories.find((c) => c.id === id)
  },
}

// Mock Reviews API
export const mockReviewsApi = {
  // Get reviews for product
  async getReviewsForProduct(productId: string) {
    await simulateDelay()
    return getReviewsForProduct(productId)
  },

  // Create review
  async createReview(reviewData: { productId: string; userId: string; rating: number; comment?: string }) {
    await simulateDelay()

    const newReview: Review = {
      id: `review${Date.now()}`,
      productId: reviewData.productId,
      userId: reviewData.userId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
    }

    // In a real app, this would be saved to the database
    mockReviews.push(newReview)

    return {
      ...newReview,
      user: getUserById(newReview.userId)!,
    }
  },
}

// Mock Cart API
export const mockCartApi = {
  // Get cart for user
  async getCartForUser(userId: string) {
    await simulateDelay()
    return getCartItemsForUser(userId)
  },

  // Add item to cart
  async addToCart(userId: string, productId: string, quantity = 1) {
    await simulateDelay()

    // Check if item already in cart
    const existingItem = mockCartItems.find((c) => c.userId === userId && c.productId === productId)

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity
      return getCartItemsForUser(userId)
    }

    // Add new item
    const newCartItem: CartItem = {
      id: `cart${Date.now()}`,
      userId,
      productId,
      quantity,
      createdAt: new Date().toISOString(),
    }

    mockCartItems.push(newCartItem)

    return getCartItemsForUser(userId)
  },

  // Update cart item
  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    await simulateDelay()

    const cartItemIndex = mockCartItems.findIndex((c) => c.id === cartItemId && c.userId === userId)

    if (cartItemIndex === -1) {
      throw new Error("Cart item not found")
    }

    if (quantity <= 0) {
      // Remove item
      mockCartItems.splice(cartItemIndex, 1)
    } else {
      // Update quantity
      mockCartItems[cartItemIndex].quantity = quantity
    }

    return getCartItemsForUser(userId)
  },

  // Remove item from cart
  async removeFromCart(userId: string, cartItemId: string) {
    await simulateDelay()

    const cartItemIndex = mockCartItems.findIndex((c) => c.id === cartItemId && c.userId === userId)

    if (cartItemIndex === -1) {
      throw new Error("Cart item not found")
    }

    mockCartItems.splice(cartItemIndex, 1)

    return getCartItemsForUser(userId)
  },

  // Clear cart
  async clearCart(userId: string) {
    await simulateDelay()

    const userCartItems = mockCartItems.filter((c) => c.userId === userId)

    for (const item of userCartItems) {
      const index = mockCartItems.findIndex((c) => c.id === item.id)
      mockCartItems.splice(index, 1)
    }

    return []
  },
}

// Mock Orders API
export const mockOrdersApi = {
  // Get orders for user
  async getOrdersForUser(userId: string) {
    await simulateDelay()
    return getOrdersForUser(userId)
  },

  // Get order by ID
  async getOrderById(id: string) {
    await simulateDelay()
    return getOrderById(id)
  },

  // Create order
  async createOrder(orderData: {
    buyerId: string
    shippingAddress: any
    cartItems: CartItem[]
  }) {
    await simulateDelay()

    // Calculate total amount
    let totalAmount = 0
    for (const item of orderData.cartItems) {
      const product = getProductById(item.productId)
      if (product) {
        totalAmount += product.price * item.quantity
      }
    }

    // Create order
    const newOrder: Order = {
      id: `order${Date.now()}`,
      buyerId: orderData.buyerId,
      status: "pending",
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      lightningInvoice: `lnbc${totalAmount}u1p3hkzm2pp...`, // Mock invoice
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockOrders.push(newOrder)

    // Create order items
    const orderItems: OrderItem[] = []

    for (const item of orderData.cartItems) {
      const product = getProductById(item.productId)
      if (product) {
        const orderItem: OrderItem = {
          id: `orderItem${Date.now()}-${item.productId}`,
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          createdAt: new Date().toISOString(),
        }

        mockOrderItems.push(orderItem)
        orderItems.push(orderItem)
      }
    }

    // Clear cart
    await mockCartApi.clearCart(orderData.buyerId)

    return {
      ...newOrder,
      orderItems: orderItems.map((item) => ({
        ...item,
        product: getProductById(item.productId)!,
      })),
    }
  },

  // Update order status
  async updateOrderStatus(id: string, status: Order["status"]) {
    await simulateDelay()

    const orderIndex = mockOrders.findIndex((o) => o.id === id)

    if (orderIndex === -1) {
      throw new Error("Order not found")
    }

    mockOrders[orderIndex].status = status
    mockOrders[orderIndex].updatedAt = new Date().toISOString()

    return getOrderById(id)
  },
}

// Mock Users API
export const mockUsersApi = {
  // Get user by ID
  async getUserById(id: string) {
    await simulateDelay()
    return getUserById(id)
  },

  // Get seller by ID
  async getSellerById(id: string) {
    await simulateDelay()
    return getSellerById(id)
  },

  // Update user profile
  async updateUserProfile(id: string, updates: Partial<User>) {
    await simulateDelay()

    const userIndex = mockUsers.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...updates,
    }

    mockUsers[userIndex] = updatedUser

    return updatedUser
  },

  // Become a seller
  async becomeSeller(id: string) {
    await simulateDelay()

    const userIndex = mockUsers.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    if (mockUsers[userIndex].isSeller) {
      throw new Error("User is already a seller")
    }

    mockUsers[userIndex].isSeller = true
    mockUsers[userIndex].sellerSince = new Date().toISOString()

    return mockUsers[userIndex]
  },
}

// ==================== REAL API SERVICES ====================
// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Get auth token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bitmarket_token');
  }
  return null;
};

// Real Products API
export const productsApi = {
  // Get all products
  async getProducts(options?: {
    categoryId?: string;
    featured?: boolean;
    sellerId?: string;
    limit?: number;
  }) {
    let url = `${API_BASE_URL}/products`;
    
    const params = new URLSearchParams();
    if (options?.categoryId) params.append('categoryId', options.categoryId);
    if (options?.featured) params.append('featured', 'true');
    if (options?.sellerId) params.append('sellerId', options.sellerId);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get product by ID
  async getProductById(id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(response);
  },

  // Create product
  async createProduct(productData: any) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    return handleResponse(response);
  },

  // Update product
  async updateProduct(id: string, updates: any) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    
    return handleResponse(response);
  },

  // Delete product
  async deleteProduct(id: string) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  }
};

// Real Categories API
export const categoriesApi = {
  // Get all categories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
  }
};

// Real Reviews API
export const reviewsApi = {
  // Get reviews for product
  async getReviewsForProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
    return handleResponse(response);
  },
  
  // Create review
  async createReview(reviewData: { productId: string; rating: number; comment?: string }) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/products/${reviewData.productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        rating: reviewData.rating,
        comment: reviewData.comment
      })
    });
    
    return handleResponse(response);
  }
};

// Real Orders API
export const ordersApi = {
  // Get orders for user
  async getOrdersForUser() {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  },

  // Get order by ID
  async getOrderById(id: string) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  },

  // Create order
  async createOrder(orderData: any) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await handleResponse(response);
    
    // Clear the cart after successful order creation
    if (result && result.id) {
      await cartApi.clearCart();
    }
    
    return result;
  },

  // Update order status
  async updateOrderStatus(id: string, status: string) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    return handleResponse(response);
  }
};

// Real Cart API
export const cartApi = {
  // Get cart for user
  async getCartForUser() {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  },

  // Add item to cart
  async addToCart(productId: string, quantity = 1) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });
    
    return handleResponse(response);
  },

  // Update cart item
  async updateCartItem(cartItemId: string, quantity: number) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    
    return handleResponse(response);
  },

  // Remove item from cart
  async removeFromCart(cartItemId: string) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  },

  // Clear cart
  async clearCart() {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  }
};

// Auth API
export const authApi = {
  // Register
  async register(userData: { email: string; password: string; fullName: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('bitmarket_token', data.token);
    }
    
    return data;
  },

  // Login
  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await handleResponse(response);
    
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('bitmarket_token', data.token);
    }
    
    return data;
  },

  // Get current user
  async getCurrentUser() {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  },

  // Become a seller
  async becomeSeller() {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/auth/become-seller`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  },

  // Update profile
  async updateProfile(profileData: any) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    return handleResponse(response);
  },

  // Logout
  logout() {
    localStorage.removeItem('bitmarket_token');
  }
};