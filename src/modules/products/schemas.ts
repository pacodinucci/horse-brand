import { z } from "zod";

export const productsInsertSchema = z.object({
  name: z.string().min(1, "Requerido"),
  categoryId: z.string().min(1, "Requerido"),
  subCategoryId: z.string().min(1, "Requerido"),
});

export const productsUpdateSchema = productsInsertSchema.extend({
  id: z.string(),
});
