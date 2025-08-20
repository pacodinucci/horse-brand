import { z } from "zod";

export const productsInsertSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  subCategoryId: z.string().min(1),
  images: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  materials: z.array(z.string()).optional().default([]),
  measures: z.array(z.string()).optional().default([]),
  price: z.number().int(),
  supplier: z.string().optional().default(""),
});

export const productsUpdateSchema = productsInsertSchema.extend({
  id: z.string(),
});
