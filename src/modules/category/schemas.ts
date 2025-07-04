import { z } from "zod";

export const categoryInsertSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().nullish(),
});

export const categoryUpdateSchema = categoryInsertSchema.extend({
  id: z.string().min(1, "ID requerido"),
});

export const subcategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
});
export const categoryWithSubsInsertSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  subcategories: z.array(subcategorySchema).min(1, "Al menos una subcategoría"),
});
export const categoryWithSubsUpdateSchema = categoryWithSubsInsertSchema.extend(
  {
    id: z.string().min(1, "Id requerido"),
  }
);
