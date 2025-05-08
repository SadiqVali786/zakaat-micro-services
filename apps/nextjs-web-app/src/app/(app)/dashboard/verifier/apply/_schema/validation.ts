import { z } from "zod";

export const applySchema = z.object({
  email: z.string().min(1),
  upiId: z.string().min(3),
  selfie: z.string(),
  latitude: z.number().min(1),
  longitude: z.number().min(1),
  reason: z.string().min(1),
  encodedFace: z.array(z.number()),
  amount: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .min(0, "Amount must be greater than 0")
        .max(100000, "Amount must be less than 100000")
    ),
  rank: z
    .string()
    .transform(Number)
    .pipe(z.number().min(0, "Rank must be greater than 0").max(10, "Rank must be less than 10"))
});
