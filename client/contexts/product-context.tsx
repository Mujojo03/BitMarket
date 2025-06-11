import React, { createContext, useContext, useState, ReactNode } from "react"
import $ from "jquery"
import type {
  Product,
  ProductWithCategory,
  Category,
  Seller
} from "../lib/types"

// ----------------------
// Context Type
// ----------------------

interface ProductContextType {
  products: ProductWithCategory[]
  loading: boolean
  error: string | null
  fetchProducts: () => void
  addProduct: (product: Partial<Product>) => Promise<void>
  editProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  getProductById: (id: string) => Promise<{
    product: Product & { category: Category; seller: Seller }
    relatedProducts: (Product & { category: Category; seller: Seller })[]
  } | null>
}

// ----------------------
// Context Setup
// ----------------------

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error("useProductContext must be used within a ProductProvider")
  return context
}

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchProducts = () => {
    setLoading(true)
    $.ajax({
      url: "http://localhost:5000/products/mine",
      method: "GET",
      headers: getAuthHeaders(),
      success: (data: ProductWithCategory[]) => {
        setProducts(data)
        setError(null)
      },
      error: (xhr: JQuery.jqXHR<any>) => {
        setError("Failed to fetch products")
        console.error(xhr.responseText)
      },
      complete: () => setLoading(false),
    })
  }

  const addProduct = (product: Partial<Product>) => {
    return new Promise<void>((resolve, reject) => {
      $.ajax({
        url: "http://localhost:5000/products/create",
        method: "POST",
        contentType: "application/json",
        headers: getAuthHeaders(),
        data: JSON.stringify(product),
        success: () => {
          resolve()
          fetchProducts()
        },
        error: (xhr: JQuery.jqXHR<any>) => {
          console.error("Add product error:", xhr.responseText)
          reject(new Error(xhr.responseJSON?.message || "Failed to add product"))
        },
      })
    })
  }

  const editProduct = (id: number, product: Partial<Product>) => {
    return new Promise<void>((resolve, reject) => {
      $.ajax({
        url: `http://localhost:5000/products/${id}/edit`,
        method: "PATCH",
        contentType: "application/json",
        headers: getAuthHeaders(),
        data: JSON.stringify(product),
        success: () => {
          resolve()
          fetchProducts()
        },
        error: (xhr: JQuery.jqXHR<any>) => {
          console.error("Edit product error:", xhr.responseText)
          reject(new Error(xhr.responseJSON?.message || "Failed to update product"))
        },
      })
    })
  }

  const getProductById = (id: string) => {
    return new Promise<{
      product: Product & { category: Category; seller: Seller }
      relatedProducts: (Product & { category: Category; seller: Seller })[]
    } | null>((resolve, reject) => {
      $.ajax({
        url: `http://localhost:5000/products/${id}`,
        method: "GET",
        headers: getAuthHeaders(),  // add auth headers if needed
        success: (data) => {
          resolve(data)
        },
        error: () => {
          resolve(null)
        },
      })
    })
  }
  

  const deleteProduct = (id: number) => {
    return new Promise<void>((resolve, reject) => {
      $.ajax({
        url: `http://localhost:5000/products/${id}/delete`,
        method: "DELETE",
        headers: getAuthHeaders(),
        success: () => {
          resolve()
          fetchProducts()
        },
        error: (xhr: JQuery.jqXHR<any>) => {
          console.error("Delete product error:", xhr.responseText)
          reject(new Error(xhr.responseJSON?.message || "Failed to delete product"))
        },
      })
    })
  }

  return (
    <ProductContext.Provider
      value={{ products, loading, error, fetchProducts, addProduct, editProduct, deleteProduct,getProductById}}
    >
      {children}
    </ProductContext.Provider>
  )
}

// import React, { createContext, useContext, useState, ReactNode } from "react"
// import $ from "jquery"
// import type {
//   Product,
//   ProductWithCategory,
// } from "../lib/types"

// // ----------------------
// // Context Type
// // ----------------------

// interface ProductContextType {
//   products: ProductWithCategory[]
//   loading: boolean
//   error: string | null
//   fetchProducts: () => void
//   addProduct: (product: Partial<Product>) => Promise<void>
//   editProduct: (id: number, product: Partial<Product>) => Promise<void>
//   deleteProduct: (id: number) => Promise<void>
// }

// // ----------------------
// // Context Setup
// // ----------------------

// const ProductContext = createContext<ProductContextType | undefined>(undefined)

// export const useProductContext = () => {
//   const context = useContext(ProductContext)
//   if (!context) throw new Error("useProductContext must be used within a ProductProvider")
//   return context
// }

// export const ProductProvider = ({ children }: { children: ReactNode }) => {
//   const [products, setProducts] = useState<ProductWithCategory[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token")
//     return token ? { Authorization: `Bearer ${token}` } : {}
//   }

//   const fetchProducts = () => {
//     setLoading(true)
//     $.ajax({
//       url: "http://localhost:5000/products/mine",
//       method: "GET",
//       headers: getAuthHeaders(),
//       success: (data: ProductWithCategory[]) => {
//         setProducts(data)
//         setError(null)
//       },
//       error: (xhr) => {
//         setError("Failed to fetch products")
//         console.error(xhr.responseText)
//       },
//       complete: () => setLoading(false),
//     })
//   }

//   const addProduct = (product: Partial<Product>) => {
//     return new Promise<void>((resolve, reject) => {
//       $.ajax({
//         url: "http://localhost:5000/products/create",
//         method: "POST",
//         contentType: "application/json",
//         headers: getAuthHeaders(),
//         data: JSON.stringify(product),
//         success: () => {
//           resolve()
//           fetchProducts()
//         },
//         error: (xhr) => {
//           console.error("Add product error:", xhr.responseText)
//           reject(new Error(xhr.responseJSON?.message || "Failed to add product"))
//         },
//       })
//     })
//   }

//   const editProduct = (id: number, product: Partial<Product>) => {
//     return new Promise<void>((resolve, reject) => {
//       $.ajax({
//         url: `http://localhost:5000/products/${id}/edit`,
//         method: "PATCH",
//         contentType: "application/json",
//         headers: getAuthHeaders(),
//         data: JSON.stringify(product),
//         success: () => {
//           resolve()
//           fetchProducts()
//         },
//         error: (xhr) => {
//           console.error("Edit product error:", xhr.responseText)
//           reject(new Error(xhr.responseJSON?.message || "Failed to update product"))
//         },
//       })
//     })
//   }

//   const deleteProduct = (id: number) => {
//     return new Promise<void>((resolve, reject) => {
//       $.ajax({
//         url: `http://localhost:5000/products/${id}/delete`,
//         method: "DELETE",
//         headers: getAuthHeaders(),
//         success: () => {
//           resolve()
//           fetchProducts()
//         },
//         error: (xhr) => {
//           console.error("Delete product error:", xhr.responseText)
//           reject(new Error(xhr.responseJSON?.message || "Failed to delete product"))
//         },
//       })
//     })
//   }

//   return (
//     <ProductContext.Provider
//       value={{ products, loading, error, fetchProducts, addProduct, editProduct, deleteProduct }}
//     >
//       {children}
//     </ProductContext.Provider>
//   )
// }
