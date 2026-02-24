import type { NextFunction, Request, Response } from "express";
import {
  createFriendRequest,
  deleteFriendRequest,
  getFriendRequests,
  updateFriendRequest,
} from "../services/friend-request.service";
import {
  CreateFriendRequestBody,
  DeleteFriendRequestParams,
  GetFriendRequestsQuery,
  UpdateFriendRequestBody,
  UpdateFriendRequestParams,
} from "../schemas/friend-request.schema";
import { getUserByEmail } from "../services/user.service";
import { NotFoundError } from "../errors";

export async function getFriendRequestsHanlder(
  req: Request<{}, {}, {}, GetFriendRequestsQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id as string;
    const { type } = req.query;

    const friendRequests = await getFriendRequests(userId, type);

    res.status(200).json({ friendRequests });
  } catch (error) {
    next(error);
  }
}

export async function createFriendRequestHandler(
  req: Request<{}, {}, CreateFriendRequestBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const senderId = req.user!.id as string;
    const { email } = req.body;

    const receiver = await getUserByEmail(email);
    if (!receiver) {
      throw new NotFoundError(`No user found with email: ${email}`);
    }

    const [friendRequest] = await createFriendRequest(senderId, receiver.id);

    res.status(201).json({ message: "Friend request sent!", friendRequest });
  } catch (error) {
    next(error);
  }
}

export async function updateFriendRequestHandler(
  req: Request<UpdateFriendRequestParams, {}, UpdateFriendRequestBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id as string;
    const { friendRequestId } = req.params;
    const { status } = req.body;

    const [friendRequest] = await updateFriendRequest(
      friendRequestId,
      userId,
      status
    );

    res.status(200).json({ message: "Friend request updated!", friendRequest });
  } catch (error) {
    next(error);
  }
}

export async function deleteFriendRequestHandler(
  req: Request<DeleteFriendRequestParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id as string;
    const { friendRequestId } = req.params;

    await deleteFriendRequest(userId, friendRequestId);

    res.status(200).json({ message: "Friend request deleted successfully!" });
  } catch (error) {
    next(error);
  }
}
