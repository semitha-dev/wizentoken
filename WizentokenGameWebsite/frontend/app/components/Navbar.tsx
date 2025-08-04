"use client"

import Link from "next/link"
import { Gamepad2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    const getUser = async () => {
      // Check if user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Fetch username from users table
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", session.user.id)
          .single()

        if (!error && data) {
          setUsername(data.username)
        }
      }
    }

    getUser()

    // Optional: listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

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
              Tournament
            </Link>
          </div>

          {/* Auth Buttons or Username */}
          <div className="flex items-center space-x-4">
            {mounted &&
              (username ? (
                <span className="px-4 py-2 bg-purple-600 text-white rounded-full">
                  {username}
                </span>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition"
                  >
                    Sign Up
                  </Link>
                </>
              ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
