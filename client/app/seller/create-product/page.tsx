"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ProductForm } from "@/components/account/product-form"
import { useAuth } from "@/contexts/auth-context"
// import { productsApi } from "@/lib/api-service"

export default function CreateProductPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user && !user.isSeller) {
      router.push("/seller/create")
      return
    }
  }, [user, loading, router])

  const handleSubmit = async (productData: any) => {
    if (!productData.name) {
      // User clicked cancel
      router.push("/seller/dashboard")
      return
    }

    try {
      setIsSubmitting(true)

      if (!user) {
        throw new Error("You must be logged in to create a product")
      }

      // Add seller ID to product data
      const productWithSeller = {
        ...productData,
        sellerId: user.id,
      }

      await productsApi.createProduct(productWithSeller)

      toast({
        title: "Product created!",
        description: "Your product has been created successfully.",
      })

      router.push("/seller/dashboard")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/seller/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="text-gray-400 mt-1">Add a new product to your store</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Fill in the details for your new product</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
