ALTER TABLE "friend_Requests" RENAME COLUMN "recipient_id" TO "receiver_id";--> statement-breakpoint
ALTER TABLE "friend_Requests" DROP CONSTRAINT "friend_Requests_recipient_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friend_Requests" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "friend_Requests" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "friend_Requests" ADD CONSTRAINT "friend_Requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_Requests" ADD CONSTRAINT "friend_Requests_receiver_id_sender_id_unique" UNIQUE("receiver_id","sender_id");