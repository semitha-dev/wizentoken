// app/sign-up/page.tsx
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"

export default function SignUpPage() {
  const router = useRouter()
  const { publicKey, disconnect } = useWallet()
  const walletAddress = publicKey?.toBase58() || null

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Ensure wallet UI resets error when user connects
  useEffect(() => {
    if (walletAddress) setError(null)
  }, [walletAddress])

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      setError("All fields are required")
      return
    }
    if (!walletAddress) {
      setError("🔒 You must connect your wallet to sign up")
      return
    }

    setLoading(true)
    setError(null)

    // 1. Create Supabase Auth account (sends confirmation email)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // 2. Insert into custom users table
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: data.user!.id,
        username,
        wallet: walletAddress,
      },
    ])

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    // show confirmation step
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Almost there!</h1>
          <p className="mb-6">
            A confirmation email has been sent to <strong>{email}</strong>.
            Please check your inbox (and spam) and then{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              log in here
            </span>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />

          {/* Wallet Section */}
          <div className="text-center">
            {walletAddress ? (
              <div className="space-y-2">
                <p className="text-green-400 text-sm">
                  ✅ Wallet connected:{" "}
                  {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
                </p>
                <button
                  onClick={disconnect}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div>
                <p className="text-yellow-400 text-sm mb-2">
                  🔒 Wallet connection is required
                </p>
                <WalletMultiButton className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg px-4 py-2" />
              </div>
            )}
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}
