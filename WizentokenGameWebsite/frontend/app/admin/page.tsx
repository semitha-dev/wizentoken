// app/admin/dashboard/page.tsx
"use client"

import React from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8 space-y-12">
        {/* Proposal Submission */}
        <section>
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Submit a Proposal</CardTitle>
              <CardDescription >Draft and submit new DAO votes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proposal-title">Title</Label>
                  <Input
                    id="proposal-title"
                    placeholder="Enter proposal title"
                    className="mt-1 bg-gray-700 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="proposal-desc">Description</Label>
                  <Textarea
                    id="proposal-desc"
                    placeholder="Describe your proposal"
                    className="mt-1 bg-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="text-right">
                <Button>Submit Vote</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Proposal Tracking */}
        <section>
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Proposal Tracker</CardTitle>
              <CardDescription>View past, pending, and passed proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="bg-gray-700 rounded-lg">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="passed">Passed</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>

                {/* Pending Proposals */}
                <TabsContent value="pending" className="mt-4 space-y-4">
                  {[
                    { id: 1, title: "Increase Reward Pool", desc: "Boost rewards by 10%" },
                    { id: 2, title: "New Liquidity Module", desc: "Add concentrated liquidity feature" },
                  ].map((p) => (
                    <Card key={p.id} className="bg-gray-700">
                      <CardContent className="space-y-2">
                        <h3 className="text-lg font-semibold">{p.title}</h3>
                        <p className="text-gray-300">{p.desc}</p>
                        <div className="flex gap-2">
                          <Button size="sm">Vote Yes</Button>
                          <Button size="sm" variant="outline">Vote No</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Passed Proposals */}
                <TabsContent value="passed" className="mt-4 space-y-4">
                  {[
                    { id: 3, title: "Reduce Fees", result: "85% Yes" },
                  ].map((p) => (
                    <Card key={p.id} className="bg-gray-700">
                      <CardContent className="space-y-2">
                        <h3 className="text-lg font-semibold">{p.title}</h3>
                        <p className="text-green-400">Passed ({p.result})</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Past Proposals */}
                <TabsContent value="past" className="mt-4 space-y-4">
                  {[
                    { id: 4, title: "Init DAO", result: "100% Yes" },
                  ].map((p) => (
                    <Card key={p.id} className="bg-gray-700">
                      <CardContent className="space-y-2">
                        <h3 className="text-lg font-semibold">{p.title}</h3>
                        <p className="text-gray-400">Completed ({p.result})</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Vault Statistics */}
        <section>
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Vault Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="bg-gray-700">
                  <CardContent>
                    <p className="text-gray-400">Total Burned</p>
                    <p className="text-white text-2xl font-bold mt-1">1,234 WZN</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700">
                  <CardContent>
                    <p className="text-gray-400">Total Locked</p>
                    <p className="text-white text-2xl font-bold mt-1">4,567 WZN</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700">
                  <CardContent>
                    <p className="text-gray-400">% Eligible Re-entry</p>
                    <p className="text-white text-2xl font-bold mt-1">42%</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
