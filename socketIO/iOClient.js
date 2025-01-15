import httpServer from "./httpServer.js";
import { Server } from "socket.io";
import {
  CONNECTION,
  JOINED_TO_ROOM,
  DISCONNECTED_FROM_SERVER,
  SEND_NEW_MESSAGE,
} from "../utils/chatEventsConfig.js";
import { sendCocketConnectionSuccess,reciveJoinedToRoom, handleDisconnect, handleNewMessage} from "../utils/socketIO.js";

const iOClient = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_HOST_URL },
});

iOClient.on(CONNECTION, (socket) => {
  const serverData = {iOClient, socket};
  sendCocketConnectionSuccess({...serverData});

  socket.on(JOINED_TO_ROOM, (payload) => reciveJoinedToRoom({...serverData, payload}));
  socket.on(SEND_NEW_MESSAGE, (payload) => handleNewMessage({...serverData, payload}));
  socket.on(DISCONNECTED_FROM_SERVER, (payload) =>handleDisconnect({...serverData, payload}));
});

export default iOClient;
