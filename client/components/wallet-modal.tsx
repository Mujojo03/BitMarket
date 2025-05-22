"use client"

import { useState, useEffect } from "react"
import { Bitcoin, QrCode, Copy, Check, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface WalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const [copied, setCopied] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const { toast } = useToast()

  const mockLightningAddress = "user@satsoko.com"

  useEffect(() => {
    // Reset state when modal is opened
    if (open) {
      setConnected(false)
      setConnecting(false)
      setWalletBalance(null)
    }
  }, [open])

  const handleCopy = () => {
    navigator.clipboard.writeText(mockLightningAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Copied to clipboard",
      description: "Lightning address copied to clipboard",
    })
  }

  const handleConnect = async () => {
    try {
      setConnecting(true)

      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful connection
      setConnected(true)
      setWalletBalance(125000) // 125,000 sats

      toast({
        title: "Wallet connected!",
        description: "Your Lightning wallet has been connected successfully.",
      })

      // Close modal after a delay
      setTimeout(() => onOpenChange(false), 1500)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
      })
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-dark border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-bitcoin" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>Connect your Lightning wallet to start buying and selling on SatSoko.</DialogDescription>
        </DialogHeader>

        {connected ? (
          <div className="py-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wallet Connected!</h3>
              <p className="text-gray-400 mb-4">Your Lightning wallet has been connected successfully.</p>

              <div className="bg-gray-800 rounded-lg p-4 w-full mb-4">
                <p className="text-sm text-gray-400 mb-1">Available Balance</p>
                <div className="flex items-center justify-center text-2xl font-bold">
                  <Bitcoin className="h-5 w-5 text-bitcoin mr-2" />
                  {walletBalance?.toLocaleString()} sats
                </div>
              </div>

              <Button
                className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
                onClick={() => onOpenChange(false)}
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="scan">Scan QR</TabsTrigger>
              <TabsTrigger value="address">Lightning Address</TabsTrigger>
            </TabsList>
            <TabsContent value="scan" className="mt-4">
              <div className="flex flex-col items-center justify-center p-4">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QrCode className="h-48 w-48 text-black" />
                </div>
                <p className="text-sm text-gray-400 text-center mb-4">
                  Scan this QR code with your Lightning wallet to connect
                </p>
                <Button
                  className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
                  onClick={handleConnect}
                  disabled={connecting || connected}
                >
                  {connecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : connected ? (
                    "Connected!"
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="address" className="mt-4">
              <div className="flex flex-col p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="grid flex-1 gap-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Your Lightning Address
                    </label>
                    <div className="flex h-10">
                      <input
                        className="flex-1 h-10 rounded-l-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
                        value={mockLightningAddress}
                        readOnly
                      />
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="h-10 rounded-l-none rounded-r-md border border-l-0 border-gray-700"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full bg-bitcoin hover:bg-bitcoin/90 text-black font-medium"
                  onClick={handleConnect}
                  disabled={connecting || connected}
                >
                  {connecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : connected ? (
                    "Connected!"
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
