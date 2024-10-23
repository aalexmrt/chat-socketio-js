import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chalk from "chalk";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const generativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  const { username } = socket.handshake.auth;
  socket.emit("message", `${chalk.rgb(5, 81, 120)(username)} joined`);
  socket.on("message", (message) => {
    socket.emit("message", `${chalk.rgb(5, 81, 120)(username)}: ${message}`);
    model.generateContent(message).then(async (result) => {
      const AITextResponse = await result.response.text();

      socket.emit(
        "ai message",
        `${chalk.blue("AI Response:")} ${AITextResponse}"`
      );
    });
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(username, " disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
