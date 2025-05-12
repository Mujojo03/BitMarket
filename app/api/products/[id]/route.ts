import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(*),
        profiles!seller_id(id, username, full_name, avatar_url, seller_rating, seller_sales),
        reviews(*)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    // Check if product exists and belongs to the user
    const { data: product } = await supabase.from("products").select("seller_id").eq("id", params.id).single()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if the user is the seller of the product
    if (product.seller_id !== session.user.id) {
      // Check if user is an admin (would need an admin flag in profiles)
      const { data: profile } = await supabase.from("profiles").select("is_seller").eq("id", session.user.id).single()

      if (!profile?.is_seller) {
        return NextResponse.json({ error: "You can only update your own products" }, { status: 403 })
      }
    }

    const updates = await req.json()

    // Don't allow changing the seller ID
    delete updates.seller_id

    const { data, error } = await supabase.from("products").update(updates).eq("id", params.id).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error("Error updating product:", error)
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

    // Check if product exists and belongs to the user
    const { data: product } = await supabase.from("products").select("seller_id").eq("id", params.id).single()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if the user is the seller of the product
    if (product.seller_id !== session.user.id) {
      // Check if user is an admin (would need an admin flag in profiles)
      const { data: profile } = await supabase.from("profiles").select("is_seller").eq("id", session.user.id).single()

      if (!profile?.is_seller) {
        return NextResponse.json({ error: "You can only delete your own products" }, { status: 403 })
      }
    }

    const { error } = await supabase.from("products").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
