import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("category")
    const featured = searchParams.get("featured") === "true"
    const sellerId = searchParams.get("seller")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    let query = supabase
      .from("products")
      .select(`
        *,
        categories(*),
        profiles!seller_id(id, username, full_name, avatar_url, seller_rating, seller_sales)
      `)
      .limit(limit)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    if (featured) {
      query = query.eq("is_featured", true)
    }

    if (sellerId) {
      query = query.eq("seller_id", sellerId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ products: data })
  } catch (error) {
    console.error("Error fetching products:", error)
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

    // Check if user is a seller
    const { data: profile } = await supabase.from("profiles").select("is_seller").eq("id", session.user.id).single()

    if (!profile?.is_seller) {
      return NextResponse.json({ error: "Only sellers can create products" }, { status: 403 })
    }

    const productData = await req.json()

    // Validate required fields
    const requiredFields = ["name", "price", "category_id"]
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Set the seller ID from the authenticated user
    productData.seller_id = session.user.id

    const { data, error } = await supabase.from("products").insert(productData).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
