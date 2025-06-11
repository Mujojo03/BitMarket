"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn, loading } = useAuth()
  const [localError, setLocalError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const { toast } = useToast()

  useEffect(() => {
    if (registered) {
      toast({
        title: "Registration successful!",
        description: "You can now log in with your credentials.",
      })
    }
  }, [registered, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    try {
      await signIn(email, password)
      // redirect after login if needed, e.g. router.push("/")
    } catch (err: any) {
      setLocalError(err?.message || "Login failed")
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Bitcoin className="h-12 w-12 text-bitcoin mb-2" />
          <CardTitle className="text-2xl font-bold">Login to Your Account</CardTitle>
          <CardDescription>Enter your email and password below</CardDescription>
        </CardHeader>

        {localError && (
          <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900">
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-bitcoin hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-bitcoin hover:underline">
              Register
            </Link>
          </div>
          <div className="text-xs text-center text-gray-500">
            By logging in, you agree to our{" "}
            <Link href="/terms" className="text-gray-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gray-400 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Bitcoin } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useAuth } from "@/contexts/auth-context"
// import { useToast } from "@/components/ui/use-toast"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const { signIn, loading } = useAuth()
//   const [localError, setLocalError] = useState<string | null>(null)
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const registered = searchParams.get("registered")
//   const { toast } = useToast()

//   useEffect(() => {
//     if (registered) {
//       toast({
//         title: "Registration successful!",
//         description: "You can now log in with your credentials.",
//       })
//     }
//   }, [registered, toast])
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLocalError(null)
//     try {
//       await signIn(email, password)
//     } catch (err: any) {
//       setLocalError(err?.message || "Login failed")
//     }
//   }
//   return (
//     <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
//       <Card className="w-full max-w-md bg-gray-800 border-gray-700">
//           {localError && (
//             <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900">
//               <AlertDescription>{localError}</AlertDescription>
//             </Alert>
//           )}
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="bg-gray-700 border-gray-600"
//               />
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="password">Password</Label>
//                 <Link href="/forgot-password" className="text-sm text-bitcoin hover:underline">
//                   Forgot password?
//                 </Link>
//               </div>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="bg-gray-700 border-gray-600"
//               />
//             </div>
//             <Button
//               type="submit"
//               className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-4">
//           <div className="text-sm text-center text-gray-400">
//             Don't have an account?{" "}
//             <Link href="/register" className="text-bitcoin hover:underline">
//               Register
//             </Link>
//           </div>
//           <div className="text-xs text-center text-gray-500">
//             By logging in, you agree to our{" "}
//             <Link href="/terms" className="text-gray-400 hover:underline">
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link href="/privacy" className="text-gray-400 hover:underline">
//               Privacy Policy
//             </Link>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//     )
//   }
