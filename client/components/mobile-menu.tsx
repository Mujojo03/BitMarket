"use client"

import { useState } from "react"
import Link from "next/link"
import { Bitcoin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#111827] text-white border-r border-gray-800 w-[300px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Bitcoin className="h-6 w-6 text-[#F5A623]" />
              <span className="text-xl font-bold">
                <span className="text-[#F5A623]">Sat</span>Soko
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            <Link
              href="/browse"
              className="text-lg font-medium py-2 hover:text-[#F5A623] transition-colors"
              onClick={() => setOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="text-lg font-medium py-2 hover:text-[#F5A623] transition-colors"
              onClick={() => setOpen(false)}
            >
              Sell
            </Link>
            <Link
              href="/how-it-works"
              className="text-lg font-medium py-2 hover:text-[#F5A623] transition-colors"
              onClick={() => setOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium py-2 hover:text-[#F5A623] transition-colors"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
          </nav>
          <div className="mt-auto pt-6">
            <Button className="w-full bg-[#F5A623] hover:bg-[#E09612] text-black font-medium">Connect Wallet</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
