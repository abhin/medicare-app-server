import httpServer from "./httpServer.js";
import { Server } from "socket.io";

const CONNECTION = "connection";
const CONNECTED = "connected";
const DISCONNECTED = "disconnect"

const iOClient = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_HOST_URL },
});

iOClient.on(CONNECTION, (socket) => {
  console.log("New IO connection established", socket.id);

  socket.emit(CONNECTED, {
    message: `You are connected to the server`,
    socket: socket.id,
  });

  socket.on(DISCONNECTED, (payload) => {
    console.log(`${socket.id} disconnected from server`, payload);
  });
});

export default iOClient;
