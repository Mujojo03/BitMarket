import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

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

    // Check if user is already a seller
    const { data: profile } = await supabase.from("profiles").select("is_seller").eq("id", session.user.id).single()

    if (profile?.is_seller) {
      return NextResponse.json({ error: "You are already a seller" }, { status: 400 })
    }

    // Update profile to become a seller
    const { data, error } = await supabase
      .from("profiles")
      .update({
        is_seller: true,
        seller_since: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error("Error becoming seller:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
