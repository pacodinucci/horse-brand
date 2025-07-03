import { z } from "zod";

export const productsInsertSchema = z.object({
  name: z.string().min(1, "Requerido"),
  category: z.string().min(1, "Requerido"),
  subCategory: z.string().min(1, "Requerido"),
});

export const productsUpdateSchema = productsInsertSchema.extend({
  id: z.string(),
});
