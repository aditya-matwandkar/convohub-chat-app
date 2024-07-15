import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Space name should be at least 3 characters" })
    .max(20, { message: "Space name should not be more than 20 characters" }),
  imageURL: z.string().min(1, { message: "Space image is required" }),
});
