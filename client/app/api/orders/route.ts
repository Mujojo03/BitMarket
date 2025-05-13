import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(*, products(*))
      `)
      .eq("buyer_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ orders: data })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { shipping_address } = await req.json()

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select(`
        *,
        products(*)
      `)
      .eq("user_id", session.user.id)

    if (cartError) {
      throw cartError
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 })
    }

    // Calculate total amount
    let totalAmount = 0
    for (const item of cartItems) {
      totalAmount += item.quantity * item.products.price
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: session.user.id,
        status: "pending",
        total_amount: totalAmount,
        shipping_address,
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    // Clear cart
    const { error: clearCartError } = await supabase.from("cart_items").delete().eq("user_id", session.user.id)

    if (clearCartError) {
      throw clearCartError
    }

    // TODO: Generate Lightning invoice
    // This would involve calling a Lightning Network node API
    const lightningInvoice = "lnbc..."

    // Update order with invoice
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({ lightning_invoice: lightningInvoice })
      .eq("id", order.id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
