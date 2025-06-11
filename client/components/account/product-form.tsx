import React, { useState, useEffect } from "react"
import { Bitcoin, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product, Category } from "@/lib/types"

interface ProductFormProps {
  initialData?: Product
  categories: Category[]
  onSubmit: (productData: Partial<Product>) => Promise<void>
  isSubmitting: boolean
  onCancel: () => void
}

export default function ProductForm({
  initialData,
  categories,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [priceSats, setPriceSats] = useState(
    initialData?.priceSats?.toString() ?? ""
  )
  const [imgUrl, setImgUrl] = useState(initialData?.imgUrl ?? "")
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId !== undefined ? String(initialData.categoryId) : ""
  )
  const [stockQuantity, setStockQuantity] = useState(
    initialData?.stockQuantity?.toString() ?? "1"
  )

  // UI-only state
  const [isDigital, setIsDigital] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    setCategoryId(
      initialData?.categoryId !== undefined ? String(initialData.categoryId) : ""
    )
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Product name is required")
      return
    }
    if (!priceSats || Number(priceSats) < 1) {
      alert("Price must be at least 1 sat")
      return
    }
    if (!isDigital && Number(stockQuantity) < 0) {
      alert("Stock quantity cannot be negative")
      return
    }
    if (!categoryId) {
      alert("Please select a category")
      return
    }
    if (!imgUrl.trim()) {
      alert("Image URL is required")
      return
    }

    const productData: Partial<Product> = {
      name: name.trim(),
      description: description.trim(),
      priceSats: Number(priceSats),
      imgUrl: imgUrl.trim(),
      categoryId: Number(categoryId),
      stockQuantity: Number(stockQuantity),
    }

    onSubmit(productData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lightning T-Shirt"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short product description"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceSats">Price (in sats)</Label>
          <div className="flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-yellow-500" />
            <Input
              id="priceSats"
              value={priceSats}
              onChange={(e) => setPriceSats(e.target.value)}
              type="number"
              min="1"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock quantity</Label>
          <Input
            id="stockQuantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            type="number"
            min="0"
            required={!isDigital}
            disabled={isDigital || isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imgUrl">Image URL</Label>
        <div className="flex gap-2 items-center">
          <Upload className="w-4 h-4 text-muted-foreground" />
          <Input
            id="imgUrl"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
          required
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isDigital"
            checked={isDigital}
            onCheckedChange={setIsDigital}
            disabled={isSubmitting}
          />
          <Label htmlFor="isDigital">Digital product</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
            disabled={isSubmitting}
          />
          <Label htmlFor="isFeatured">Feature this product</Label>
        </div>
      </div>

      {isDigital && (
        <p className="text-sm text-muted-foreground">
          Stock quantity is ignored for digital products.
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Product"}
      </Button>
    </form>
  )
}

// import React, { useState } from "react"
// import { Bitcoin, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import type { Product, Category } from "@/lib/types"

// interface ProductFormProps {
//   initialData?: Product
//   categories: Category[]
//   onSubmit: (productData: Partial<Product>) => Promise<void>
//   isSubmitting: boolean
//   onCancel: () => void;
// }

// export default function ProductForm({
//   initialData,
//   categories,
//   onSubmit,
//   isSubmitting,
// }: ProductFormProps) {
//   const [name, setName] = useState(initialData?.name ?? "")
//   const [description, setDescription] = useState(initialData?.description ?? "")
//   const [priceSats, setPriceSats] = useState(
//     initialData?.priceSats?.toString() ?? ""
//   )
//   const [imgUrl, setImgUrl] = useState(initialData?.imgUrl ?? "")
//   const [categoryId, setCategoryId] = useState(
//     initialData?.categoryId?.toString() ?? ""
//   )
//   const [stockQuantity, setStockQuantity] = useState(
//     initialData?.stockQuantity?.toString() ?? "1"
//   )

//   // UI-only state
//   const [isDigital, setIsDigital] = useState(false)
//   const [isFeatured, setIsFeatured] = useState(false)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // Basic custom validation
//     if (!name.trim()) {
//       alert("Product name is required")
//       return
//     }
//     if (!priceSats || Number(priceSats) < 1) {
//       alert("Price must be at least 1 sat")
//       return
//     }
//     if (!isDigital && Number(stockQuantity) < 0) {
//       alert("Stock quantity cannot be negative")
//       return
//     }
//     if (!categoryId) {
//       alert("Please select a category")
//       return
//     }
//     if (!imgUrl.trim()) {
//       alert("Image URL is required")
//       return
//     }

//     const productData: Partial<Product> = {
//       name: name.trim(),
//       description: description.trim(),
//       priceSats: Number.parseInt(priceSats, 10),
//       imgUrl: imgUrl.trim(),
//       categoryId: Number(categoryId),
//       stockQuantity: Number.parseInt(stockQuantity, 10),
//       // isDigital and isFeatured intentionally excluded
//     }

//     onSubmit(productData)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-2">
//         <Label htmlFor="name">Product name</Label>
//         <Input
//           id="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="e.g. Lightning T-Shirt"
//           required
//           disabled={isSubmitting}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="description">Description</Label>
//         <Textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Short product description"
//           required
//           disabled={isSubmitting}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="priceSats">Price (in sats)</Label>
//           <div className="flex items-center gap-2">
//             <Bitcoin className="h-5 w-5 text-yellow-500" />
//             <Input
//               id="priceSats"
//               value={priceSats}
//               onChange={(e) => setPriceSats(e.target.value)}
//               type="number"
//               min="1"
//               required
//               disabled={isSubmitting}
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="stockQuantity">Stock quantity</Label>
//           <Input
//             id="stockQuantity"
//             value={stockQuantity}
//             onChange={(e) => setStockQuantity(e.target.value)}
//             type="number"
//             min="0"
//             required={!isDigital}
//             disabled={isDigital || isSubmitting}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="imgUrl">Image URL</Label>
//         <div className="flex gap-2 items-center">
//           <Upload className="w-4 h-4 text-muted-foreground" />
//           <Input
//             id="imgUrl"
//             value={imgUrl}
//             onChange={(e) => setImgUrl(e.target.value)}
//             placeholder="https://example.com/image.jpg"
//             required
//             disabled={isSubmitting}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="category">Category</Label>
//         <Select
//           value={categoryId}
//           onValueChange={setCategoryId}
//           required
//           disabled={isSubmitting}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select a category" />
//           </SelectTrigger>
//           <SelectContent>
//             {categories.map((category) => (
//               <SelectItem key={category.id} value={category.id.toString()}>
//                 {category.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* UI-only toggles */}
//       <div className="flex items-center justify-between gap-4">
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="isDigital"
//             checked={isDigital}
//             onCheckedChange={setIsDigital}
//             disabled={isSubmitting}
//           />
//           <Label htmlFor="isDigital">Digital product</Label>
//         </div>

//         <div className="flex items-center space-x-2">
//           <Switch
//             id="isFeatured"
//             checked={isFeatured}
//             onCheckedChange={setIsFeatured}
//             disabled={isSubmitting}
//           />
//           <Label htmlFor="isFeatured">Feature this product</Label>
//         </div>
//       </div>

//       {isDigital && (
//         <p className="text-sm text-muted-foreground">
//           Stock quantity is ignored for digital products.
//         </p>
//       )}

//       <Button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "Saving..." : "Save Product"}
//       </Button>
//     </form>
//   )
// }

// import React, { useState, useEffect } from "react"
// import { Bitcoin, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import type { Product, Category } from "@/lib/types"

// interface ProductFormProps {
//   initialData?: Product
//   categories: Category[]
//   onSubmit: (data: Partial<Product>) => void
//   isSubmitting: boolean
// }

// export default function ProductForm({
//   initialData,
//   categories,
//   onSubmit,
//   isSubmitting,
// }: ProductFormProps) {
//   const [name, setName] = useState(initialData?.name ?? "")
//   const [description, setDescription] = useState(initialData?.description ?? "")
//   const [priceSats, setPriceSats] = useState(
//     initialData?.priceSats?.toString() ?? ""
//   )
//   const [imgUrl, setImgUrl] = useState(initialData?.imgUrl ?? "")
//   const [categoryId, setCategoryId] = useState(
//     initialData?.categoryId?.toString() ?? ""
//   )
//   const [isDigital, setIsDigital] = useState(initialData?.isDigital ?? false)
//   const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false)
//   const [stockQuantity, setStockQuantity] = useState(
//     initialData?.stockQuantity?.toString() ?? "1"
//   )

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     const productData: Partial<Product> = {
//       name: name.trim(),
//       description: description.trim(),
//       priceSats: Number.parseInt(priceSats, 10),
//       imgUrl: imgUrl.trim(),
//       categoryId: Number(categoryId),
//       isDigital,
//       isFeatured,
//       stockQuantity: Number.parseInt(stockQuantity, 10),
//     }

//     onSubmit(productData)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-2">
//         <Label htmlFor="name">Product name</Label>
//         <Input
//           id="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="e.g. Lightning T-Shirt"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="description">Description</Label>
//         <Textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Short product description"
//           required
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="priceSats">Price (in sats)</Label>
//           <div className="flex items-center gap-2">
//             <Bitcoin className="h-5 w-5 text-yellow-500" />
//             <Input
//               id="priceSats"
//               value={priceSats}
//               onChange={(e) => setPriceSats(e.target.value)}
//               type="number"
//               min="1"
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="stockQuantity">Stock quantity</Label>
//           <Input
//             id="stockQuantity"
//             value={stockQuantity}
//             onChange={(e) => setStockQuantity(e.target.value)}
//             type="number"
//             min="0"
//             required
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="imgUrl">Image URL</Label>
//         <div className="flex gap-2 items-center">
//           <Upload className="w-4 h-4 text-muted-foreground" />
//           <Input
//             id="imgUrl"
//             value={imgUrl}
//             onChange={(e) => setImgUrl(e.target.value)}
//             placeholder="https://example.com/image.jpg"
//             required
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="category">Category</Label>
//         <Select value={categoryId} onValueChange={setCategoryId} required>
//           <SelectTrigger>
//             <SelectValue placeholder="Select a category" />
//           </SelectTrigger>
//           <SelectContent>
//             {categories.map((category) => (
//               <SelectItem key={category.id} value={category.id.toString()}>
//                 {category.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex items-center justify-between gap-4">
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="isDigital"
//             checked={isDigital}
//             onCheckedChange={setIsDigital}
//           />
//           <Label htmlFor="isDigital">Digital product</Label>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="isFeatured"
//             checked={isFeatured}
//             onCheckedChange={setIsFeatured}
//           />
//           <Label htmlFor="isFeatured">Feature this product</Label>
//         </div>
//       </div>

//       <Button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "Saving..." : "Save Product"}
//       </Button>
//     </form>
//   )
// }

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Bitcoin, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// // import { categoriesApi } from "@/lib/api-service"
// import type { Product, Category } from "@/lib/types"


// interface ProductFormProps {
//   product?: Product & { category?: Category }
//   onSubmit: (data: Partial<Product>) => void
//   onCancel?: () => void
// }

// export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
//   const [name, setName] = useState(product?.name || "")
//   const [description, setDescription] = useState(product?.description || "")
//   const [price, setPrice] = useState(product?.price?.toString() || "")
//   const [imageUrl, setImageUrl] = useState(
//     product?.imageUrl || "/placeholder.svg?height=300&width=300"
//   )
//   const [categoryId, setCategoryId] = useState(product?.categoryId || "")
//   const [isDigital, setIsDigital] = useState(product?.isDigital || false)
//   const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false)
//   const [stockQuantity, setStockQuantity] = useState(
//     product?.stockQuantity?.toString() || "1"
//   )
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [categories, setCategories] = useState<Category[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const categories = await categoriesApi.getCategories()
//         setCategories(categories)
//         if (!product?.categoryId && categories.length > 0) {
//           setCategoryId(categories[0].id)
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCategories()
//   }, [product?.categoryId])

//   // Reset form if adding a new product and categories change
//   useEffect(() => {
//     if (!product) {
//       setName("")
//       setDescription("")
//       setPrice("")
//       setImageUrl("/placeholder.svg?height=300&width=300")
//       setCategoryId(categories[0]?.id || "")
//       setIsDigital(false)
//       setIsFeatured(false)
//       setStockQuantity("1")
//     }
//   }, [categories, product])

//   const validateForm = () => {
//     if (!name.trim()) {
//       alert("Please enter a product name.")
//       return false
//     }
//     if (!description.trim()) {
//       alert("Please enter a product description.")
//       return false
//     }
//     const priceNumber = Number(price)
//     if (!price || isNaN(priceNumber) || priceNumber <= 0) {
//       alert("Price must be a positive number in sats.")
//       return false
//     }
//     const stockNumber = Number(stockQuantity)
//     if (!stockQuantity || isNaN(stockNumber) || stockNumber < 0) {
//       alert("Stock quantity must be zero or more.")
//       return false
//     }
//     if (!categoryId) {
//       alert("Please select a category.")
//       return false
//     }
//     return true
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!validateForm()) return

//     setIsSubmitting(true)

//     const productData: Partial<Product> = {
//       name: name.trim(),
//       description: description.trim(),
//       price: Number.parseInt(price, 10),
//       imageUrl: imageUrl.trim(),
//       categoryId,
//       isDigital,
//       isFeatured,
//       stockQuantity: Number.parseInt(stockQuantity, 10),
//     }

//     onSubmit(productData)
//     setIsSubmitting(false)
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bitcoin"></div>
//       </div>
//     )
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6" aria-label="Product form">
//       <div className="space-y-2">
//         <Label htmlFor="name">Product Name</Label>
//         <Input
//           id="name"
//           aria-label="Product Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           disabled={isSubmitting}
//           className="bg-gray-700 border-gray-600"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="description">Description</Label>
//         <Textarea
//           id="description"
//           aria-label="Product Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//           disabled={isSubmitting}
//           className="bg-gray-700 border-gray-600 min-h-[100px]"
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="price">Price (in sats)</Label>
//           <div className="relative">
//             <Bitcoin
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
//               aria-hidden="true"
//             />
//             <Input
//               id="price"
//               aria-label="Product Price in sats"
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               required
//               min="1"
//               disabled={isSubmitting}
//               className="bg-gray-700 border-gray-600 pl-10"
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="category">Category</Label>
//           <Select
//             id="category"
//             value={categoryId}
//             onValueChange={setCategoryId}
//             required
//             disabled={isSubmitting}
//             aria-label="Product Category"
//           >
//             <SelectTrigger className="bg-gray-700 border-gray-600">
//               <SelectValue placeholder="Select a category" />
//             </SelectTrigger>
//             <SelectContent className="bg-gray-800 border-gray-700">
//               {categories.map((category) => (
//                 <SelectItem key={category.id} value={category.id}>
//                   {category.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="image">Image URL</Label>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-2">
//             <Input
//               id="image"
//               aria-label="Product Image URL"
//               value={imageUrl}
//               onChange={(e) => setImageUrl(e.target.value)}
//               disabled={isSubmitting}
//               className="bg-gray-700 border-gray-600"
//             />
//           </div>
//           <div
//             className="flex items-center justify-center bg-gray-700 rounded-md p-2"
//             aria-live="polite"
//           >
//             {imageUrl ? (
//               <img
//                 src={imageUrl || "/placeholder.svg"}
//                 alt="Product preview"
//                 className="max-h-20 object-contain"
//               />
//             ) : (
//               <div className="flex flex-col items-center text-gray-400">
//                 <Upload className="h-8 w-8 mb-1" aria-hidden="true" />
//                 <span className="text-xs">No image</span>
//               </div>
//             )}
//           </div>
//         </div>
//         <p className="text-xs text-gray-400">
//           Enter a URL for your product image. For testing, you can use
//           "/placeholder.svg?height=300&amp;width=300"
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="digital"
//             checked={isDigital}
//             onCheckedChange={setIsDigital}
//             disabled={isSubmitting}
//             aria-checked={isDigital}
//             role="switch"
//             aria-label="Digital Product"
//           />
//           <Label htmlFor="digital">Digital Product</Label>
//         </div>

//         <div className="flex items-center space-x-2">
//           <Switch
//             id="featured"
//             checked={isFeatured}
//             onCheckedChange={setIsFeatured}
//             disabled={isSubmitting}
//             aria-checked={isFeatured}
//             role="switch"
//             aria-label="Featured Product"
//           />
//           <Label htmlFor="featured">Featured Product</Label>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="stock">Stock Quantity</Label>
//           <Input
//             id="stock"
//             aria-label="Stock Quantity"
//             type="number"
//             value={stockQuantity}
//             onChange={(e) => setStockQuantity(e.target.value)}
//             min="0"
//             disabled={isSubmitting}
//             className="bg-gray-700 border-gray-600"
//           />
//         </div>
//       </div>

//       <div className="flex justify-end gap-4">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onCancel}
//           disabled={isSubmitting}
//         >
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           className="bg-bitcoin hover:bg-bitcoin/90 text-black"
//           disabled={isSubmitting}
//           aria-disabled={isSubmitting}
//         >
//           {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
//         </Button>
//       </div>
//     </form>
//   )
// }

