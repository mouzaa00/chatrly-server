import z from "zod";

export const createFriendRequestSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
  }),
});

export type CreateFriendRequestBody = z.infer<
  typeof createFriendRequestSchema.shape.body
>;

export const updateFriendRequestSchema = z.object({
  params: z.object({
    friendRequestId: z.string().uuid("Invalid friend request ID"),
  }),
  body: z.object({
    status: z.enum(["accepted", "rejected"], {
      required_error: "status is required",
      invalid_type_error: 'status must be either "accepted" or "rejected"',
    }),
  }),
});

export type UpdateFriendRequestBody = z.infer<
  typeof updateFriendRequestSchema.shape.body
>;

export type UpdateFriendRequestParams = z.infer<
  typeof updateFriendRequestSchema.shape.params
>;

export const getFriendRequestsSchema = z.object({
  query: z.object({
    type: z.enum(["received", "sent"], {
      required_error: "type query parameter is required",
      invalid_type_error: 'type must be either "received" or "sent"',
    }),
  }),
});

export type GetFriendRequestsQuery = z.infer<
  typeof getFriendRequestsSchema.shape.query
>;

export const deleteFriendRequestSchema = z.object({
  params: z.object({
    friendRequestId: z.string().uuid("Invalid friend request ID"),
  }),
});

export type DeleteFriendRequestParams = z.infer<
  typeof deleteFriendRequestSchema.shape.params
>;
