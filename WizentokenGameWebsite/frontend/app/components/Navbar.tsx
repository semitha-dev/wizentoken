"use client"

import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Gamepad2 } from "lucide-react"
import { useEffect, useState } from "react"
import "@solana/wallet-adapter-react-ui/styles.css"

export default function Navbar() {
  const { publicKey, disconnect } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wizen 
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-purple-400 transition">
              Home
            </Link>
            <Link href="/how-to-play" className="text-gray-300 hover:text-purple-400 transition">
              How to Play
            </Link>
            <Link href="/access" className="text-gray-300 hover:text-purple-400 transition">
              Access
            </Link>
            <Link href="/leaderboard" className="text-gray-300 hover:text-purple-400 transition">
              LeaderBoard
            </Link>
            <Link href="/vote" className="text-gray-300 hover:text-purple-400 transition">
              Vote
            </Link>
             <Link href="/settings" className="text-gray-300 hover:text-purple-400 transition">
              My Stats
            </Link>
            <Link href="/tournament" className="text-gray-300 hover:text-purple-400 transition">
              tournament
            </Link>
          </div>

          {/* Wallet Connect/Disconnect */}
          <div className="flex items-center space-x-4">
            {mounted && publicKey ? (
              <button
                onClick={disconnect}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              >
                Disconnect
              </button>
            ) : (
              mounted && (
                <WalletMultiButton className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600" />
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
