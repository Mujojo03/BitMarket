import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Get seller profile
    const { data: seller, error: sellerError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", params.id)
      .eq("is_seller", true)
      .single()

    if (sellerError) {
      if (sellerError.code === "PGRST116") {
        return NextResponse.json({ error: "Seller not found" }, { status: 404 })
      }
      throw sellerError
    }

    // Get seller's products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(`
        *,
        categories(*)
      `)
      .eq("seller_id", params.id)
      .order("created_at", { ascending: false })

    if (productsError) {
      throw productsError
    }

    return NextResponse.json({
      seller,
      products,
    })
  } catch (error) {
    console.error("Error fetching seller:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
