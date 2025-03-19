import { z } from "zod";

export const createTweetSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "not a single character is in the tweet")
    .max(280, "tweet should be <= 280 characters")
});
