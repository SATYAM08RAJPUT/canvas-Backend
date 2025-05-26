import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running for canvas app");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Broadcast drawing data
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  // Broadcast text data
  socket.on("text", (textData) => {
    socket.broadcast.emit("text", textData);
  });

  // Broadcast clear event
  socket.on("clear", () => {
    socket.broadcast.emit("clear");
  });

  // Broadcast cursor data
  socket.on("cursor", (data) => {
    socket.broadcast.emit("cursor", data);
  });

  // Broadcast pointer event
  socket.on("pointer", (data) => {
    io.emit("pointer", data);
  });

  // New event for shared text selection
  socket.on("sharedSelection", (selectionData) => {
    socket.broadcast.emit("sharedSelection", selectionData); // Broadcast the selected text to other users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = 7005;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
