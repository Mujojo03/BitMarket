"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bitcoin, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categoriesApi } from "@/lib/api-service"
import type { Product, Category } from "@/lib/mock-data"

interface ProductFormProps {
  product?: Product & { category?: Category }
  onSubmit: (data: Partial<Product>) => void
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price?.toString() || "")
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "/placeholder.svg?height=300&width=300")
  const [categoryId, setCategoryId] = useState(product?.categoryId || "")
  const [isDigital, setIsDigital] = useState(product?.isDigital || false)
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false)
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() || "1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await categoriesApi.getCategories()
        setCategories(categories)
        if (!product?.categoryId && categories.length > 0) {
          setCategoryId(categories[0].id)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [product?.categoryId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const productData = {
      name,
      description,
      price: Number.parseInt(price, 10),
      imageUrl,
      categoryId,
      isDigital,
      isFeatured,
      stockQuantity: Number.parseInt(stockQuantity, 10),
    }

    onSubmit(productData)
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bitcoin"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-gray-700 border-gray-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="bg-gray-700 border-gray-600 min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (in sats)</Label>
          <div className="relative">
            <Bitcoin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="1"
              className="bg-gray-700 border-gray-600 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              id="image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="flex items-center justify-center bg-gray-700 rounded-md p-2">
            {imageUrl ? (
              <img src={imageUrl || "/placeholder.svg"} alt="Preview" className="max-h-20 object-contain" />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Upload className="h-8 w-8 mb-1" />
                <span className="text-xs">No image</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Enter a URL for your product image. For testing, you can use "/placeholder.svg?height=300&width=300"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-2">
          <Switch id="digital" checked={isDigital} onCheckedChange={setIsDigital} />
          <Label htmlFor="digital">Digital Product</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          <Label htmlFor="featured">Featured Product</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            min="1"
            className="bg-gray-700 border-gray-600"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => onSubmit({})}>
          Cancel
        </Button>
        <Button type="submit" className="bg-bitcoin hover:bg-bitcoin/90 text-black" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  )
}
