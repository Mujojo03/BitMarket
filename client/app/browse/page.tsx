"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { useProductContext } from "contexts/product-context"
import { useCategoryContext } from "contexts/category-context"
import type { Product, Category, User } from "@/lib/types"

// Import jQuery
import $ from "jquery"

// Extend Product with category and seller of type User
export interface ProductWithCategoryAndSeller extends Product {
  category: Category
  seller: User
}

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const searchParam = searchParams.get("search")
  const [searchQuery, setSearchQuery] = useState<string | null>(searchParam)

  const { products: allProducts, fetchProducts, loading: productsLoading } = useProductContext()
  const { categories, loading: categoriesLoading } = useCategoryContext()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [productType, setProductType] = useState<"all" | "physical" | "digital">("all")

  // Override fetchProducts with jQuery AJAX call example
  const fetchProductsWithAjax = () => {
    $.ajax({
      url: "http://localhost:5000/products",
      method: "GET",
      dataType: "json",
      success: (data: ProductWithCategoryAndSeller[]) => {
        console.log("Fetched products via AJAX:", data)
        // You can update context or local state here if needed
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching products via AJAX:", textStatus, errorThrown)
      },
    })
  }

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProductsWithAjax()
  }, [])

  // Filter products by selected category, price, and search query
  const filteredProducts = allProducts
    .filter((product) => {
      if (selectedCategory && product.category.id !== Number(selectedCategory)) return false
      return true
    })
    .filter((product) => {
      return product.priceSats >= priceRange[0] && product.priceSats <= priceRange[1]
    })
    .filter((product) => {
      if (!searchQuery) return true
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

  const loading = productsLoading || categoriesLoading

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
  }

  const handleProductTypeChange = (type: "all" | "physical" | "digital") => {
    setProductType(type)
  }

  const handleResetFilters = () => {
    setSelectedCategory(null)
    setPriceRange([0, 1000])
    setProductType("all")
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Products"}
          </h1>
          <p className="text-gray-400 mt-1">
            {loading ? "Loading products..." : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-dark border-r border-gray-800 w-[300px] sm:w-[350px]">
              <div className="py-6">
                <h2 className="text-lg font-semibold mb-6">Filters</h2>
                <ProductFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  priceRange={priceRange}
                  productType={productType}
                  onCategoryChange={handleCategoryChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onProductTypeChange={handleProductTypeChange}
                  onReset={handleResetFilters}
                  className="md:hidden"
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="hidden md:block">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            productType={productType}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onProductTypeChange={handleProductTypeChange}
            onReset={handleResetFilters}
          />
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-700 rounded w-1/2" />
                    <div className="h-6 bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-gray-400 mb-6">Try adjusting your filters or browse all products.</p>
              <Button onClick={handleResetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
// "use client"

// import { useState, useEffect } from "react"
// import { useSearchParams } from "next/navigation"
// import { Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { ProductCard } from "@/components/product-card"
// import { ProductFilters } from "@/components/product-filters"
// import { useProductContext } from "contexts/product-context"
// import { useCategoryContext } from "contexts/category-context"
// import type { Product, Category } from "@/lib/types"

// // Import jQuery
// import $ from "jquery"

// export default function BrowsePage() {
//   const searchParams = useSearchParams()
//   const categoryParam = searchParams.get("category")
//   const searchParam = searchParams.get("search")
//   const [searchQuery, setSearchQuery] = useState<string | null>(searchParam)

//   const { products: allProducts, fetchProducts, loading: productsLoading } = useProductContext()
//   const { categories, loading: categoriesLoading } = useCategoryContext()

//   const [filtersOpen, setFiltersOpen] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
//   const [productType, setProductType] = useState<"all" | "physical" | "digital">("all")

//   // Override fetchProducts with jQuery AJAX call example
//   const fetchProductsWithAjax = () => {
//     $.ajax({
//       url: "http://localhost:5000/products", 
//       method: "GET",
//       dataType: "json",
//       success: (data: Product[]) => {
//         console.log("Fetched products via AJAX:", data)
//         // You can update context or local state here
//       },
//       error: (jqXHR, textStatus, errorThrown) => {
//         console.error("Error fetching products via AJAX:", textStatus, errorThrown)
//       },
//     })
//   }

//   // Fetch products on mount and when filters change
//   useEffect(() => {
//     fetchProductsWithAjax()
//   }, [])

//   const filteredProducts = allProducts
//     .filter((product) => {
//       if (selectedCategory && product.category.id !== selectedCategory) return false
//       return true
//     })
//     .filter((product) => {
//       return product.priceSats >= priceRange[0] && product.priceSats <= priceRange[1]
//     })
//     .filter((product) => {
//       if (productType === "all") return true
//       if (productType === "digital") return product.isDigital
//       return !product.isDigital
//     })
//     .filter((product) => {
//       if (!searchQuery) return true
//       return (
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.description.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     })

//   const loading = productsLoading || categoriesLoading

//   const handleCategoryChange = (categoryId: string | null) => {
//     setSelectedCategory(categoryId)
//   }

//   const handlePriceRangeChange = (range: [number, number]) => {
//     setPriceRange(range)
//   }

//   const handleProductTypeChange = (type: "all" | "physical" | "digital") => {
//     setProductType(type)
//   }

//   const handleResetFilters = () => {
//     setSelectedCategory(null)
//     setPriceRange([0, 1000])
//     setProductType("all")
//   }

//   return (
//     <div className="container px-4 py-8 md:px-6 md:py-12">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">
//             {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Products"}
//           </h1>
//           <p className="text-gray-400 mt-1">
//             {loading ? "Loading products..." : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
//             <SheetTrigger asChild>
//               <Button variant="outline" className="md:hidden">
//                 <Filter className="mr-2 h-4 w-4" /> Filters
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="bg-dark border-r border-gray-800 w-[300px] sm:w-[350px]">
//               <div className="py-6">
//                 <h2 className="text-lg font-semibold mb-6">Filters</h2>
//                 <ProductFilters
//                   categories={categories}
//                   selectedCategory={selectedCategory}
//                   priceRange={priceRange}
//                   productType={productType}
//                   onCategoryChange={handleCategoryChange}
//                   onPriceRangeChange={handlePriceRangeChange}
//                   onProductTypeChange={handleProductTypeChange}
//                   onReset={handleResetFilters}
//                   className="md:hidden"
//                 />
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//         <div className="hidden md:block">
//           <ProductFilters
//             categories={categories}
//             selectedCategory={selectedCategory}
//             priceRange={priceRange}
//             productType={productType}
//             onCategoryChange={handleCategoryChange}
//             onPriceRangeChange={handlePriceRangeChange}
//             onProductTypeChange={handleProductTypeChange}
//             onReset={handleResetFilters}
//           />
//         </div>
//         <div className="md:col-span-3">
//           {loading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden animate-pulse">
//                   <div className="aspect-video bg-gray-700" />
//                   <div className="p-4 space-y-3">
//                     <div className="h-5 bg-gray-700 rounded w-3/4" />
//                     <div className="h-4 bg-gray-700 rounded w-1/2" />
//                     <div className="h-6 bg-gray-700 rounded w-1/3" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
//               <h2 className="text-xl font-semibold mb-2">No products found</h2>
//               <p className="text-gray-400 mb-6">Try adjusting your filters or browse all products.</p>
//               <Button onClick={handleResetFilters}>Reset Filters</Button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState, useEffect } from "react"
// import { useSearchParams } from "next/navigation"
// import { Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { ProductCard } from "@/components/product-card"
// import { ProductFilters } from "@/components/product-filters"
// import type { Product, Category } from '@/lib/types'
// // import { productsApi, categoriesApi } from "@/lib/api-service"
// // import type { Product, Category } from "@/lib/mock-data"

// export default function BrowsePage() {
//   const searchParams = useSearchParams()
//   const categoryParam = searchParams.get("category")
//   const searchParam = searchParams.get("search")
//   const [searchQuery, setSearchQuery] = useState<string | null>(searchParam)

//   const [products, setProducts] = useState<(Product & { category: any; seller: any })[]>([])
//   const [categories, setCategories] = useState<Category[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filtersOpen, setFiltersOpen] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
//   const [productType, setProductType] = useState<"all" | "physical" | "digital">("all")

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)

//         // Fetch categories
//         const fetchedCategories = await categoriesApi.getCategories()
//         setCategories(fetchedCategories)

//         // Fetch products with filters
//         const options: any = {}

//         if (selectedCategory) {
//           options.categoryId = selectedCategory
//         }

//         const fetchedProducts = await productsApi.getProducts(options)

//         // Apply client-side filters
//         let filteredProducts = fetchedProducts

//         // Filter by search query
//         if (searchQuery) {
//           filteredProducts = filteredProducts.filter(
//             (product) =>
//               product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//               product.description.toLowerCase().includes(searchQuery.toLowerCase()),
//           )
//         }

//         // Filter by price range
//         filteredProducts = filteredProducts.filter(
//           (product) => product.price >= priceRange[0] && product.price <= priceRange[1],
//         )

//         // Filter by product type
//         if (productType !== "all") {
//           filteredProducts = filteredProducts.filter((product) =>
//             productType === "digital" ? product.isDigital : !product.isDigital,
//           )
//         }

//         setProducts(filteredProducts)
//       } catch (error) {
//         console.error("Error fetching products:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [selectedCategory, priceRange, productType, categoryParam, searchParam])

//   const handleCategoryChange = (categoryId: string | null) => {
//     setSelectedCategory(categoryId)
//   }

//   const handlePriceRangeChange = (range: [number, number]) => {
//     setPriceRange(range)
//   }

//   const handleProductTypeChange = (type: "all" | "physical" | "digital") => {
//     setProductType(type)
//   }

//   const handleResetFilters = () => {
//     setSelectedCategory(null)
//     setPriceRange([0, 1000])
//     setProductType("all")
//   }

//   return (
//     <div className="container px-4 py-8 md:px-6 md:py-12">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">
//             {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Products"}
//           </h1>
//           <p className="text-gray-400 mt-1">
//             {loading ? "Loading products..." : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
//             <SheetTrigger asChild>
//               <Button variant="outline" className="md:hidden">
//                 <Filter className="mr-2 h-4 w-4" /> Filters
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="bg-dark border-r border-gray-800 w-[300px] sm:w-[350px]">
//               <div className="py-6">
//                 <h2 className="text-lg font-semibold mb-6">Filters</h2>
//                 <ProductFilters
//                   categories={categories}
//                   selectedCategory={selectedCategory}
//                   priceRange={priceRange}
//                   productType={productType}
//                   onCategoryChange={handleCategoryChange}
//                   onPriceRangeChange={handlePriceRangeChange}
//                   onProductTypeChange={handleProductTypeChange}
//                   onReset={handleResetFilters}
//                   className="md:hidden"
//                 />
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//         <div className="hidden md:block">
//           <ProductFilters
//             categories={categories}
//             selectedCategory={selectedCategory}
//             priceRange={priceRange}
//             productType={productType}
//             onCategoryChange={handleCategoryChange}
//             onPriceRangeChange={handlePriceRangeChange}
//             onProductTypeChange={handleProductTypeChange}
//             onReset={handleResetFilters}
//           />
//         </div>
//         <div className="md:col-span-3">
//           {loading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden animate-pulse">
//                   <div className="aspect-video bg-gray-700" />
//                   <div className="p-4 space-y-3">
//                     <div className="h-5 bg-gray-700 rounded w-3/4" />
//                     <div className="h-4 bg-gray-700 rounded w-1/2" />
//                     <div className="h-6 bg-gray-700 rounded w-1/3" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : products.length === 0 ? (
//             <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
//               <h2 className="text-xl font-semibold mb-2">No products found</h2>
//               <p className="text-gray-400 mb-6">Try adjusting your filters or browse all products.</p>
//               <Button onClick={handleResetFilters}>Reset Filters</Button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
