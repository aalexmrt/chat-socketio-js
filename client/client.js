import { io } from "socket.io-client";
import readline from "readline";
import chalk from "chalk";

// Function to initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">",
});

// Function to handle connections
function handleConnection(username) {
  const socket = io(process.env.SERVER_URL, {
    auth: {
      username: username,
    },
  });

  socket.on("connect", () => {
    console.log(`[INFO] Connected to server as ${username}`);
  });

  socket.on("message", (message) => console.log(message));
  socket.on("ai message", (message) => console.log(chalk.blue(message)));

  socket.on("disconnect", () => {
    console.log("[INFO] Disconnected from server.");
    process.exit(0); // Ensure process exits cleanly
  });

  socket.on("connect_error", (err) => {
    console.error(chalk.red(`Connection error: ${err.message}`));
  });

  rl.on("line", (input) => {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearScreenDown(process.stdout);
    socket.emit("message", input);
  });

  // Clean up on process exit
  rl.on("close", () => {
    console.log("Exiting chat.");
    socket.disconnect();
  });

  process.on("SIGINT", () => rl.close());
}

// Prompt for username and start connection
rl.question("Enter your username: ", (username) => {
  handleConnection(username);
  rl.prompt();
});
