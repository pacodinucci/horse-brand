import { z } from "zod";

export const stockInsertSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  warehouseId: z.string(),
  quantity: z.number(),
  sku: z.string().optional(),
  color: z.string().optional().default(""),
  material: z.string().optional().default(""),
  measure: z.string().optional().default(""),
});

export const stockUpdateSchema = stockInsertSchema.extend({
  id: z.string(),
});
