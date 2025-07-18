import { z } from "zod";

export const stockInsertSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  warehouseId: z.string(),
  attributes: z.record(z.string(), z.string()),
  quantity: z.number(),
  sku: z.string().optional(),
});

export const stockUpdateSchema = stockInsertSchema.extend({
  id: z.string(),
});
