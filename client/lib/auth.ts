import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export type UserRole = "user" | "seller" | "admin"

export interface UserJwtPayload {
  id: string
  email: string
  name: string
  role: UserRole
}

export async function signJwtToken(payload: UserJwtPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

export async function verifyJwtToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload as UserJwtPayload
  } catch (error) {
    return null
  }
}

export async function getAuthUser(req?: NextRequest): Promise<UserJwtPayload | null> {
  const cookieStore = cookies()
  const token = req?.cookies.get("auth-token")?.value || cookieStore.get("auth-token")?.value

  if (!token) return null

  return verifyJwtToken(token)
}

export function setAuthCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
  })

  return res
}

export function removeAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  })

  return res
}
