import http from "http";
import server from "./server.js";
import {Server} from "socket.io";

const httpSocketIOServer = http.createServer(server);
export default httpSocketIOServer;
