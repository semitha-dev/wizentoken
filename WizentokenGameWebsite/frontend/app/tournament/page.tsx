// app/tournaments/page.tsx
"use client"

import React from "react"
import Navbar from "@/app/components/Navbar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

// Dummy tournament data
const tournaments = [
  {
    id: "t1",
    name: "WZN Classic Cup",
    entryCost: "10 WZN",
    players: 16,
    prizePool: "500 WZN",
    status: "current",
  },
  {
    id: "t2",
    name: "Summer Showdown",
    entryCost: "5 WZN",
    players: 32,
    prizePool: "300 WZN",
    status: "upcoming",
  },
  {
    id: "t3",
    name: "Pro League Finals",
    entryCost: "20 WZN",
    players: 8,
    prizePool: "1000 WZN",
    status: "upcoming",
  },
  {
    id: "t4",
    name: "WZN Invitational",
    entryCost: "15 WZN",
    players: 24,
    prizePool: "750 WZN",
    status: "past",
  },
]

type Status = "current" | "upcoming" | "past"

export default function TournamentsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center">🏆 Tournaments</h1>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="bg-gray-800 rounded-lg">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {(["current", "upcoming", "past"] as Status[]).map((status) => (
            <TabsContent key={status} value={status} className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments
                  .filter((t) => t.status === status)
                  .map((t) => (
                    <Card key={t.id} className="bg-gray-800">
                      <CardHeader>
                        <CardTitle>{t.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="font-semibold">Entry Cost:</span> {t.entryCost}
                        </div>
                        <div>
                          <span className="font-semibold">Players:</span> {t.players}
                        </div>
                        <div>
                          <span className="font-semibold">Prize Pool:</span> {t.prizePool}
                        </div>
                        <div className="text-right">
                          <Button>Join</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
