"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Plus, Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { formatSats } from "@/lib/utils"
import { ProductForm } from "./product-form"
import { productsApi } from "@/lib/api-service"
import type { User, Product, Category } from "@/lib/mock-data"

interface AccountProductsProps {
  user: User
}

export function AccountProducts({ user }: AccountProductsProps) {
  const [products, setProducts] = useState<(Product & { category: Category })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<(Product & { category: Category }) | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const products = await productsApi.getProducts({ sellerId: user.id })
      setProducts(products)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      await productsApi.createProduct({
        ...productData,
        sellerId: user.id,
      })

      await fetchProducts()
      setIsAddDialogOpen(false)

      toast({
        title: "Product Added",
        description: "Your product has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product",
      })
    }
  }

  const handleEditProduct = async (productData: Partial<Product>) => {
    if (!currentProduct) return

    try {
      await productsApi.updateProduct(currentProduct.id, productData)

      await fetchProducts()
      setIsEditDialogOpen(false)
      setCurrentProduct(null)

      toast({
        title: "Product Updated",
        description: "Your product has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
      })
    }
  }

  const handleDeleteProduct = async () => {
    if (!currentProduct) return

    try {
      await productsApi.deleteProduct(currentProduct.id)

      await fetchProducts()
      setIsDeleteDialogOpen(false)
      setCurrentProduct(null)

      toast({
        title: "Product Deleted",
        description: "Your product has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchProducts} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-bitcoin hover:bg-bitcoin/90 text-black">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-700 p-4 mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Products Yet</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              You haven't added any products yet. Start selling by adding your first product.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-bitcoin hover:bg-bitcoin/90 text-black">
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isFeatured && (
                  <div className="absolute top-2 right-2 bg-bitcoin text-black text-xs font-medium px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1 text-bitcoin font-medium mt-1">
                  <Bitcoin className="h-4 w-4" />
                  <span>{formatSats(product.price)}</span>
                  <span className="text-xs text-gray-400 ml-1">sats</span>
                </div>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <Link href={`/product/${product.id}`} className="text-bitcoin hover:underline text-sm">
                    View Product
                  </Link>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setCurrentProduct(product)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-red-800 hover:bg-red-900/20 text-red-500"
                      onClick={() => {
                        setCurrentProduct(product)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the details to add a new product to your store.</DialogDescription>
          </DialogHeader>
          <ProductForm onSubmit={handleAddProduct} />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update your product details.</DialogDescription>
          </DialogHeader>
          {currentProduct && <ProductForm product={currentProduct} onSubmit={handleEditProduct} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
