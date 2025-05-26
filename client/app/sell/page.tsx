import Link from "next/link"
import Image from "next/image"
import { Bitcoin, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SellPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-dark py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Selling on <span className="text-bitcoin">SatSoko</span>
                </h1>
                <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Open your shop and start earning Bitcoin. Reach customers worldwide with our low-fee, Bitcoin-native
                  marketplace.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/seller/create">
                  <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium px-8 py-6 text-lg">
                    Open Your Shop
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" className="border-gray-600 hover:bg-gray-800 px-8 py-6 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px]">
                <Image
                  src="https://www.picpedia.org/chalkboard/images/sell.jpg"
                  alt="Seller illustration"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-900 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Sell on SatSoko?</h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of sellers already earning Bitcoin on our marketplace.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10 mb-4">
                  <Bitcoin className="h-8 w-8 text-bitcoin" />
                </div>
                <h3 className="text-xl font-bold">Low Fees</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Pay just 2-5% per sale, compared to 10-30% on traditional marketplaces.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-bitcoin" />
                </div>
                <h3 className="text-xl font-bold">Global Reach</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Sell to anyone, anywhere in the world, with no payment restrictions.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10 mb-4">
                  <ArrowRight className="h-8 w-8 text-bitcoin" />
                </div>
                <h3 className="text-xl font-bold">Instant Payments</h3>
                <p className="mt-2 text-sm text-gray-400">Get paid instantly in Bitcoin via the Lightning Network.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-dark py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Getting started as a seller on SatSoko is simple.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bitcoin text-black text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold">Connect Your Wallet</h3>
              <p className="mt-2 text-sm text-gray-400">Connect your Lightning wallet to receive payments directly.</p>
              {/* Connector line */}
              <div className="absolute right-0 top-6 hidden h-0.5 w-full translate-x-1/2 bg-bitcoin md:block md:w-1/2"></div>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bitcoin text-black text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold">Create Your Listings</h3>
              <p className="mt-2 text-sm text-gray-400">
                Add your products with descriptions, images, and prices in sats.
              </p>
              {/* Connector line */}
              <div className="absolute right-0 top-6 hidden h-0.5 w-1/2 translate-x-1/2 bg-bitcoin md:block"></div>
              <div className="absolute left-0 top-6 hidden h-0.5 w-1/2 -translate-x-1/2 bg-bitcoin md:block"></div>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bitcoin text-black text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold">Start Selling</h3>
              <p className="mt-2 text-sm text-gray-400">Receive orders, ship products, and get paid in Bitcoin.</p>
              {/* Connector line */}
              <div className="absolute left-0 top-6 hidden h-0.5 w-1/2 -translate-x-1/2 bg-bitcoin md:block"></div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/seller/create">
              <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium px-8 py-6 text-lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-900 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get answers to common questions about selling on Bit Merket.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 py-12">
            <div className="rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-medium">What can I sell on SatSoko?</h3>
              <p className="mt-2 text-sm text-gray-400">
                You can sell physical products, digital goods, services, and more. We welcome a wide range of products
                as long as they comply with our terms of service.
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-medium">How much does it cost to sell?</h3>
              <p className="mt-2 text-sm text-gray-400">
                We charge a flat 5% fee on each sale. There are no listing fees, monthly fees, or hidden charges.
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-medium">How do I get paid?</h3>
              <p className="mt-2 text-sm text-gray-400">
                Payments are made directly to your Lightning wallet. Once a buyer confirms receipt of their order, the
                funds are released from escrow to your wallet instantly.
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-medium">What if I don't have a Lightning wallet?</h3>
              <p className="mt-2 text-sm text-gray-400">
                We recommend several user-friendly Lightning wallets like Phoenix, Bitnob, or Breez. Check our guide in
                the Help section for detailed setup instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bitcoin py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-black sm:text-4xl">Ready to Start Selling?</h2>
              <p className="max-w-[900px] text-black/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the Bitcoin economy and start earning today.
              </p>
            </div>
            <Link href="/seller/create">
              <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg">
                Open Your Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
