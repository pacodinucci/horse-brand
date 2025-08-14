import { z } from "zod";

// SCHEMA PARA OrderItem (creación dentro de una orden)
export const orderItemSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().min(1, "Debe ser al menos 1"),
  unitPrice: z.number().min(0, "Debe ser >= 0"),
  subtotal: z.number().min(0, "Debe ser >= 0"),
});

// SCHEMA PARA CREAR UNA ORDER
export const orderInsertSchema = z.object({
  customerId: z.string(),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]).default("PENDING"),
  total: z.number().min(0, "El total debe ser >= 0"),
  items: z.array(orderItemSchema).min(1, "Debe haber al menos un item"),
});

// SCHEMA PARA UPDATE (por ej: sólo status, o total si querés)
export const orderUpdateSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]),
  // total: z.number().min(0).optional(),
  // items: z.array(orderItemSchema).optional(),
});
