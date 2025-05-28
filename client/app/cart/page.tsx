"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bitcoin, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { cartApi } from "@/lib/api-service"
import type { CartItem } from "@/lib/mock-data"
import { QrCode } from "lucide-react"

export default function CartPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<(CartItem & { product: any })[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [qrCodeValue, setQRCodeValue] = useState<string | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "lightning" | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const items = await cartApi.getCartForUser(user.id)
          setCartItems(items)
        } else {
          // For demo purposes, we'll show some mock items even if not logged in
          const mockItems = await cartApi.getCartForUser("user1")
          setCartItems(mockItems)
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your cart. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [user, toast])

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const userId = user?.id || "user1" // For demo purposes
      const updatedCart = await cartApi.updateCartItem(userId, cartItemId, quantity)
      setCartItems(updatedCart)
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
      })
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const userId = user?.id || "user1" // For demo purposes
      const updatedCart = await cartApi.removeFromCart(userId, cartItemId)
      setCartItems(updatedCart)
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item. Please try again.",
      })
    }
  }

  //modify this function to handle checkout
  const handleCheckout = async () => {
    setShowPaymentOptions(true)
    try {
      setCheckingOut(true)

      // Step 1: Generate payment URL (you'll use real invoice URL here)
      const paymentUrl = `https://your-payment-provider.com/pay/invoice123`
      setQRCodeValue(paymentUrl)
      setShowQRCode(true)

      // Step 2: PAUSE here — wait until payment is confirmed manually or via websocket
      // So we do NOT proceed to success toast or cart clearing yet.

      // toast({
      //   title: "Checkout initiated",
      //   description: "Please complete the payment in your wallet app.",
      //   action: {
      //     label: "View QR Code",
      //     onClick: () => setShowQRCode(true),
      //   },
      // })
      // setTimeout(() => {
      //   setShowQRCode(false)
      // }, 10000) // Hide QR code after 10 seconds

      // The function ends here — once payment is confirmed, call a separate function:
      // completeCheckout()
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
      })
      setCheckingOut(false)
    }
  }

  const handlePaymentMethodSelect = async (method: "lightning" | "mpesa") => {
    setShowPaymentOptions(false)
    setCheckingOut(true)

    try {
      if (method === "lightning") {
        // Simulate invoice creation (replace with actual API call)
        const paymentUrl = `https://your-payment-provider.com/pay/invoice123`
        setQRCodeValue(paymentUrl)
        setShowQRCode(true)
      } else if (method === "mpesa") {
        // Replace with actual Mpesa STK push logic or redirection
        toast({
          title: "Mpesa Selected",
          description: "Initiating Mpesa payment...",
        })

        // Simulate Mpesa delay then complete checkout
        await new Promise((r) => setTimeout(r, 2000))
        await completeCheckout()
      }
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Something went wrong. Try again.",
      })
      setCheckingOut(false)
    }
  }

  const handleMpesaPayment = async () => {
    try {
      toast({ title: "Processing Mpesa...", description: `Sending STK push to ${phoneNumber}` })

      // Replace with real Mpesa API call
      await new Promise((r) => setTimeout(r, 2000))

      // On success
      await completeCheckout()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Mpesa Failed",
        description: "Could not complete Mpesa payment.",
      })
      setCheckingOut(false)
    }
  }

  const completeCheckout = async () => {
    try {
      const userId = user?.id || "user1"
      await cartApi.clearCart(userId)
      setCartItems([])
      toast({
        title: "Order placed!",
        description: "Your order has been placed successfully.",
      })
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Finalization Error",
        description: "Something went wrong after payment.",
      })
    } finally {
      // Reset everything
      setCheckingOut(false)
      setPaymentMethod(null)
      setQRCodeValue("")
      setPhoneNumber("")
      setShowQRCode(false)
    }
  }



  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your cart...</p>
        </div>
      </div>
    )
  }

  const handleLightning = async () => {
    setPaymentMethod("lightning")
    // Replace with real invoice generation logic
    const paymentUrl = `https://your-payment-provider.com/pay/invoice123`
    setQRCodeValue(paymentUrl)
    setShowQRCode(true)
  }


  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/browse">
            <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Shopping Cart ({cartItems.length} items)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-4 py-4 border-b border-gray-700">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        <Image
                          src={item.product.imageUrl || "/placeholder.svg?height=100&width=100"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <Link href={`/product/${item.product.id}`} className="text-lg font-semibold hover:text-bitcoin">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-400">
                        Sold by: {item.product.seller?.fullName || item.product.seller?.username || "Unknown Seller"}
                      </p>
                      <div className="flex items-center mt-2">
                        <Bitcoin className="h-4 w-4 text-bitcoin mr-1" />
                        <span className="font-medium">{item.product.price.toLocaleString()} sats</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="h-8 w-12 rounded-none text-center bg-gray-700 border-gray-600"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/browse">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const userId = user?.id || "user1" // For demo purposes
                    await cartApi.clearCart(userId)
                    setCartItems([])
                    toast({
                      title: "Cart cleared",
                      description: "All items have been removed from your cart.",
                    })
                  }}
                >
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <div className="flex items-center">
                    <Bitcoin className="h-4 w-4 text-bitcoin mr-1" />
                    <span>{calculateTotal().toLocaleString()} sats</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee</span>
                  <div className="flex items-center">
                    <Bitcoin className="h-4 w-4 text-bitcoin mr-1" />
                    <span>10 sats</span>
                  </div>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <div className="flex items-center">
                    <Bitcoin className="h-5 w-5 text-bitcoin mr-1" />
                    <span>{(calculateTotal() + 10).toLocaleString()} sats</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
                  onClick={() => setCheckingOut(true)}
                  disabled={checkingOut}
                >
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>

              {checkingOut && (
                <div className="mt-4 p-4 bg-black shadow-md rounded-xl space-y-4">
                  <p className="text-center font-semibold">Choose Payment Method:</p>
                  <div className="flex gap-2">
                    <Button
                      variant={paymentMethod === "mpesa" ? "default" : "outline"}
                      onClick={() => {
                        setPaymentMethod("mpesa")
                        setShowQRCode(false)
                      }}
                      className="w-full"
                    >
                      Mpesa
                    </Button>
                    <Button
                      variant={paymentMethod === "lightning" ? "default" : "outline"}
                      onClick={() => {
                        setPaymentMethod("lightning")
                        handleLightning()
                      }}
                      className="w-full"
                    >
                      Lightning
                    </Button>
                  </div>

                  {/* QR code view */}
                  {showQRCode && paymentMethod === "lightning" && (
                    <div className="mt-4 flex flex-col items-center space-y-2">
                      <QrCode values={qrCodeValue ?? undefined} size={180} />
                      {/* <Button onClick={completeCheckout} className="mt-2">
                    I've Paid – Complete Order
                  </Button> */}
                    </div>
                  )}
                  {paymentMethod === "mpesa" && (
                    <div className="mt-4 p-4 bg-white shadow-md rounded-xl space-y-2">
                      <label className="font-medium">Enter Phone Number:</label>
                      <input
                        type="tel"
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g. 07XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <Button
                        className="w-full mt-2"
                        onClick={handleMpesaPayment}
                        disabled={!phoneNumber}
                      >
                        Pay with Mpesa
                      </Button>
                    </div>
                  )}

                  {/* {showQRCode && qrCodeValue && (
                <div className="flex justify-center mt-4">
                  <QrCode values={qrCodeValue} size={180} />
                </div>
              )} */}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
function setShowPaymentOptions(arg0: boolean) {
  throw new Error("Function not implemented.")
}

function completeCheckout() {
  throw new Error("Function not implemented.")
}

