// app/access/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import Navbar from "@/app/components/Navbar"

export default function AccessPage() {
  const STORAGE_KEY = "wzn_access_pass"
  const [hasAccess, setHasAccess] = useState(false)
  const [expiry, setExpiry] = useState<Date | null>(null)

  // Compute end of this month
  const computeExpiry = useCallback(() => {
    const now = new Date()
    // month is zero-based
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return lastDay
  }, [])

  // Load access state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const ts = parseInt(stored, 10)
      const burned = new Date(ts)
      const now = new Date()
      const expiryDate = computeExpiry()
      // valid if same month/year and burned before expiry
      if (
        burned.getFullYear() === now.getFullYear() &&
        burned.getMonth() === now.getMonth() &&
        burned.getTime() <= expiryDate.getTime()
      ) {
        setHasAccess(true)
        setExpiry(expiryDate)
      } else {
        // expired or old
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [computeExpiry])

  // Mock burn function
  const burnAccessPass = () => {
    const now = Date.now()
    localStorage.setItem(STORAGE_KEY, now.toString())
    const expiryDate = computeExpiry()
    setHasAccess(true)
    setExpiry(expiryDate)
  }

  // Format expiry date e.g. July 31, 2025
  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <main className="max-w-md mx-auto mt-12 p-6 bg-gray-800 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Monthly Access Pass
        </h1>

        <p className="text-center">
          Burn <span className="font-semibold">500 WZN</span> to unlock games
          for the rest of this month.
        </p>

        <div className="text-center">
          {hasAccess ? (
            <div className="text-green-400 font-medium">
              ✅ You have access until {expiry && formatDate(expiry)}
            </div>
          ) : (
            <div className="text-red-400 font-medium">
              ❌ No active access – please burn pass
            </div>
          )}
        </div>

        <button
          onClick={burnAccessPass}
          disabled={hasAccess}
          className={`w-full py-3 rounded-full text-lg font-semibold transition ${
            hasAccess
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {hasAccess ? "Access Active" : "Burn 500 WZN"}
        </button>
      </main>
    </div>
  )
}
