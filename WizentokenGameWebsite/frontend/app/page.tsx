"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/app/components/Navbar"
import { supabase } from "@/lib/supabaseClient"

export default function Home() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)

  // load Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleClick = () => {
    if (session) {
      router.push("/select-mode")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-blue-950 text-white flex flex-col">
      <Navbar />

      <section className="bg-gray-800 md:rounded-xl mx-auto mt-6 max-w-6xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-extrabold">
            Dive into the world of crypto gaming!
          </h1>
          <p className="text-lg text-gray-300">
            Stake your WZN tokens, join multiplayer rounds, and win big!
          </p>

          <button
            onClick={handleClick}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-full text-lg"
          >
            {session ? "Play" : "Login to play"}
          </button>
        </div>

        <div className="flex-1">
          <Image
            src="/assets/hero.png"
            alt="Crypto gaming illustration"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-200 mt-auto py-12">
        <div className="max-w-3xl mx-auto space-y-6 px-4">
          <h3 className="text-xl font-bold text-white">What is WZN Token?</h3>
          <p>
            WZN is the native token of our multiplayer gaming platform on Solana.
            You can stake WZN to enter game sessions, earn rewards, and drive
            in-game economies.
          </p>
        </div>
      </footer>
    </div>
  )
}
