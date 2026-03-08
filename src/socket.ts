import { Server, Socket } from "socket.io";
import { log } from "./logger";
import { parse } from "cookie";
import { verifyJwt } from "./utils";

export function initializeSocket(io: Server) {
  io.use(async (socket: Socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("AUTH_EXPIRED"));
    }

    const cookies = parse(cookieHeader);
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      return next(new Error("AUTH_EXPIRED"));
    }

    try {
      const { payload } = await verifyJwt(accessToken);
      socket.data.user = payload; // store user info in socket data for later use
      next();
    } catch {
      return next(new Error("AUTH_EXPIRED"));
    }
  });

  io.on("connection", (socket) => {
    log.info(`User connected: ${socket.data.user.id}`);

    socket.on("join conversation", (conversationId: string) => {
      if (!conversationId || typeof conversationId !== "string") {
        socket.emit("error", "Invalid conversation ID");
        return;
      }
      socket.join(conversationId);
      log.info(
        `User ${socket.data.user.id} joined conversation: ${conversationId}`
      );
    });

    socket.on("leave conversation", (conversationId: string) => {
      if (!conversationId || typeof conversationId !== "string") {
        socket.emit("error", "Invalid conversation ID");
        return;
      }
      socket.leave(conversationId);
      log.info(
        `User ${socket.data.user.id} left conversation: ${conversationId}`
      );
    });

    socket.on(
      "chat message",
      (msg: { conversationId: string; content: string }) => {
        if (!msg?.conversationId || !msg?.content) {
          socket.emit("error", "Invalid message format");
          return;
        }

        socket.to(msg.conversationId).emit("chat message", msg);
      }
    );

    socket.on("error", (err) => {
      log.error(`Socket error: ${err.message}`);
    });

    socket.on("disconnect", () => {
      log.info(`User ${socket.data.user.id} disconnected: ${socket.id}`);
    });
  });
}
