"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/lib/mock-data"

interface AccountProfileProps {
  user: User
}

export function AccountProfile({ user }: AccountProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { becomeSeller } = useAuth()
  const { toast } = useToast()

  const handleBecomeSeller = async () => {
    try {
      setIsLoading(true)
      await becomeSeller()

      toast({
        title: "Success!",
        description: "You are now a seller on Bit Merket.",
      })
    } catch (error) {
      console.error("Error becoming seller:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to become a seller",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal information and account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
              {user.fullName?.charAt(0) || user.username?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.fullName || "User"}</h3>
              <p className="text-gray-400">{user.username || "No username set"}</p>
              <div className="mt-2">
                <Badge variant="outline" className={user.isSeller ? "bg-bitcoin/10 text-bitcoin border-bitcoin" : ""}>
                  {user.isSeller ? "Seller" : "Buyer"}
                </Badge>
              </div>
              {user.isSeller && (
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Seller since: {new Date(user.sellerSince || "").toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Rating: {user.sellerRating.toFixed(1)} ⭐ • Sales: {user.sellerSales}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {!user.isSeller && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Become a Seller</CardTitle>
            <CardDescription>Start selling your products on Bit Merket</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              As a seller, you can list your products, manage your inventory, and earn Bitcoin.
            </p>
            <div className="flex justify-end">
              <Button
                className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
                onClick={handleBecomeSeller}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Become a Seller"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
