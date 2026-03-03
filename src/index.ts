import app from "./server";
import dotenv from "dotenv";
import { connect } from "./db";
import { log } from "./logger";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket";

dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

initializeSocket(io);

const port = process.env.PORT || 1337;

httpServer.listen(port, async () => {
  log.info(`Server is listening at port ${port}`);
  await connect();
});
