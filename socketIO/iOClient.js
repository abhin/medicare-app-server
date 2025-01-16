import httpServer from "./httpServer.js";
import { Server } from "socket.io";
import {
  CONNECTION,
  JOINED_TO_ROOM_REQUEST,
  DISCONNECTED_FROM_SERVER,
  SEND_NEW_MESSAGE,
} from "../utils/chatEventsConfig.js";
import {
  sendCocketConnectionSuccess,
  recivedJoinedToRoom,
  handleDisconnect,
  handleSendNewChatMessage,
} from "../utils/socketIO.js";

const iOClient = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_HOST_URL },
});

iOClient.on(CONNECTION, (socket) => {
  const serverData = { iOClient, socket };
  sendCocketConnectionSuccess({ ...serverData });

  socket.on(JOINED_TO_ROOM_REQUEST, (payload) =>
    recivedJoinedToRoom({ ...serverData, payload })
  );
  socket.on(SEND_NEW_MESSAGE, (payload) =>
    handleSendNewChatMessage({ ...serverData, payload })
  );
  socket.on(DISCONNECTED_FROM_SERVER, (payload) =>
    handleDisconnect({ ...serverData, payload })
  );
});

export default iOClient;
