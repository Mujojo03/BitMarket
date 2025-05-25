export interface Seller {
  id: string
  name: string
  rating: number
  sales: number
  joinedDate: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  seller: Seller
  rating: number
  reviews: number
  featured: boolean
  digital: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  productCount: number
}
