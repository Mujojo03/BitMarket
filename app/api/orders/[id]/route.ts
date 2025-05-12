import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
      .eq("id", params.id)
      .eq("buyer_id", session.user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("Error fetching order:", error)
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

    // Check if order exists and belongs to the user
    const { data: order } = await supabase.from("orders").select("buyer_id, status").eq("id", params.id).single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.buyer_id !== session.user.id) {
      return NextResponse.json({ error: "You can only update your own orders" }, { status: 403 })
    }

    const { status } = await req.json()

    // Only allow certain status transitions
    const allowedTransitions: Record<string, string[]> = {
      pending: ["cancelled"],
      paid: ["cancelled"],
      shipped: ["delivered"],
      delivered: ["completed"],
    }

    if (!allowedTransitions[order.status]?.includes(status)) {
      return NextResponse.json(
        {
          error: `Cannot change order status from ${order.status} to ${status}`,
        },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
