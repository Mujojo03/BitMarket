// import type { UserRole } from "./auth"

// // In a real app, this would connect to a database
// // For this demo, we'll use in-memory storage

// export interface User {
//   id: string
//   email: string
//   name: string
//   password: string // In a real app, this would be hashed
//   role: UserRole
//   createdAt: string
// }

// export interface Product {
//   id: string
//   name: string
//   description: string
//   price: number
//   image: string
//   category: string
//   sellerId: string
//   rating: number
//   reviews: number
//   featured: boolean
//   digital: boolean
//   createdAt: string
//   updatedAt: string
// }

// // In-memory database
// const users: User[] = [
//   {
//     id: "user1",
//     email: "user@example.com",
//     name: "Test User",
//     password: "password123", // In a real app, this would be hashed
//     role: "user",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: "seller1",
//     email: "seller@example.com",
//     name: "Test Seller",
//     password: "password123", // In a real app, this would be hashed
//     role: "seller",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: "admin1",
//     email: "admin@example.com",
//     name: "Test Admin",
//     password: "password123", // In a real app, this would be hashed
//     role: "admin",
//     createdAt: new Date().toISOString(),
//   },
// ]

// // Import initial products from data.ts
// import { allProducts } from "./data"

// // Convert products to our DB format
// let products: Product[] = allProducts.map((p) => ({
//   id: p.id,
//   name: p.name,
//   description: p.description,
//   price: p.price,
//   image: p.image,
//   category: p.category,
//   sellerId: p.seller.id,
//   rating: p.rating,
//   reviews: p.reviews,
//   featured: p.featured,
//   digital: p.digital,
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// }))

// // User methods
// export const findUserByEmail = (email: string): User | undefined => {
//   return users.find((user) => user.email === email)
// }

// export const findUserById = (id: string): User | undefined => {
//   return users.find((user) => user.id === id)
// }

// export const createUser = (user: Omit<User, "id" | "createdAt">): User => {
//   const newUser: User = {
//     ...user,
//     id: `user${users.length + 1}`,
//     createdAt: new Date().toISOString(),
//   }
//   users.push(newUser)
//   return newUser
// }

// // Product methods
// export const findProductById = (id: string): Product | undefined => {
//   return products.find((product) => product.id === id)
// }

// export const findProductsByCategory = (category: string): Product[] => {
//   return products.filter((product) => product.category === category)
// }

// export const findProductsBySeller = (sellerId: string): Product[] => {
//   return products.filter((product) => product.sellerId === sellerId)
// }

// export const createProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
//   const newProduct: Product = {
//     ...product,
//     id: `product${products.length + 1}`,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }
//   products.push(newProduct)
//   return newProduct
// }

// export const updateProduct = (
//   id: string,
//   updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
// ): Product | null => {
//   const index = products.findIndex((product) => product.id === id)
//   if (index === -1) return null

//   products[index] = {
//     ...products[index],
//     ...updates,
//     updatedAt: new Date().toISOString(),
//   }

//   return products[index]
// }

// export const deleteProduct = (id: string): boolean => {
//   const initialLength = products.length
//   products = products.filter((product) => product.id !== id)
//   return products.length < initialLength
// }

// export const getAllProducts = (): Product[] => {
//   return products
// }

// export const getFeaturedProducts = (): Product[] => {
//   return products.filter((product) => product.featured)
// }
