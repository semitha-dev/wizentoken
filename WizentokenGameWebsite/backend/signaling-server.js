// signaling-server.js
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3001 });

let lobbies = {}; // lobbyId -> array of sockets

server.on("connection", (socket) => {
  socket.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "join") {
      if (!lobbies[data.lobbyId]) lobbies[data.lobbyId] = [];
      lobbies[data.lobbyId].push(socket);
      socket.lobbyId = data.lobbyId;
      console.log(`User joined lobby ${data.lobbyId}`);
    }

    // Relay messages to other peers in same lobby
    if (data.type === "signal") {
      const peers = lobbies[socket.lobbyId] || [];
      peers.forEach((peer) => {
        if (peer !== socket) {
          peer.send(JSON.stringify({ type: "signal", signal: data.signal }));
        }
      });
    }
  });

  socket.on("close", () => {
    if (socket.lobbyId) {
      lobbies[socket.lobbyId] = lobbies[socket.lobbyId].filter(
        (s) => s !== socket
      );
    }
  });
});

console.log("Signaling server running on ws://localhost:3001");
