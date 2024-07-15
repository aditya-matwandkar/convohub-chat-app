import { z } from "zod";
import { ChannelType } from "@prisma/client";

export const channelSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Channel name should be at least 3 characters" })
    .max(20, { message: "Channel name should not be more than 20 characters" })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});
