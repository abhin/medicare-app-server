import httpServer from "./httpServer.js";
import { Server } from "socket.io";

const iOClient = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_HOST_URL },
});

iOClient.on("connection", (socket) => {
  console.log("New IO connection established", socket.id);

  socket.emit("connected", {
    message: `You are connected to the server`,
    socket: socket.id,
  });

  socket.on("disconnect", (payload) => {
    console.log(`${socket.id} disconnected from server`, payload);
  });
});

export default iOClient;
