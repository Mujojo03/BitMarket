import Link from "next/link"
import Image from "next/image"
import { Bitcoin } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatSats } from "@/lib/utils"
import type { Product, Category, User } from "@/lib/types"
// import type { Product, Category, User } from "@/lib/mock-data"

interface ProductCardProps {
  product: Product & { category: Category; seller: User }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden bg-gray-800 border-gray-700 transition-all hover:border-bitcoin">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imgUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {product.isFeatured && (
            <div className="absolute top-2 right-2 bg-bitcoin text-black text-xs font-medium px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="space-y-1">
          <Link href={`/product/${product.id}`} className="hover:underline">
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
          </Link>
          <div className="flex items-center text-sm text-gray-400">
            <Link href={`/seller/${product.seller.id}`} className="hover:text-bitcoin hover:underline">
              {product.seller.username}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-bitcoin font-medium">
            <Bitcoin className="h-4 w-4" />
            <span>{formatSats(product.priceSats)}</span>
            <span className="text-xs text-gray-400 ml-1">sats</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">Buy Now</Button>
      </CardFooter>
    </Card>
  )
}
