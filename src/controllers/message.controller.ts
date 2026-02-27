import type { Request, Response, NextFunction } from "express";
import {
  CreateMessageBody,
  CreateMessageParams,
  DeleteMessageParams,
  GetMessagesParams,
} from "../schemas/message.schema";
import {
  createMessage,
  deleteMessage,
  getMessages,
} from "../services/message.service";

export async function createMessageHandler(
  req: Request<CreateMessageParams, {}, CreateMessageBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { content } = req.body;
    const { conversationId } = req.params;
    const userId = req.user!.id as string;

    const messageDetails = await createMessage(content, conversationId, userId);

    res.status(201).json({
      message: "Message created successfully",
      messageDetails,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessagesHandler(
  req: Request<GetMessagesParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { conversationId } = req.params;
    const messages = await getMessages(conversationId);
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
}
export async function deleteMessageHandler(
  req: Request<DeleteMessageParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { conversationId, messageId } = req.params;

    await deleteMessage(conversationId, messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
}
