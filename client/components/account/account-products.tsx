"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Plus, Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { formatSats } from "@/lib/utils"
import ProductForm from "./product-form"
import { useProductContext } from "contexts/product-context"
import type { Product, Category, User } from "@/lib/types"

type ProductWithCategory = Product & { category: Category }

export function AccountProducts() {
  const {
    products,
    loading,
    error,
    addProduct,
    editProduct,
    deleteProduct,
    fetchProducts,
  } = useProductContext()

  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<ProductWithCategory | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchProducts() // No arguments, relies on context or auth headers
  }, [fetchProducts])

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("http://localhost:5000/categories")
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()
        setCategories(data)
      } catch (e) {
        console.error(e)
        toast({
          variant: "destructive",
          title: "Error loading categories",
          description: e instanceof Error ? e.message : "Unknown error",
        })
      }
    }
    loadCategories()
  }, [toast])

  const handleAddProduct = async (productData: Partial<Product>) => {
    setIsSubmitting(true)
    try {
      const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id
      if (!userId) throw new Error("User not found")

      await addProduct({ ...productData, sellerId: userId })
      setIsAddDialogOpen(false)
      toast({ title: "Product Added", description: "Your product has been added successfully." })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async (productData: Partial<Product>) => {
    if (!currentProduct) return
    setIsSubmitting(true)
    try {
      await editProduct(currentProduct.id, productData)
      setIsEditDialogOpen(false)
      setCurrentProduct(null)
      toast({ title: "Product Updated", description: "Your product has been updated successfully." })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!currentProduct) return
    setIsSubmitting(true)
    try {
      await deleteProduct(currentProduct.id)
      setIsDeleteDialogOpen(false)
      setCurrentProduct(null)
      toast({ title: "Product Deleted", description: "Your product has been deleted successfully." })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto" />
          <p className="mt-4 text-gray-400">Loading your products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => fetchProducts()} className="mt-4">Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-bitcoin hover:bg-bitcoin/90 text-black"
          disabled={isSubmitting}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center">You haven’t added any products yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div className="flex gap-2">
                    <Edit
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                      onClick={() => {
                        setCurrentProduct(product)
                        setIsEditDialogOpen(true)
                      }}
                    />
                    <Trash2
                      className="w-4 h-4 text-red-600 cursor-pointer"
                      onClick={() => {
                        setCurrentProduct(product)
                        setIsDeleteDialogOpen(true)
                      }}
                    />
                  </div>
                </div>
                <Image
                  src={product.imgUrl || "/placeholder.png"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-40"
                />
                <p className="text-gray-500 text-sm">{product.description}</p>
                <p className="text-sm text-muted-foreground">
                  <Bitcoin className="inline h-4 w-4 mr-1" />
                  {formatSats(product.priceSats)} sats
                </p>
                <p className="text-xs text-gray-400 italic">Category: {product.category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Fill out the form to list a new product.</DialogDescription>
          </DialogHeader>
          <ProductForm
            initialData={undefined}
            categories={categories}
            onSubmit={handleAddProduct}
            isSubmitting={isSubmitting}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update your product details.</DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <ProductForm
              initialData={currentProduct}
              categories={categories}
              onSubmit={handleEditProduct}
              isSubmitting={isSubmitting}
              onCancel={() => {
                setCurrentProduct(null)
                setIsEditDialogOpen(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isSubmitting}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Edit, Trash2, Plus, Bitcoin } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import {
//   Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
// } from "@/components/ui/dialog"
// import { useToast } from "@/components/ui/use-toast"
// import { formatSats } from "@/lib/utils"
// import ProductForm from "./product-form"
// import { useProductContext } from "contexts/product-context"
// import type { Product, Category, User } from "@/lib/types"

// type ProductWithCategory = Product & { category: Category }

// interface AccountProductsProps {
//   user: User
// }

// // ⚠️ Ensure <ProductProvider> wraps this component higher in the tree
// export function AccountProducts({ user }: AccountProductsProps) {
//   const {
//     products,
//     loading,
//     error,
//     addProduct,
//     editProduct,
//     deleteProduct,
//     fetchProducts,
//   } = useProductContext()

//   const [categories, setCategories] = useState<Category[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
//   const [currentProduct, setCurrentProduct] = useState<ProductWithCategory | null>(null)

//   const { toast } = useToast()

//   useEffect(() => {
//     if (user?.id) fetchProducts(user.id)
//   }, [user?.id, fetchProducts])

//   useEffect(() => {
//     // Fetch categories once on mount (replace with your API/context)
//     async function loadCategories() {
//       try {
//         const res = await fetch("http://localhost:5000/api/categories")  // <-- changed here
//         if (!res.ok) throw new Error("Failed to fetch categories")
//         const data = await res.json()
//         setCategories(data)
//       } catch (e) {
//         console.error(e)
//         toast({
//           variant: "destructive",
//           title: "Error loading categories",
//           description: e instanceof Error ? e.message : "Unknown error",
//         })
//       }
//     }
//     loadCategories()
//   }, [toast])

//   const handleAddProduct = async (productData: Partial<Product>) => {
//     setIsSubmitting(true)
//     try {
//       await addProduct({ ...productData, sellerId: user.id })
//       setIsAddDialogOpen(false)
//       toast({ title: "Product Added", description: "Your product has been added successfully." })
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to add product",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEditProduct = async (productData: Partial<Product>) => {
//     if (!currentProduct) return
//     setIsSubmitting(true)
//     try {
//       await editProduct(currentProduct.id, productData)
//       setIsEditDialogOpen(false)
//       setCurrentProduct(null)
//       toast({ title: "Product Updated", description: "Your product has been updated successfully." })
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to update product",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDeleteProduct = async () => {
//     if (!currentProduct) return
//     setIsSubmitting(true)
//     try {
//       await deleteProduct(currentProduct.id)
//       setIsDeleteDialogOpen(false)
//       setCurrentProduct(null)
//       toast({ title: "Product Deleted", description: "Your product has been deleted successfully." })
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to delete product",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[40vh]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto" />
//           <p className="mt-4 text-gray-400">Loading your products...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-500">{error}</p>
//         <Button onClick={() => fetchProducts(user.id)} className="mt-4">Try Again</Button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">My Products</h2>
//         <Button
//           onClick={() => setIsAddDialogOpen(true)}
//           className="bg-bitcoin hover:bg-bitcoin/90 text-black"
//           disabled={isSubmitting}
//         >
//           <Plus className="mr-2 h-4 w-4" /> Add Product
//         </Button>
//       </div>

//       {products.length === 0 ? (
//         <p className="text-gray-500 text-center">You haven’t added any products yet.</p>
//       ) : (
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
//           {products.map(product => (
//             <Card key={product.id}>
//               <CardContent className="p-4 space-y-2">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold">{product.name}</h3>
//                   <div className="flex gap-2">
//                     <Edit
//                       className="w-4 h-4 text-blue-600 cursor-pointer"
//                       onClick={() => {
//                         setCurrentProduct(product)
//                         setIsEditDialogOpen(true)
//                       }}
//                     />
//                     <Trash2
//                       className="w-4 h-4 text-red-600 cursor-pointer"
//                       onClick={() => {
//                         setCurrentProduct(product)
//                         setIsDeleteDialogOpen(true)
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <Image
//                   src={product.imgUrl || "/placeholder.png"}
//                   alt={product.name}
//                   width={400}
//                   height={300}
//                   className="rounded-lg object-cover w-full h-40"
//                 />
//                 <p className="text-gray-500 text-sm">{product.description}</p>
//                 <p className="text-sm text-muted-foreground">
//                   <Bitcoin className="inline h-4 w-4 mr-1" />
//                   {formatSats(product.priceSats)} sats
//                 </p>
//                 <p className="text-xs text-gray-400 italic">Category: {product.category.name}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Add Product Dialog */}
//       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add Product</DialogTitle>
//             <DialogDescription>Fill out the form to list a new product.</DialogDescription>
//           </DialogHeader>
//           <ProductForm
//             initialData={undefined}
//             categories={categories}
//             onSubmit={handleAddProduct}
//             isSubmitting={isSubmitting}
//             onCancel={() => setIsAddDialogOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Edit Product Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Product</DialogTitle>
//             <DialogDescription>Update your product details.</DialogDescription>
//           </DialogHeader>
//           {currentProduct && (
//             <ProductForm
//               initialData={currentProduct}
//               categories={categories}
//               onSubmit={handleEditProduct}
//               isSubmitting={isSubmitting}
//               onCancel={() => {
//                 setCurrentProduct(null)
//                 setIsEditDialogOpen(false)
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Product</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this product? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
//             <Button variant="destructive" onClick={handleDeleteProduct} disabled={isSubmitting}>Delete</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Edit, Trash2, Plus, Bitcoin } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import {
//   Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
// } from "@/components/ui/dialog"
// import { useToast } from "@/components/ui/use-toast"
// import { formatSats } from "@/lib/utils"
// import ProductForm from "./product-form"
// import { useProductContext } from "contexts/product-context"
// import type { Product, Category, User } from "@/lib/types"

// interface AccountProductsProps {
//   user: User
// }

// export function AccountProducts({ user }: AccountProductsProps) {
//   const {
//     products,
//     loading,
//     error,
//     addProduct,
//     editProduct,
//     deleteProduct,
//     fetchProducts,
//   } = useProductContext()

//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
//   const [currentProduct, setCurrentProduct] = useState<(Product & { category: Category }) | null>(null)

//   const { toast } = useToast()

//   useEffect(() => {
//     if (user?.id) fetchProducts(user.id)
//   }, [user.id])

//   const handleAddProduct = async (productData: Partial<Product>) => {
//     try {
//       await addProduct({ ...productData, sellerId: user.id })
//       setIsAddDialogOpen(false)
//       toast({ title: "Product Added", description: "Your product has been added successfully." })
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to add product",
//       })
//     }
//   }

//   const handleEditProduct = async (productData: Partial<Product>) => {
//     if (!currentProduct) return
//     try {
//       await editProduct(currentProduct.id, productData)
//       setIsEditDialogOpen(false)
//       setCurrentProduct(null)
//       toast({ title: "Product Updated", description: "Your product has been updated successfully." })
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to update product",
//       })
//     }
//   }

//   const handleDeleteProduct = async () => {
//     if (!currentProduct) return
//     try {
//       await deleteProduct(currentProduct.id)
//       setIsDeleteDialogOpen(false)
//       setCurrentProduct(null)
//       toast({ title: "Product Deleted", description: "Your product has been deleted successfully." })
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to delete product",
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[40vh]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto" />
//           <p className="mt-4 text-gray-400">Loading your products...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-500">{error}</p>
//         <Button onClick={() => fetchProducts(user.id)} className="mt-4">Try Again</Button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">My Products</h2>
//         <Button onClick={() => setIsAddDialogOpen(true)} className="bg-bitcoin hover:bg-bitcoin/90 text-black">
//           <Plus className="mr-2 h-4 w-4" /> Add Product
//         </Button>
//       </div>

//       {products.length === 0 ? (
//         <p className="text-gray-500 text-center">You haven’t added any products yet.</p>
//       ) : (
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
//           {products.map(product => (
//             <Card key={product.id}>
//               <CardContent className="p-4 space-y-2">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold">{product.name}</h3>
//                   <div className="flex gap-2">
//                     <Edit
//                       className="w-4 h-4 text-blue-600 cursor-pointer"
//                       onClick={() => {
//                         setCurrentProduct(product)
//                         setIsEditDialogOpen(true)
//                       }}
//                     />
//                     <Trash2
//                       className="w-4 h-4 text-red-600 cursor-pointer"
//                       onClick={() => {
//                         setCurrentProduct(product)
//                         setIsDeleteDialogOpen(true)
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <Image
//                   src={product.imgUrl || "/placeholder.png"}
//                   alt={product.name}
//                   width={400}
//                   height={300}
//                   className="rounded-lg object-cover w-full h-40"
//                 />
//                 <p className="text-gray-500 text-sm">{product.description}</p>
//                 <p className="text-sm text-muted-foreground">
//                   <Bitcoin className="inline h-4 w-4 mr-1" />
//                   {formatSats(product.priceSats)} sats
//                 </p>
//                 <p className="text-xs text-gray-400 italic">Category: {product.category.name}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Add Product Dialog */}
//       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add Product</DialogTitle>
//             <DialogDescription>Fill out the form to list a new product.</DialogDescription>
//           </DialogHeader>
//           <ProductForm onSubmit={handleAddProduct} onCancel={() => setIsAddDialogOpen(false)} />
//         </DialogContent>
//       </Dialog>

//       {/* Edit Product Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Product</DialogTitle>
//             <DialogDescription>Update your product details.</DialogDescription>
//           </DialogHeader>
//           {currentProduct && (
//             <ProductForm
//               product={currentProduct}
//               onSubmit={handleEditProduct}
//               onCancel={() => {
//                 setCurrentProduct(null)
//                 setIsEditDialogOpen(false)
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Product</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this product? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



