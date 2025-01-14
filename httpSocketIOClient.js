import httpSocketIOServer from "./httpSocketIOServer";

const io = new Server(httpSocketIOServer, {
    cors: { origin: process.env.CLIENT_HOST_URL },
});

io.on("connection", (socket) => {
    console.log("New IO connection established", socket.id);

    socket.emit("connected", {
      message: `You are connected to the server`,
      socket: socket.id,
    });

    socket.on("disconnect", (payload) => {
      console.log(`${socket.id} disconnected from server`, payload);
    });
});