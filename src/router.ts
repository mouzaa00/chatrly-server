import { Router } from "express";
import { validateRequest } from "./middleware/validateRequest";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "./controllers/auth.controller";
import { loginSchema, registerSchema } from "./schemas/auth.schema";
import { authenticateToken } from "./middleware/authenticateToken";
import { getUserProfile } from "./controllers/user.controller";
import {
  createConversationSchema,
  getAndDeleteConversationSchema,
} from "./schemas/conversation.schema";
import {
  createConversationHandler,
  deleteConversationHandler,
  getConversationHandler,
  getConversationsHandler,
} from "./controllers/conversation.controller";
import {
  createFriendRequestHandler,
  getFriendRequestsHanlder,
  updateFriendRequestHandler,
} from "./controllers/friend-request.controller";
import {
  updateFriendRequestSchema,
  createFriendRequestSchema,
  getFriendRequestsSchema,
} from "./schemas/friend-request.schema";
import { deleteFriendSchema } from "./schemas/friend.schema";
import {
  deleteFriendHandler,
  getFriendsHandler,
} from "./controllers/friend.controller";
import {
  createMessageSchema,
  deleteMessageSchema,
  getMessagesSchema,
} from "./schemas/message.schema";
import {
  createMessageHandler,
  deleteMessageHandler,
  getMessagesHandler,
} from "./controllers/message.controller";

const router = Router();

/**
 * Authentication resource
 */
router.post("/auth/register", validateRequest(registerSchema), registerHandler);
router.post("/auth/login", validateRequest(loginSchema), loginHandler);
router.post("/auth/logout", authenticateToken, logoutHandler);
router.post("/auth/refresh", refreshHandler);

/**
 *  Users resource
 */
router.get("/users/me", authenticateToken, getUserProfile);

/**
 * Friend requests routes
 */
router.get(
  "/friend-requests",
  authenticateToken,
  validateRequest(getFriendRequestsSchema),
  getFriendRequestsHanlder
);
router.post(
  "/friend-requests",
  authenticateToken,
  validateRequest(createFriendRequestSchema),
  createFriendRequestHandler
);
router.patch(
  "/friend-requests/:friendRequestId",
  authenticateToken,
  validateRequest(updateFriendRequestSchema),
  updateFriendRequestHandler
);

/**
 * Friend requests routes
 */
router.get("/friends", authenticateToken, getFriendsHandler);
router.delete(
  "/friends/:friendId",
  authenticateToken,
  validateRequest(deleteFriendSchema),
  deleteFriendHandler
);

/**
 * Conversations routes
 */
router.get("/conversations", authenticateToken, getConversationsHandler);
router.post(
  "/conversations",
  authenticateToken,
  validateRequest(createConversationSchema),
  createConversationHandler
);
router.get(
  "/conversations/:conversationId",
  authenticateToken,
  validateRequest(getAndDeleteConversationSchema),
  getConversationHandler
);
router.delete(
  "/conversations/:conversationId",
  authenticateToken,
  validateRequest(getAndDeleteConversationSchema),
  deleteConversationHandler
);

/**
 * Messages routes
 */
router.get(
  "/conversations/:conversationId/messages",
  authenticateToken,
  validateRequest(getMessagesSchema),
  getMessagesHandler
);
router.post(
  "/conversations/:conversationId/messages",
  authenticateToken,
  validateRequest(createMessageSchema),
  createMessageHandler
);
router.delete(
  "/conversations/:conversationId/messages/:messageId",
  authenticateToken,
  validateRequest(deleteMessageSchema),
  deleteMessageHandler
);

export default router;
