import httpServer from "./httpServer.js";
import { Server } from "socket.io";
import {
  SEND,
  CONNECTION,
  CONNECTED_TO_IO_SERVER,
  CONNECTED_TO_CHAT,
  DISCONNECTED_FROM_SERVER,
  USER_JOINED,
} from "../utils/chatEvents.js";

const iOClient = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_HOST_URL },
});

iOClient.on(CONNECTION, (socket) => {
  socket.emit(CONNECTED_TO_IO_SERVER, {
    success: true,
    message: `You are connected to the server`,
    socket: socket.id,
  });

  socket.on(CONNECTED_TO_CHAT, (payload) => {
    const { sender } = payload;
    iOClient.emit(USER_JOINED, {
      success: true,
      userId: sender
    });
  });

  socket.on("send-message", (payload) => {
    const { chatMsg, roomNum, name } = payload;

    iOClient.to(roomNum).emit("new-chat-message", {
      message: chatMsg,
      senderName: name,
      senderSocketId: socket.id,
      roomNum,
    });
  });

  socket.on(DISCONNECTED_FROM_SERVER, (payload) => {
    console.log(`${socket.id} disconnected from server`, payload);
  });
});

export default iOClient;
