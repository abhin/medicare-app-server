import http from "http";
import server from "../server.js";

const httpServer = http.createServer(server);
export default httpServer;
