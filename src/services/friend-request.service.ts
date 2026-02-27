import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { friendRequestsTable, usersTable } from "../db/schema";
import type { Status } from "../db/schema";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";

export async function getFriendRequests(
  userId: string,
  type: "sent" | "received"
) {
  return await db
    .select({
      id: friendRequestsTable.id,
      user: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(friendRequestsTable)
    .where(
      and(
        type === "received"
          ? eq(friendRequestsTable.receiverId, userId)
          : eq(friendRequestsTable.senderId, userId),
        eq(friendRequestsTable.status, "pending")
      )
    )
    .innerJoin(
      usersTable,
      type === "received"
        ? eq(usersTable.id, friendRequestsTable.senderId)
        : eq(usersTable.id, friendRequestsTable.receiverId)
    );
}

export async function createFriendRequest(
  senderId: string,
  receiverId: string
) {
  if (receiverId === senderId) {
    throw new BadRequestError("You can not send a friend request to yourself!");
  }

  const [existingRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(
      or(
        and(
          eq(friendRequestsTable.senderId, senderId),
          eq(friendRequestsTable.receiverId, receiverId)
        ),
        and(
          eq(friendRequestsTable.senderId, receiverId),
          eq(friendRequestsTable.receiverId, senderId)
        )
      )
    );

  if (existingRequest) {
    if (existingRequest.status === "pending") {
      throw new ConflictError(
        "A friend request already exists between these users"
      );
    }
    if (existingRequest.status === "accepted") {
      throw new ConflictError("You are already friends with this user");
    }
    if (existingRequest.status === "rejected") {
      // optionally allow resending after rejection
      throw new ConflictError("Your friend request was previously rejected");
    }
  }
  return await db
    .insert(friendRequestsTable)
    .values({ senderId, receiverId })
    .returning();
}

export async function updateFriendRequest(
  friendRequestId: string,
  userId: string,
  status: Status
) {
  const [friendRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(and(eq(friendRequestsTable.id, friendRequestId)));

  if (!friendRequest) {
    throw new NotFoundError("Friend request not found");
  }

  if (friendRequest.status !== "pending") {
    throw new BadRequestError("Only pending friend requests can be updated");
  }

  // Ensure that only the receiver can update the friend request status
  if (friendRequest.receiverId !== userId) {
    throw new UnauthorizedError(
      "only the receiver of the friend request can update its status"
    );
  }

  return await db
    .update(friendRequestsTable)
    .set({ status })
    .where(eq(friendRequestsTable.id, friendRequestId))
    .returning();
}

export async function deleteFriendRequest(
  friendRequestId: string,
  userId: string
) {
  const [friendRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(eq(friendRequestsTable.id, friendRequestId));

  if (!friendRequest) {
    throw new NotFoundError("Friend request not found");
  }

  // Ensure that only the sender can delete the friend request
  if (friendRequest.senderId !== userId) {
    throw new UnauthorizedError(
      "Only the sender of the friend request can cancel it"
    );
  }

  await db
    .delete(friendRequestsTable)
    .where(eq(friendRequestsTable.id, friendRequestId));
}

export async function deleteFriend(userId: string, friendId: string) {
  await db
    .delete(friendRequestsTable)
    .where(
      or(
        and(
          eq(friendRequestsTable.senderId, userId),
          eq(friendRequestsTable.receiverId, friendId)
        ),
        and(
          eq(friendRequestsTable.senderId, friendId),
          eq(friendRequestsTable.receiverId, userId)
        )
      )
    );
}
