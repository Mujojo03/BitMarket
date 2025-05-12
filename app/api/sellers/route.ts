import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_seller", true)
      .order("seller_rating", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ sellers: data })
  } catch (error) {
    console.error("Error fetching sellers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
