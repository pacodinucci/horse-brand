import { z } from "zod";

export const productsInsertSchema = z.object({
  name: z.string().min(1, "Requerido"),
  categoryId: z.string().min(1, "Requerido"),
  subCategoryId: z.string().min(1, "Requerido"),
  images: z.array(z.string().url()).min(1, "Al menos una imagen requerida."),
});

export const productsUpdateSchema = productsInsertSchema.extend({
  id: z.string(),
});
