import Link from "next/link"
import Image from "next/image"
import { Bitcoin, Globe, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About BitMarket</h1>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          The global marketplace powered by Bitcoin and the Lightning Network.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-400 mb-4">
            BitMarket was founded with a simple mission: to create a truly global marketplace where anyone can buy and
            sell without borders, gatekeepers, or excessive fees.
          </p>
          <p className="text-gray-400 mb-4">
            By leveraging Bitcoin and the Lightning Network, we've built a platform that enables instant, low-fee
            transactions between buyers and sellers worldwide, regardless of their location or access to traditional
            banking.
          </p>
          <p className="text-gray-400">
            We believe in the power of peer-to-peer commerce and the freedom that comes with Bitcoin. Our goal is to
            empower entrepreneurs, creators, and consumers to participate in the global economy on their own terms.
          </p>
        </div>
        {/* <div className="flex justify-center">
          <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="BitMarket mission illustration"
              fill
              className="object-contain"
              />
          </div>
        </div> */}
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10 mb-4">
              <Globe className="h-8 w-8 text-bitcoin" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Access</h3>
            <p className="text-gray-400">
              We believe commerce should be accessible to everyone, regardless of location, nationality, or banking
              status.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10 mb-4">
              <Bitcoin className="h-8 w-8 text-bitcoin" />
            </div>
            <h3 className="text-xl font-bold mb-2">Financial Freedom</h3>
            <p className="text-gray-400">
              Bitcoin enables true ownership of money and the freedom to transact without permission or surveillance.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10 mb-4">
              <Shield className="h-8 w-8 text-bitcoin" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trust & Security</h3>
            <p className="text-gray-400">
              Our escrow system and review mechanisms create a trustworthy environment for buyers and sellers.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/10 mb-4">
              <Zap className="h-8 w-8 text-bitcoin" />
            </div>
            <h3 className="text-xl font-bold mb-2">Innovation</h3>
            <p className="text-gray-400">
              We embrace cutting-edge technology like the Lightning Network to create better commerce experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center"> */}
            {/* <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4">
              <Image src="/placeholder.svg?height=128&width=128" alt="Team member" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Alex Satoshi</h3>
            <p className="text-bitcoin mb-2">Founder & CEO</p>
            <p className="text-gray-400 text-sm">
              Bitcoin enthusiast and entrepreneur with a background in e-commerce and fintech.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4">
              <Image src="/placeholder.svg?height=128&width=128" alt="Team member" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Maria Lightning</h3>
            <p className="text-bitcoin mb-2">CTO</p>
            <p className="text-gray-400 text-sm">
              Lightning Network developer and open-source contributor with expertise in Bitcoin infrastructure.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4">
              <Image src="/placeholder.svg?height=128&width=128" alt="Team member" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">David Block</h3>
            <p className="text-bitcoin mb-2">Head of Operations</p>
            <p className="text-gray-400 text-sm">
              Experienced in marketplace operations and community building for decentralized platforms.
            </p>
          </div>
        </div> */}
      {/* Join Us Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Join the BitMarket Community</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Whether you're a buyer looking for unique products or a seller wanting to reach a global audience, BitMarket
          is the place for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black font-medium">Create an Account</Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">Contact Us</h2>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
          <p className="text-center text-gray-400 mb-6">
            Have questions or feedback? We'd love to hear from you. Reach out to our team at:
          </p>
          <div className="text-center">
            <p className="text-bitcoin font-medium mb-2">support@bitmerket.com</p>
            <p className="text-gray-400">We typically respond within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>

  );
}
