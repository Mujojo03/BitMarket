"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { AccountProfile } from "@/components/account/account-profile"
import { AccountProducts } from "@/components/account/account-products"
import { AccountOrders } from "@/components/account/account-orders"
import { AccountSettings } from "@/components/account/account-settings"

export default function AccountPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "profile"

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

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
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="w-full bg-gray-800 border-b border-gray-700 mb-8">
          <TabsTrigger value="profile" className="flex-1">
            Profile
          </TabsTrigger>
          {user.isSeller && (
            <TabsTrigger value="products" className="flex-1">
              My Products
            </TabsTrigger>
          )}
          <TabsTrigger value="orders" className="flex-1">
            My Orders
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <AccountProfile user={user} />
        </TabsContent>

        {user.isSeller && (
          <TabsContent value="products">
            <AccountProducts user={user} />
          </TabsContent>
        )}

        <TabsContent value="orders">
          <AccountOrders user={user} />
        </TabsContent>

        <TabsContent value="settings">
          <AccountSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
