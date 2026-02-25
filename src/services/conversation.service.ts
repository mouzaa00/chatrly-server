import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { conversationsTable } from "../db/schema";

export async function createConversation(
  creatorId: string,
  recipientId: string
) {
  const [conversation] = await db
    .insert(conversationsTable)
    .values({
      creatorId,
      recipientId,
    })
    .returning();

  return conversation;
}

export async function getExistingConversation(
  userId: string,
  friendId: string
) {
  const [existingConversation] = await db
    .select()
    .from(conversationsTable)
    .where(
      or(
        and(
          eq(conversationsTable.creatorId, userId),
          eq(conversationsTable.recipientId, friendId)
        ),
        and(
          eq(conversationsTable.creatorId, friendId),
          eq(conversationsTable.recipientId, userId)
        )
      )
    )
    .limit(1);

  return existingConversation;
}

export async function getConversations(userId: string) {
  return await db.query.conversationsTable.findMany({
    where: or(
      eq(conversationsTable.creatorId, userId),
      eq(conversationsTable.recipientId, userId)
    ),
    with: {
      recipient: {
        columns: {
          password: false,
        },
      },
      creator: {
        columns: {
          password: false,
        },
      },
    },
  });
}

export async function deleteConversation(conversationId: string) {
  await db
    .delete(conversationsTable)
    .where(eq(conversationsTable.id, conversationId));
}

export async function getConversation(conversationId: string) {
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, conversationId));

  return conversation;
}
