import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import db from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const ordersRouter = createTRPCRouter({
  // LISTAR orders paginado + search
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(100).default(20),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;
      const where = search
        ? {
            OR: [
              {
                status: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                Customer: {
                  name: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
              {
                Customer: {
                  email: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            ],
          }
        : {};
      const [items, total] = await Promise.all([
        db.order.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            Customer: true,
            items: {
              include: {
                /* Podés incluir info del producto si querés */
              },
            },
          },
        }),
        db.order.count({ where }),
      ]);
      return { items, total, totalPages: Math.ceil(total / pageSize) };
    }),

  // DETALLE de una orden
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const order = await db.order.findUnique({
        where: { id: input.id },
        include: {
          Customer: true,
          items: true, // o podés incluir producto/variant
        },
      });
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Orden no encontrada.",
        });
      }
      return order;
    }),

  // CREAR una orden (con items)
  create: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
        status: z.string(),
        total: z.number(),
        items: z.array(
          z.object({
            productVariantId: z.string(),
            quantity: z.number().min(1),
            unitPrice: z.number().min(0),
            subtotal: z.number().min(0),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const order = await db.order.create({
        data: {
          customerId: input.customerId,
          status: input.status,
          total: input.total,
          items: {
            create: input.items.map((item) => ({
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            })),
          },
        },
        include: { items: true, Customer: true },
      });
      return order;
    }),

  // ACTUALIZAR (ej: status)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const order = await db.order.update({
        where: { id: input.id },
        data: {
          status: input.status,
        },
        include: { items: true, Customer: true },
      });
      return order;
    }),

  // ELIMINAR
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const order = await db.order.findUnique({
        where: { id: input.id },
      });
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Orden no encontrada.",
        });
      }
      await db.order.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
