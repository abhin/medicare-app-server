import {
  SOCKET_CONNECTION_SUCCESS,
  ERROR_SENDING_NEW_MESSAGE,
  NEW_MESSAGE_RECEIVED,
  REQUEST_JOINED_TO_ROOM_SUCCESS,
} from "./chatEventsConfig.js";

import { create } from "../controllers/chat.js";

export const sendCocketConnectionSuccess = ({ iOClient, socket, payload }) => {
  iOClient.to(socket.id).emit(SOCKET_CONNECTION_SUCCESS, {
    success: true,
    message: `You are connected to the socket server`,
    socketId: socket.id,
  });
};

export const recivedJoinedToRoom = ({ iOClient, socket, payload }) => {
  const { sender, roomId } = payload;

  socket.join(roomId);
  iOClient.to(roomId).emit(REQUEST_JOINED_TO_ROOM_SUCCESS, {
    success: true,
    userId: sender,
    message: `${sender} has joined the chat room! ${roomId}`,
    socketId: socket.id,
    roomId,
  });
};

export const handleSendNewChatMessage = async ({
  iOClient,
  socket,
  payload,
}) => {
  const { sender, receiver, roomId, message, date, messageType, uniqueId } =
    payload;
  const result = await create({
    sender,
    receiver,
    roomId,
    message,
    date,
    messageType,
  });
  if (result.success) {
    iOClient.to(roomId).emit(NEW_MESSAGE_RECEIVED, {
      message,
      date,
      socketId: socket.id,
      sender,
      receiver,
    });
  } else {
    iOClient.to(roomId).emit(ERROR_SENDING_NEW_MESSAGE, {
      uniqueId,
      ...result,
      sender,
      socketId: socket.id,
    });
  }
};

export const handleDisconnect = ({ iOClient, socket, payload }) => {
  console.log(`${socket.id} disconnected from server`, payload);
};
