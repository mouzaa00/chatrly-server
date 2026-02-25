import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { messagesTable, usersTable } from "../db/schema";

export async function createMessage(
  content: string,
  conversationId: string,
  senderId: string
) {
  const [message] = await db
    .insert(messagesTable)
    .values({
      content,
      conversationId,
      senderId,
    })
    .returning();

  return message;
}

export async function getMessages(conversationId: string) {
  const messages = await db
    .select({
      id: messagesTable.id,
      content: messagesTable.content,
      createdAt: messagesTable.createdAt,
      updatedAt: messagesTable.updatedAt,
      sender: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .innerJoin(usersTable, eq(messagesTable.senderId, usersTable.id));

  return messages;
}

export async function deleteMessage(conversationId: string, messageId: string) {
  await db
    .delete(messagesTable)
    .where(
      and(
        eq(messagesTable.id, messageId),
        eq(messagesTable.conversationId, conversationId)
      )
    );
}
