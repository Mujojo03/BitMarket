import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { CategoryCardData } from "@/lib/types"

interface CategoryCardProps {
  category: CategoryCardData
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="overflow-hidden bg-gray-800 border-gray-700 transition-all hover:border-bitcoin">
        <div className="relative aspect-square overflow-hidden">
          {/* 🧠 Fallback to placeholder if image is missing */}
          <Image
            src={category.imageUrl || "/placeholder.svg"} // fallback to placeholder
            alt={category.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-3 text-center">
          <h3 className="font-medium text-sm">{category.name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}

// import Link from "next/link"
// import Image from "next/image"
// import { Card, CardContent } from "@/components/ui/card"
// // import type { Category } from "@/lib/mock-data"
// import type { Category } from "@/lib/types"


// interface CategoryCardProps {
//   category: Category
// }

// export function CategoryCard({ category }: CategoryCardProps) {
//   return (
//     <Link href={`/category/${category.slug}`}>
//       <Card className="overflow-hidden bg-gray-800 border-gray-700 transition-all hover:border-bitcoin">
//         <div className="relative aspect-square overflow-hidden">
//           <Image
//             src={category.imageUrl || "/placeholder.svg"}
//             alt={category.name}
//             fill
//             className="object-cover transition-transform hover:scale-105"
//           />
//         </div>
//         <CardContent className="p-3 text-center">
//           <h3 className="font-medium text-sm">{category.name}</h3>
//         </CardContent>
//       </Card>
//     </Link>
//   )
// }
