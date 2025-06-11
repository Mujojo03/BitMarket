// /lib/types.ts

export interface User {
  id: number
  username: string
  email: string
  roles?: string[]
}

export interface Seller {
  id: number
  username: string
  email: string
  roles?: string[]
}


// export interface Seller {
//   id: string
//   name: string
//   rating: number
//   sales: number
//   joinedDate: string
// }

export interface Product {
  id: number               // matches db.Integer
  sellerId: number         // corresponds to seller_id in DB
  categoryId: number       // corresponds to category_id in DB
  name: string
  description: string
  priceSats: number        // price in satoshis (bigint in Python, number in TS)
  imgUrl: string
  stockQuantity: number
  createdAt: string        // ISO date string (datetime in DB)
  deleted: boolean
  isFeatured: boolean      // Frontend-only
}

export interface Category {
  id: number
  name: string
  deleted: boolean
}

export interface ProductWithCategory extends Product {
  category: Category
  seller: User
}

// Used only in UI components where slug and imageUrl are needed
export interface CategoryCardData extends Category {
  slug: string
  imageUrl?: string
}
// Order-related types
export interface ProductOrder {
  id:number,
  order_id: number
  product_id:number,
  quantity: number
  subtotal: number
  status: string
}

export interface Order {
  id:number,
  buyer_id: number
  status: string
  created_at: string
  products: Product[]
}

// type OrderWithItems = Order & {
//   orderItems: (ProductOrder & { product: Product })[]
// }

// // /lib/types.ts

// export interface User {
//   id: number
//   username: string
//   email: string
//   roles?: string[]
// }

// export interface Seller {
//   id: string
//   name: string
//   rating: number
//   sales: number
//   joinedDate: string
// }

// export interface Product {
//   id: number;               // matches db.Integer
//   sellerId: number;         // corresponds to seller_id in DB
//   categoryId: number;       // corresponds to category_id in DB
//   name: string;
//   description: string;
//   priceSats: number;        // price in satoshis (bigint in Python, number in TS)
//   imgUrl: string;
//   stockQuantity: number;
//   createdAt: string;        // ISO date string (datetime in DB)
//   deleted: boolean;
//   isFeatured: boolean; // Frontend-only
// }

// export interface Category {
//   id: number;
//   name: string;
//   deleted: boolean;
// }

// export interface ProductWithCategory extends Product {
//   category: Category
// }