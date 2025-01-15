import {
  SOCKET_CONNECTION_SUCCESS,
  SEND_NEW_MESSAGE,
  NEW_MESSAGE_RECEIVED,
} from "./chatEventsConfig.js";

export const sendCocketConnectionSuccess = ({iOClient, socket, payload}) => {
  iOClient.to(socket.id).emit(SOCKET_CONNECTION_SUCCESS, {
    success: true,
    message: `You are connected to the socket server`,
    socketId: socket.id,
  });
};

export const reciveJoinedToRoom = ({iOClient, socket, payload}) => {
  const {sender, roomId } = payload;
  socket.join(roomId);
  iOClient.to(roomId).emit(USER_JOINED, {
    success: true,
    userId: sender,
    socketId: socket.id,
    roomId,
  });

  iOClient.to(roomId).emit(NEW_MESSAGE_RECEIVED, {
    success: true,
    message: `<----------- Socket Id: ${socket.id} Sender : ${sender} has joined the chat! ----------->`,
    socketId: socket.id,
    roomId,
  });
};

export const handleNewMessage = ({iOClient, socket, payload}) => {
  const { message, roomId } = payload;
  console.log(SEND_NEW_MESSAGE, message);
  iOClient.to(roomId).emit(NEW_MESSAGE_RECEIVED, {
    message,
    socketId: socket.id,
  });
};

export const handleDisconnect = ({iOClient, socket, payload}) => {
  console.log(`${socket.id} disconnected from server`, payload);
};
