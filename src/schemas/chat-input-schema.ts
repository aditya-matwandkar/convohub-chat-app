import { z } from "zod";

export const ChatInputSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Message should be at least 1 characters." }),
});

export const MessageFileSchema = z.object({
  fileURL: z.string().min(1, { message: "Attachment is required." }),
});
