import httpServer from "./httpServer.js";
import { Server } from "socket.io";
import {
  NEW_MESSAGE,
  CONNECTION,
  CONNECTED_TO_IO_SERVER,
  CONNECTED_TO_CHAT,
  DISCONNECTED_FROM_SERVER,
  USER_JOINED,
  SEND_NEW_MESSAGE,
} from "../utils/chatEvents.js";

const iOClient = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_HOST_URL },
});

iOClient.on(CONNECTION, (socket) => {
  const socketId = socket.id;

  socket.emit(CONNECTED_TO_IO_SERVER, {
    success: true,
    message: `You are connected to the server`,
    socketId,
  });

  socket.on(CONNECTED_TO_CHAT, (payload) => {
    const { sender, roomId } = payload;
    iOClient.emit(USER_JOINED, {
      success: true,
      userId: sender,
      socketId,
    });

    socket.join(roomId);
    iOClient.to(roomId).emit(NEW_MESSAGE, {
      success: true,
      message: `<----------- ${sender} has joined the chat! ----------->`,
      socketId,
    });
  });

  socket.on(SEND_NEW_MESSAGE, (payload) => {
    const { receiver, message, roomId } = payload;
    console.log(SEND_NEW_MESSAGE, message);
    iOClient.to(roomId).emit(NEW_MESSAGE, {
      message,
      socketId,
    });
  });

  socket.on(DISCONNECTED_FROM_SERVER, (payload) => {
    console.log(`${socket.id} disconnected from server`, payload);
  });
});

export default iOClient;
