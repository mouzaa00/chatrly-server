import type { NextFunction, Request, Response } from "express";
import { deleteFriend, getFriends } from "../services/friend.service";
import { DeleteFriendParams } from "../schemas/friend.schema";

export async function deleteFriendHandler(
  req: Request<DeleteFriendParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { friendId } = req.params;
    const userId = req.user!.id as string;

    await deleteFriend(userId, friendId);

    res.json({ message: "Friend deleted successfully!" });
  } catch (error) {
    next(error);
  }
}

export async function getFriendsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id as string;
    const friends = await getFriends(userId);

    res.status(200).json({ friends });
  } catch (error) {
    next(error);
  }
}
