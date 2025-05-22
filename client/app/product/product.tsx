"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bitcoin, Star, Truck, ShieldCheck, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { formatSats } from "@/lib/utils"
import { productsApi, reviewsApi } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { Product, Category, User, Review } from "@/lib/mock-data"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<(Product & { category: Category; seller: User }) | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<(Product & { category: Category; seller: User })[]>([])
  const [reviews, setReviews] = useState<(Review & { user: User })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)

        // Fetch product
        const product = await productsApi.getProductById(params.id)

        if (!product) {
          setError("Product not found")
          return
        }

        setProduct(product)

        // Fetch related products
        const related = await productsApi.getProducts({
          categoryId: product.categoryId,
          limit: 4,
        })

        // Filter out current product
        setRelatedProducts(related.filter((p) => p.id !== product.id))

        // Fetch reviews
        const reviews = await reviewsApi.getReviewsForProduct(product.id)
        setReviews(reviews)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [params.id])

  // Handle add to cart to be modified later
  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    toast({
      title: "Added to Cart",
      description: `${product?.name} has been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/browse">
            <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Link href="/browse" className="inline-flex items-center text-sm text-gray-400 hover:text-bitcoin mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Browse
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-800">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.isFeatured && (
            <div className="absolute top-4 right-4 bg-bitcoin text-black text-xs font-medium px-2 py-1 rounded">
              Featured
            </div>
          )}
          {product.isDigital && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
              Digital Product
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-bitcoin fill-bitcoin" : "text-gray-500"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Link
                href={`/seller/${product.seller.id}`}
                className="text-sm text-gray-400 hover:text-bitcoin hover:underline"
              >
                Sold by {product.seller.fullName}
              </Link>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-sm text-gray-400">{product.seller.sellerSales} sales</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-2xl font-bold text-bitcoin">
            <Bitcoin className="h-6 w-6" />
            <span>{formatSats(product.price)}</span>
            <span className="text-sm font-normal text-gray-400">sats</span>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium py-6 text-lg"
              onClick={handleAddToCart}
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="w-full border-gray-700 hover:bg-gray-800 py-6 text-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>

          <div className="space-y-3 rounded-lg border border-gray-800 p-4">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium">Shipping</h3>
                <p className="text-sm text-gray-400">
                  {product.isDigital ? "Digital delivery - instant download" : "Worldwide shipping available"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium">Secure Escrow</h3>
                <p className="text-sm text-gray-400">Payment is held in escrow until you confirm receipt</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bitcoin className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium">Bitcoin Payment</h3>
                <p className="text-sm text-gray-400">Pay with Bitcoin via Lightning Network</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full bg-gray-800 border-b border-gray-700">
            <TabsTrigger value="description" className="flex-1">
              Description
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="seller" className="flex-1">
              Seller Info
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-invert max-w-none">
              <p>{product.description}</p>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
                tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
              </p>
              <ul className="mt-4">
                <li>High-quality materials</li>
                <li>Handcrafted with care</li>
                <li>Unique design</li>
                <li>Fast shipping</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-800 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                          {review.user.fullName?.charAt(0) || review.user.username?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className="font-medium">{review.user.fullName || "User"}</h3>
                          <div className="flex items-center text-sm text-gray-400">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`h-3 w-3 ${j < review.rating ? "text-bitcoin fill-bitcoin" : "text-gray-500"}`}
                              />
                            ))}
                            <span className="ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {review.comment && <p className="mt-3 text-sm text-gray-300">{review.comment}</p>}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="seller" className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                {product.seller.fullName?.charAt(0) || product.seller.username?.charAt(0) || "S"}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{product.seller.fullName}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.seller.sellerRating) ? "text-bitcoin fill-bitcoin" : "text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.seller.sellerRating.toFixed(1)} ({product.seller.sellerSales} sales)
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  Member since {new Date(product.seller.sellerSince || product.seller.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-300 mt-4">
                  I'm a passionate creator specializing in Bitcoin-themed products. All items are handcrafted with care
                  and shipped worldwide. Feel free to contact me with any questions!
                </p>
                <div className="mt-4">
                  <Link href={`/seller/${product.seller.id}`}>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      View Seller Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}