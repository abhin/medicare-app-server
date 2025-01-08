import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ROUTE_BASE } from "./utils/config.js";
import userRouter from "./routers/user.js";
import authRouter from "./routers/auth.js"

dotenv.config();
const server = express();
server.use(bodyParser.json());
server.use(cors({ orgin: process.env.CLIENT_HOST_URL }));
server.use(`${ROUTE_BASE}/user`, userRouter);
server.use(`${ROUTE_BASE}/auth`, authRouter);

server.get([`${ROUTE_BASE}/healthcheck`, `${ROUTE_BASE}/check`], (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server health is good",
  });
});
export default server;
