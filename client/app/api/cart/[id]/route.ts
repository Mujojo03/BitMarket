import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const { quantity } = await req.json()

    if (quantity === undefined) {
      return NextResponse.json({ error: "Quantity is required" }, { status: 400 })
    }

    // Check if cart item exists and belongs to the user
    const { data: cartItem } = await supabase.from("cart_items").select("user_id").eq("id", params.id).single()

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    if (cartItem.user_id !== session.user.id) {
      return NextResponse.json({ error: "You can only update your own cart" }, { status: 403 })
    }

    if (quantity <= 0) {
      // Delete item if quantity is 0 or negative
      const { error } = await supabase.from("cart_items").delete().eq("id", params.id)

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true, deleted: true })
    } else {
      // Update quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", params.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json({ cart_item: data })
    }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if cart item exists and belongs to the user
    const { data: cartItem } = await supabase.from("cart_items").select("user_id").eq("id", params.id).single()

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    if (cartItem.user_id !== session.user.id) {
      return NextResponse.json({ error: "You can only delete items from your own cart" }, { status: 403 })
    }

    const { error } = await supabase.from("cart_items").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
