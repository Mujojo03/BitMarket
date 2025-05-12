import Link from "next/link"
import { Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <Bitcoin className="h-24 w-24 text-bitcoin mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-400 max-w-md mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">Return Home</Button>
        </Link>
        <Link href="/browse">
          <Button variant="outline">Browse Products</Button>
        </Link>
      </div>
    </div>
  )
}
