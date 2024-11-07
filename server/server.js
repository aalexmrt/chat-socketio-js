import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chalk from "chalk";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set in the environment variables.");
}

const generativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  const { username } = socket.handshake.auth;

  socket.emit("message", chalk.rgb(5, 81, 120)(`${username} joined the chat`));

  socket.on("message", async (message) => {
    socket.emit("message", chalk.rgb(5, 81, 120)(`${username}: ${message}`));

    try {
      const result = await model.generateContent(message);
      const AITextResponse = await result.response.text();
      socket.emit("ai message", chalk.blue(`AI Response: ${AITextResponse}`));
    } catch (error) {
      console.error("Error generating AI content:", error);
      socket.emit("error", "Failed to generate AI response.");
    }
  });

  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(username, " disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
