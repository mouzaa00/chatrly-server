import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { friendRequestsTable, usersTable } from "../db/schema";
import { NotFoundError } from "../errors";

export async function getFriends(userId: string) {
  const friends = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(friendRequestsTable)
    .where(
      and(
        eq(friendRequestsTable.status, "accepted"),
        or(
          eq(friendRequestsTable.senderId, userId),
          eq(friendRequestsTable.receiverId, userId)
        )
      )
    )
    .innerJoin(
      usersTable,
      or(
        eq(friendRequestsTable.senderId, usersTable.id),
        eq(friendRequestsTable.receiverId, usersTable.id)
      )
    );

  return friends.filter((friend) => friend.id !== userId);
}

export async function deleteFriend(userId: string, friendId: string) {
  const [existingFriendRequest] = await db
    .select()
    .from(friendRequestsTable)
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

  if (!existingFriendRequest) {
    throw new NotFoundError("Friend request not found!");
  }
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
