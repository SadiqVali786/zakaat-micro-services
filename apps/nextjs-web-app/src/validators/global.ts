import { z } from "zod";

export const idSchema = z.object({
  id: z.bigint() //.trim().cuid("Id must be a valid CUID."),
});
