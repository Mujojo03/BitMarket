"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function SellerCreatePage() {
  const { user, loading, becomeSeller } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/seller/create")
      return
    }

    if (!loading && user && user.isSeller) {
      router.push("/seller/dashboard")
      return
    }

    if (user) {
      setUsername(user.username || "")
      setFullName(user.fullName || "")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      // Become a seller
      await becomeSeller()

      toast({
        title: "Success!",
        description: "You are now a seller on BitMarket.",
      })

      // Move to next step
      setStep(2)
    } catch (error) {
      console.error("Error becoming seller:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to become a seller. Please try again.",
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

  if (step === 2) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-24 max-w-3xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Congratulations!</CardTitle>
            <CardDescription>You are now a seller on BitMarket</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              Your seller account has been created successfully. You can now start listing products and earning Bitcoin
              on BitMarket.
            </p>
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="font-medium">What would you like to do next?</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/seller/create-product">
                  <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium w-full">
                    Create Your First Product <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/seller/dashboard">
                  <Button variant="outline" className="w-full">
                    Go to Seller Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Become a <span className="text-bitcoin">BitMarket</span> Seller
            </h1>
            <p className="text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Start selling your products and earn Bitcoin from customers worldwide.
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Seller Registration</CardTitle>
              <CardDescription>Fill in your seller profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                  <p className="text-xs text-gray-400">This will be your seller handle on BitMarket.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name or Shop Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name or Shop Name"
                    required
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell customers about yourself or your shop"
                    className="bg-gray-700 border-gray-600 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Become a Seller"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center">
          <div className="space-y-8">
            <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px] hidden lg:block">
              <Image
                src="/placeholder.svg?height=450&width=450"
                alt="Seller illustration"
                fill
                className="object-contain"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin/10 mt-1">
                  <CheckCircle className="h-5 w-5 text-bitcoin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Low Fees</h3>
                  <p className="text-gray-400">
                    Pay just 2-5% per sale, compared to 10-30% on traditional marketplaces.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin/10 mt-1">
                  <CheckCircle className="h-5 w-5 text-bitcoin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Global Reach</h3>
                  <p className="text-gray-400">Sell to anyone, anywhere in the world, with no payment restrictions.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin/10 mt-1">
                  <CheckCircle className="h-5 w-5 text-bitcoin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Instant Payments</h3>
                  <p className="text-gray-400">Get paid instantly in Bitcoin via the Lightning Network.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
