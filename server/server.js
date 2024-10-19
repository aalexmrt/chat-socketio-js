import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  const { username } = socket.handshake.auth;
  console.log(`${username} connected`);

  socket.on("message", (message) => {
    console.log(`${username}: ${message}`);
    io.emit("message", `$ ${username}: ${message}`);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(username, " disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
