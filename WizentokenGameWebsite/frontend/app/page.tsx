"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/app/components/Navbar"

// Discord OAuth settings
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!
const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  DISCORD_REDIRECT_URI
)}&response_type=token&scope=identify`;

// Dummy friends list for UI
const DUMMY_FRIENDS = [
  { id: "1", username: "FriendOne", discriminator: "1234" },
  { id: "2", username: "FriendTwo", discriminator: "5678" },
  { id: "3", username: "FriendThree", discriminator: "9012" }
];

export default function Home() {
  const [discordUser, setDiscordUser] = useState<any>(null);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    // Load stored user
    const stored = localStorage.getItem("discordUser");
    if (stored) setDiscordUser(JSON.parse(stored));

    // Handle OAuth2 redirect
    if (window.location.hash.includes("access_token")) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(res => res.json())
          .then(data => {
            setDiscordUser(data);
            localStorage.setItem("discordUser", JSON.stringify(data));
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch(console.error);
      }
    }
  }, []);

  const handleLogout = () => {
    setDiscordUser(null);
    localStorage.removeItem("discordUser");
    setShowFriends(false);
  };

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

          {!discordUser ? (
            <a
              href={DISCORD_AUTH_URL}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-full text-lg"
            >
              Connect with Discord
            </a>
          ) : (
            <div className="flex items-center space-x-4">
              <p className="text-green-400 font-semibold">
                {discordUser.username}#{discordUser.discriminator}
              </p>
              <button
                onClick={() => setShowFriends((prev) => !prev)}
                className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-full"
              >
                View
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </div>
          )}
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

      {/* Side Friends Panel */}
      {discordUser && showFriends && (
        <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-lg p-6 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Friends</h2>
          <ul className="space-y-3">
            {DUMMY_FRIENDS.map((f) => (
              <li
                key={f.id}
                className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
              >
                <span>
                  {f.username}#{f.discriminator}
                </span>
                <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full text-sm">
                  Invite
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="bg-gray-800 text-gray-200 mt-auto py-12">
        <div className="max-w-3xl mx-auto space-y-6 px-4">
          <h3 className="text-xl font-bold text-white">What is WZN Token?</h3>
          <p>
            WZN is the native token of our multiplayer gaming platform on Solana. You can stake WZN to enter game sessions, earn rewards, and drive in-game economies.
          </p>
        </div>
      </footer>
    </div>
  )
}
