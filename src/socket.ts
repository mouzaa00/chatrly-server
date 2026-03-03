import { Server, Socket } from "socket.io";
import { log } from "./logger";

export function initializeSocket(io: Server) {
  io.on("connection", (socket) => {
    log.info(`User connected: ${socket.id}`);

    socket.on("join conversation", (conversationId: string) => {
      if (!conversationId || typeof conversationId !== "string") {
        socket.emit("error", "Invalid conversation ID");
        return;
      }
      socket.join(conversationId);
      log.info(`User joined conversation: ${conversationId}`);
    });

    socket.on("leave conversation", (conversationId: string) => {
      if (!conversationId || typeof conversationId !== "string") {
        socket.emit("error", "Invalid conversation ID");
        return;
      }
      socket.leave(conversationId);
      log.info(`User left conversation: ${conversationId}`);
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
      log.info(`User disconnected: ${socket.id}`);
    });
  });
}
