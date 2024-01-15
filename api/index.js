import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./utils/db.js";
import AuthRoute from "./Routes/Auth.js";
import ChatsRoute from "./Routes/chats.js";
import messagesRoute from "./Routes/Messages.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();
// middlwares
app.use(cors({ origin: "*" }));
app.use(express.json());

// endpoints
app.use("/auth", AuthRoute);
app.use("/chats", ChatsRoute);
app.use("/messages", messagesRoute);

app.use((err, req, resp, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";

  return resp.status(status).json({
    success: false,
    status: status,
    message: message,
    stack: err.stack,
  });
});

const server = app.listen(process.env.PORT, async () => {
  console.log("Connected to port " + process.env.PORT);

  await connect();
});

// socket io connection

const io = new Server(server, {
  pingTimeout: 60000,
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader);
  },
});

io.on("connection", (socket) => {
  console.log("Server connected to socket.io");
});
