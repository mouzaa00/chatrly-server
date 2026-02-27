import { db } from "./db";
import {
  usersTable,
  tokensTable,
  friendRequestsTable,
  conversationsTable,
  messagesTable,
} from "./db/schema";
import bcrypt from "bcrypt";

interface User {
  id: string;
  name: string;
}

interface Conversation {
  id: string;
}

async function seed() {
  console.log("Cleaning database...");
  await db.delete(messagesTable);
  await db.delete(conversationsTable);
  await db.delete(friendRequestsTable);
  await db.delete(tokensTable);
  await db.delete(usersTable);
  console.log("Database cleaned.");

  console.log("Seeding database...");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const users = await db
    .insert(usersTable)
    .values([
      { name: "Alice", email: "alice@example.com", password: hashedPassword },
      { name: "Bob", email: "bob@example.com", password: hashedPassword },
      {
        name: "Charlie",
        email: "charlie@example.com",
        password: hashedPassword,
      },
      { name: "David", email: "david@example.com", password: hashedPassword },
      { name: "Eve", email: "eve@example.com", password: hashedPassword },
    ])
    .returning({ id: usersTable.id, name: usersTable.name });

  const alice = users[0] as User;
  const bob = users[1] as User;
  const charlie = users[2] as User;
  const david = users[3] as User;
  const eve = users[4] as User;

  console.log(
    "Created users:",
    alice.name,
    bob.name,
    charlie.name,
    david.name,
    eve.name
  );

  await db.insert(friendRequestsTable).values([
    { senderId: alice.id, receiverId: bob.id, status: "accepted" },
    { senderId: alice.id, receiverId: charlie.id, status: "accepted" },
    { senderId: bob.id, receiverId: charlie.id, status: "accepted" },
    { senderId: david.id, receiverId: alice.id, status: "pending" },
    { senderId: eve.id, receiverId: bob.id, status: "pending" },
  ]);

  console.log("Created friend requests");

  const conversations = await db
    .insert(conversationsTable)
    .values([
      { creatorId: alice.id, recipientId: bob.id },
      { creatorId: alice.id, recipientId: charlie.id },
      { creatorId: bob.id, recipientId: charlie.id },
    ])
    .returning({ id: conversationsTable.id });

  const conv1 = conversations[0] as Conversation;
  const conv2 = conversations[1] as Conversation;
  const conv3 = conversations[2] as Conversation;

  console.log("Created conversations");

  await db.insert(messagesTable).values([
    {
      content: "Hey Bob, how are you?",
      senderId: alice.id,
      conversationId: conv1.id,
    },
    {
      content: "I'm good Alice! How about you?",
      senderId: bob.id,
      conversationId: conv1.id,
    },
    {
      content: "Doing great! Want to grab coffee sometime?",
      senderId: alice.id,
      conversationId: conv1.id,
    },
    {
      content: "Sure, that sounds awesome!",
      senderId: bob.id,
      conversationId: conv1.id,
    },
    {
      content: "Hey Charlie, nice to meet you!",
      senderId: alice.id,
      conversationId: conv2.id,
    },
    {
      content: "Hi Alice! Nice to meet you too!",
      senderId: charlie.id,
      conversationId: conv2.id,
    },
    {
      content: "What have you been up to?",
      senderId: alice.id,
      conversationId: conv2.id,
    },
    {
      content: "Just working on some projects. You?",
      senderId: charlie.id,
      conversationId: conv2.id,
    },
    {
      content: "Hey Charlie, did you see the game yesterday?",
      senderId: bob.id,
      conversationId: conv3.id,
    },
    {
      content: "Yeah! It was intense!",
      senderId: charlie.id,
      conversationId: conv3.id,
    },
  ]);

  console.log("Created messages");
  console.log("Seeding completed!");
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
