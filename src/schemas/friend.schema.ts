import z from "zod";

export const deleteFriendSchema = z.object({
  params: z.object({
    friendId: z.string().uuid("Invalid friend ID"),
  }),
});

export type DeleteFriendParams = z.infer<
  typeof deleteFriendSchema.shape.params
>;
