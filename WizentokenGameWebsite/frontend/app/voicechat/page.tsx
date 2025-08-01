"use client"

import { useState, useEffect, useRef } from "react"
import Peer from "simple-peer"

interface User {
  id: string
  stream?: MediaStream
  speaking?: boolean
}

export default function VoiceChat() {
  const [lobbyId, setLobbyId] = useState("")
  const [joined, setJoined] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const audioRefs = useRef<{ [id: string]: HTMLAudioElement | null }>({})

  useEffect(() => {
    if (!joined) return
    const ws = new WebSocket("ws://localhost:3001")
    setSocket(ws)

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", lobbyId }))
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)

      if (data.type === "signal") {
        peer.signal(data.signal)
      }
    }

    let peer: Peer.Instance
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      peer = new Peer({ initiator: isCreator, trickle: false, stream })

      // Send signals
      peer.on("signal", (signal) => {
        ws.send(JSON.stringify({ type: "signal", signal }))
      })

      // Receive remote streams
      peer.on("stream", (remoteStream) => {
        const id = "remote"
        setUsers((prev) => {
          if (!prev.find((u) => u.id === id)) {
            return [...prev, { id, stream: remoteStream }]
          }
          return prev
        })
      })

      // Add local user
      setUsers([{ id: "local", stream }])
      detectSpeaking("local", stream)
    })

    return () => {
      ws.close()
      peer?.destroy()
    }
  }, [joined, lobbyId, isCreator])

  // Detect if a user is speaking
  const detectSpeaking = (userId: string, stream: MediaStream) => {
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    source.connect(analyser)

    const checkSpeaking = () => {
      analyser.getByteFrequencyData(dataArray)
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, speaking: volume > 10 } : u
        )
      )
      requestAnimationFrame(checkSpeaking)
    }

    checkSpeaking()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {!joined ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Lobby ID"
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
            className="px-4 py-2 rounded text-black"
          />
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsCreator(true)
                setJoined(true)
              }}
              className="bg-green-600 px-6 py-3 rounded"
            >
              Create Lobby
            </button>
            <button
              onClick={() => {
                setIsCreator(false)
                setJoined(true)
              }}
              className="bg-indigo-600 px-6 py-3 rounded"
            >
              Join Lobby
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">
            Lobby: {lobbyId}
          </h1>
          <p className="mt-2 text-green-400 text-center">
            Voice chat active!
          </p>

          {/* User boxes */}
          <div className="grid grid-cols-2 gap-4">
            {users.map((user, idx) => (
              <div
                key={user.id}
                className={`p-4 rounded-xl text-center ${
                  user.speaking ? "bg-green-600" : "bg-gray-700"
                }`}
              >
                User {idx + 1}
                <audio
                  ref={(el) => {
                    audioRefs.current[user.id] = el
                    if (el && user.stream) {
                      el.srcObject = user.stream
                      el.play().catch(() => {})
                    }
                  }}
                  autoPlay
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
