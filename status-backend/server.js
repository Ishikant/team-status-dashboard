const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let statusMap = {};

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("status-update", statusMap);

  socket.on("status-update", (update) => {
    statusMap = { ...statusMap, ...update };
    socket.broadcast.emit("status-update", update);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
