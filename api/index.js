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
app.use(cors());
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
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Server connected to socket.io");
  // create ne room wit user_id
  socket.on("setup", (userdata) => {
    console.log(userdata._id);
    socket.join(userdata._id);
    socket.emit("connected");
  });

  // join chat
  socket.on("joinchat", (roomid) => {
    // console.log(roomid);
    socket.join(roomid);
    socket.emit("joinedchat");
  });

  // sendMessage
  socket.on("newmessage", (newmassageReceived) => {
    const chats = newmassageReceived.chat;
    // console.log(chats);
    if (!chats) return console.log("chats is undeifned");

    chats.users.forEach((user) => {
      if (newmassageReceived.sender._id === user) return;

      socket.in(user).emit("messagereceived", newmassageReceived);
    });
  });
});
