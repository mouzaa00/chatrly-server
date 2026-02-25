import z from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    recipientId: z.string({
      required_error: "A recipientId is required",
    }),
  }),
});

export type CreateConversationBody = z.infer<
  typeof createConversationSchema.shape.body
>;

export const getAndDeleteConversationSchema = z.object({
  params: z.object({
    conversationId: z.string({
      required_error: "A conversationId is required",
    }),
  }),
});

export type GetAndDeleteConversationParams = z.infer<
  typeof getAndDeleteConversationSchema.shape.params
>;
