"use client"

import Link from "next/link"
import { useState } from "react"
import { Bitcoin, Menu, X, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { WalletModal } from "@/components/wallet-modal"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchBar } from "@/components/search-bar"

export function Navbar() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-dark">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Bitcoin className="h-6 w-6 text-bitcoin" />
            <span className="text-xl font-bold">
              <span className="text-bitcoin">Bit</span>Market
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-sm font-medium hover:text-bitcoin transition-colors">
              Browse
            </Link>
            <Link href="/sell" className="text-sm font-medium hover:text-bitcoin transition-colors">
              Sell
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-bitcoin transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-bitcoin transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-bitcoin transition-colors">
              Contact
            </Link>
            <SearchBar />
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="hidden md:flex items-center text-sm font-medium hover:text-bitcoin transition-colors"
            >
              <ShoppingCart className="h-5 w-5 mr-1" />
              <span className="sr-only md:not-sr-only">Cart</span>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white">
                      {user.fullName?.charAt(0) || user.username?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName || "User"}</p>
                      <p className="text-xs leading-none text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Account</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.isSeller && (
                    <DropdownMenuItem asChild>
                      <Link href="/account?tab=products" className="cursor-pointer">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>My Products</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-1 hover:text-bitcoin transition-colors">
                <User className="h-5 w-5" />
                <span className="font-medium">Login</span>
              </Link>
            )}

            <Button
              className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
              onClick={() => setIsWalletModalOpen(true)}
            >
              Connect Wallet
            </Button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-dark text-white border-l border-gray-800 w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <Bitcoin className="h-6 w-6 text-bitcoin" />
                      <span className="text-xl font-bold">
                        <span className="text-bitcoin">Bit</span>Market
                      </span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/browse"
                      className="text-lg font-medium py-2 hover:text-bitcoin transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Browse
                    </Link>
                    <Link
                      href="/sell"
                      className="text-lg font-medium py-2 hover:text-bitcoin transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sell
                    </Link>
                    <Link
                      href="/how-it-works"
                      className="text-lg font-medium py-2 hover:text-bitcoin transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      How It Works
                    </Link>
                    <Link
                      href="/about"
                      className="text-lg font-medium py-2 hover:text-bitcoin transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="text-lg font-medium py-2 hover:text-bitcoin transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                    <Link
                      href="/cart"
                      className="text-lg font-medium py-2 hover:text-bitcoin transition-colors flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Cart
                    </Link>
                    {user ? (
                      <>
                        <Link
                          href="/account"
                          className="text-lg font-medium py-2 hover:text-bitcoin transition-colors flex items-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-2" />
                          Account
                        </Link>
                        <button
                          className="text-lg font-medium py-2 hover:text-red-500 transition-colors flex items-center text-left"
                          onClick={() => {
                            signOut()
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="text-lg font-medium py-2 hover:text-bitcoin transition-colors flex items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5 mr-2" />
                        Login
                      </Link>
                    )}
                  </nav>
                  <div className="mt-auto pt-6">
                    <Button
                      className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsWalletModalOpen(true)
                      }}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <WalletModal open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen} />
    </>
  )
}