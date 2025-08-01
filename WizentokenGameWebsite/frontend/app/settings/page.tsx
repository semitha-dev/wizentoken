// app/profile/page.tsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import Navbar from "@/app/components/Navbar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit2, Camera, Copy } from "lucide-react"

export default function PlayerProfilePage() {
  const [displayName, setDisplayName] = useState("Anonymous")
  const [editing, setEditing] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the name input when entering edit mode
  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  // Properly typed event handler to fix the TS7006 error
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-8 py-10 space-y-10">
        {/* Profile Card */}
        <Card className="bg-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white">Player Profile</CardTitle>
            <CardDescription>Manage your gaming profile and stats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar & Name */}
            <div className="flex items-center space-x-8">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {avatar ? (
                    <AvatarImage src={avatar} alt="User avatar" />
                  ) : (
                    <AvatarFallback className="bg-gray-700 text-lg">
                      {displayName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -bottom-1 -right-1 bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarChange}
                  />
                </Button>
              </div>

              <div className="flex-1">
                {editing ? (
                  <Input
                    ref={inputRef}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
                    className="bg-[#2A2A2A] border-gray-600 text-white rounded-lg h-10"
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <span className="text-white text-xl">{displayName}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => setEditing(true)}
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Current Rank", value: "#3" },
            { label: "Win Rate", value: "73.2%" },
            { label: "Total Matches", value: "30" },
            { label: "Access Status", value: "✅ Verified" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[#1A1A1A]">
              <CardContent>
                <Label className="text-gray-400 text-sm">{stat.label}</Label>
                <p className="text-white text-xl font-semibold mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Account Details */}
        <Card className="bg-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Address */}
              <div>
                <Label className="text-gray-400 text-sm">Wallet Address</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex-1 bg-[#2A2A2A] border border-gray-600 rounded-lg px-3 py-2">
                    <span className="text-white font-mono text-sm">3b7X...9KpQ</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-700">
                    <Copy className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <Label className="text-gray-400 text-sm">Account Status</Label>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex-1 bg-[#2A2A2A] border border-gray-600 rounded-lg px-3 py-2">
                    <span className="text-green-400 text-sm">✅ Verified</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 whitespace-nowrap"
                  >
                    Request Upgrade
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
