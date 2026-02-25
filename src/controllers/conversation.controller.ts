import type { Request, Response, NextFunction } from "express";
import {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  getExistingConversation,
} from "../services/conversation.service";
import {
  CreateConversationBody,
  GetAndDeleteConversationParams,
} from "../schemas/conversation.schema";
import { ConflictError } from "../errors";
import { nextTick } from "process";

export async function createConversationHandler(
  req: Request<{}, {}, CreateConversationBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const creatorId = req.user!.id as string;
    const recipientId = req.body.recipientId;

    const existingConversation = await getExistingConversation(
      creatorId,
      recipientId
    );
    if (existingConversation) {
      throw new ConflictError(
        "A conversation between these users already exists"
      );
    }

    const conversation = await createConversation(creatorId, recipientId);

    res
      .status(201)
      .json({ message: "Conversation created successfully", conversation });
  } catch (error) {
    next(error);
  }
}

export async function getConversationsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id as string;
    const conversations = await getConversations(userId);

    res.status(200).json({ conversations });
  } catch (error) {
    next(error);
  }
}

export async function deleteConversationHandler(
  req: Request<GetAndDeleteConversationParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { conversationId } = req.params;
    await deleteConversation(conversationId);

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getConversationHandler(
  req: Request<GetAndDeleteConversationParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { conversationId } = req.params;

    const conversation = await getConversation(conversationId);

    res.status(200).json({ conversation });
  } catch (error) {
    next(error);
  }
}
