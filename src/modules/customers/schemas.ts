import { z } from "zod";

export const customerInsertSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const customerUpdateSchema = customerInsertSchema.extend({
  id: z.string(),
});
