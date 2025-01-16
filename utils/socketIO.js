import {
  SOCKET_CONNECTION_SUCCESS,
  SEND_NEW_MESSAGE,
  NEW_MESSAGE_RECEIVED,
  REQUEST_JOINED_TO_ROOM_SUCCESS
} from "./chatEventsConfig.js";

export const sendCocketConnectionSuccess = ({iOClient, socket, payload}) => {
  iOClient.to(socket.id).emit(SOCKET_CONNECTION_SUCCESS, {
    success: true,
    message: `You are connected to the socket server`,
    socketId: socket.id,
  });
};

export const recivedJoinedToRoom = ({iOClient, socket, payload}) => {
  const {sender, roomId } = payload;

  socket.join(roomId);
  iOClient.to(roomId).emit(REQUEST_JOINED_TO_ROOM_SUCCESS, {
    success: true,
    userId: sender,
    message: `${sender} has joined the chat room! ${roomId}`,
    socketId: socket.id,
    roomId,
  });
};

export const handleSendNewChatMessage = ({iOClient, socket, payload}) => {
  const { sender, receiver, roomId, message, date } = payload;
  iOClient.to(roomId).emit(NEW_MESSAGE_RECEIVED, {
    message,
    date,
    socketId: socket.id,
    sender,
    receiver
  });
};

export const handleDisconnect = ({iOClient, socket, payload}) => {
  console.log(`${socket.id} disconnected from server`, payload);
};
