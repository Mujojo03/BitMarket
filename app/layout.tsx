import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bit Market - The Bitcoin Marketplace",
  description: "Buy and sell anything, anywhere in the world with Bitcoin and Lightning Network",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // ✅ Suppress hydration warning in <html>
    <html lang="en" suppressHydrationWarning>
      {
        // ✅ Suppress hydration warning in <body> to avoid mismatch from className changes
      }
      <body suppressHydrationWarning className={inter.className}>
        {
          // ✅ These providers should be Client Components
          // Make sure `theme-provider.tsx`, `auth-context.tsx`, etc. have `'use client'` at the top
        }
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
