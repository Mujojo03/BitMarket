import Link from "next/link"
import Image from "next/image"
import { Bitcoin, Wallet, ShoppingCart, Truck, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HowItWorksPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How BitMarket Works</h1>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          BitMarket is a Bitcoin-native marketplace that connects buyers and sellers worldwide through the Lightning
          Network.
        </p>
      </div>

      {/* For Buyers Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6 text-bitcoin" />
          For Buyers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bitcoin text-black text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-4">
                  Connect your Lightning wallet to BitMarket to make instant Bitcoin payments.
                </p>
                <Image
                  src="https://cdn.vectorstock.com/i/preview-1x/73/73/connect-your-wallet-blue-gradient-concept-icon-vector-44547373.jpg"
                  alt="Connect wallet illustration"
                  width={200}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bitcoin text-black text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Browse & Purchase</h3>
                <p className="text-gray-400 mb-4">
                  Browse products from sellers worldwide and make purchases with Bitcoin.
                </p>
                <Image
                  src="https://thereistalent.com/wp-content/uploads/2022/03/Blog-7.png.webp"
                  alt="Browse products illustration"
                  width={200}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bitcoin text-black text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Receive Your Items</h3>
                <p className="text-gray-400 mb-4">
                  Receive physical items via shipping or instant access to digital products.
                </p>
                <Image
                  src="https://msautomacao.com.br/wp-content/uploads/2021/08/Gestao-preco-produtos-digitais-automacao-comercial-blumenau-600x400.jpg"
                  alt="Receive items illustration"
                  width={200}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/browse">
            <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">
              Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* For Sellers Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <Wallet className="mr-2 h-6 w-6 text-bitcoin" />
          For Sellers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin text-black text-lg font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold mb-2">Create Seller Account</h3>
                <p className="text-gray-400 text-sm">Sign up and create your seller profile on BitMarket.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin text-black text-lg font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold mb-2">Connect Lightning Wallet</h3>
                <p className="text-gray-400 text-sm">Connect your Lightning wallet to receive payments.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin text-black text-lg font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold mb-2">List Your Products</h3>
                <p className="text-gray-400 text-sm">Create listings for your physical or digital products.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin text-black text-lg font-bold mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold mb-2">Get Paid in Bitcoin</h3>
                <p className="text-gray-400 text-sm">Receive instant payments in Bitcoin for your sales.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/seller/create">
            <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">
              Become a Seller <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* How Bitcoin Payments Work */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <Bitcoin className="mr-2 h-6 w-6 text-bitcoin" />
          How Bitcoin Payments Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">The Lightning Network</h3>
            <p className="text-gray-400 mb-4">
              BitMarket uses the Lightning Network, a layer-2 solution built on top of Bitcoin, to enable instant,
              low-fee transactions. This allows for:
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-bitcoin mr-2 mt-0.5 flex-shrink-0" />
                <span>Instant payments without waiting for blockchain confirmations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-bitcoin mr-2 mt-0.5 flex-shrink-0" />
                <span>Extremely low transaction fees, often less than a cent</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-bitcoin mr-2 mt-0.5 flex-shrink-0" />
                <span>Global payments without currency conversion or international fees</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-bitcoin mr-2 mt-0.5 flex-shrink-0" />
                <span>Secure transactions with cryptographic proof of payment</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Escrow System</h3>
            <p className="text-gray-400 mb-4">Our built-in escrow system protects both buyers and sellers:</p>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center">
                  <Wallet className="h-4 w-4 text-bitcoin mr-2" />
                  For Buyers
                </h4>
                <p className="text-sm text-gray-400">
                  Your payment is held in escrow until you confirm receipt of your item, protecting you from fraud.
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center">
                  <Truck className="h-4 w-4 text-bitcoin mr-2" />
                  For Sellers
                </h4>
                <p className="text-sm text-gray-400">
                  You're guaranteed payment once the buyer confirms receipt, eliminating chargeback risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Do I need a Bitcoin wallet?</h3>
            <p className="text-gray-400">
              Yes, you'll need a Lightning-compatible Bitcoin wallet to buy or sell on BitMarket. We recommend wallets
              like Phoenix, Muun, or Breez.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">How much are the fees?</h3>
            <p className="text-gray-400">
              Sellers pay a flat 5% fee on each sale. There are no listing fees or monthly charges. Lightning Network
              transaction fees are typically less than a cent.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">What can I sell on BitMarket?</h3>
            <p className="text-gray-400">
              You can sell physical products, digital goods, and services as long as they comply with our terms of
              service. We do not allow illegal items or services.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">How do I get started?</h3>
            <p className="text-gray-400">
              Create an account, connect your Lightning wallet, and you're ready to start buying or selling on
              BitMarket.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-bitcoin rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-4">Ready to join the Bitcoin economy?</h2>
        <p className="text-black/80 mb-6 max-w-2xl mx-auto">
          Start buying and selling with Bitcoin today. Join thousands of users already using BitMarket.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/browse">
            <Button className="bg-black hover:bg-black/90 text-white font-medium">Start Shopping</Button>
          </Link>
          <Link href="/seller/create">
            <Button variant="outline" className="border-black text-black hover:bg-black/10">
              Become a Seller
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
