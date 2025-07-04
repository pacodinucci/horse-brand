import { z } from "zod";

export const subcategoryInsertSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().nullish(),
  categoryId: z.string().min(1, "Categoría requerida"),
});

export const subcategoryUpdateSchema = subcategoryInsertSchema.extend({
  id: z.string().min(1, "ID requerido"),
});
