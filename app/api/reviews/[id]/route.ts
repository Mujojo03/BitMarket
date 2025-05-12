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

    // Check if review exists and belongs to the user
    const { data: review } = await supabase.from("reviews").select("user_id").eq("id", params.id).single()

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (review.user_id !== session.user.id) {
      return NextResponse.json({ error: "You can only update your own reviews" }, { status: 403 })
    }

    const { rating, comment } = await req.json()

    if (!rating) {
      return NextResponse.json({ error: "Rating is required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("reviews")
      .update({
        rating,
        comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ review: data })
  } catch (error) {
    console.error("Error updating review:", error)
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

    // Check if review exists and belongs to the user
    const { data: review } = await supabase.from("reviews").select("user_id").eq("id", params.id).single()

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (review.user_id !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own reviews" }, { status: 403 })
    }

    const { error } = await supabase.from("reviews").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
