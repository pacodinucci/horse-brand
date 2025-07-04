import { z } from "zod";

export const warehouseInsertSchema = z.object({
  name: z.string().min(1, "Requerido"),
  location: z.string().optional(),
});

export const warehouseUpdateSchema = warehouseInsertSchema.extend({
  id: z.string(),
});
