# Chat-JS Application

This is a chat application that supports both real-time messaging and AI-based responses using Google Generative AI through a Socket.IO connection. It consists of a server for handling connections and AI interactions, and a client for user interfacing.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Setup

1. **Clone the Repository:** Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/aalexmrt/chat-socketio-js.git
cd chat-js
```

2. **Install Dependencies:** Install the required dependencies from the root of the project using the following command:
```bash
npm install
```

3. **Configuration**

   - Copy the .env.example file in the chat-js root directory to .env.
   - Fill in the GEMINI_API_KEY with your Google Generative AI API key.

## Running the Application
1. Start the Server, run:
```bash
node --env-file .env server/server.js
```
2. Start the client, open another terminal and run:
```bash
node --env-file .env client/client.js
```
3. Interaction:
   - You will be prompted to enter your username on the client interface.
   - Once connected, you can send messages, and the server will respond with AI-generated content based on the input message.


## Features
   - Real-time chat messaging with Socket.IO.
   - AI-generated responses using Google Generative AI.
   - Commands and AI interactions logged with colored output using chalk.


## Notes
   - Ensure all necessary environment variables are configured correctly in the .env file.
   - The server and client must run concurrently in separate terminal sessions for full functionality.


## License
    This project is licensed under the MIT License.