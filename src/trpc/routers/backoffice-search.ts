import { z } from "zod";
import db from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const backofficeRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().trim().min(2),
        take: z.number().int().min(1).max(20).optional(),
      })
    )
    .query(async ({ input }) => {
      const q = input.query;
      const take = input.take ?? 8;

      const [products, orders, customers] = await Promise.all([
        db.product.findMany({
          where: {
            OR: [{ name: { contains: q, mode: "insensitive" } }],
          },
          select: { id: true, name: true },
          take,
          orderBy: { createdAt: "desc" },
        }),

        // ✅ Order sin orderNumber: buscamos por id (y opcionalmente por customerId)
        db.order.findMany({
          where: {
            OR: [
              { id: { contains: q, mode: "insensitive" } },
              // si existe customerId y querés que también matchee:
              { customerId: { contains: q, mode: "insensitive" } },
            ],
          },
          select: { id: true, customerId: true, createdAt: true },
          take,
          orderBy: { createdAt: "desc" },
        }),

        db.customer.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, email: true },
          take,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        products,
        // ✅ devolvemos orderNumber “virtual” para la UI
        orders: orders.map((o) => ({
          id: o.id,
          orderNumber: o.id.slice(0, 8).toUpperCase(), // o el formato que quieras
        })),
        customers,
      };
    }),
});
