import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
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
        paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
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
          paymentStatus: input.paymentStatus,
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
        paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
      })
    )
    .mutation(async ({ input }) => {
      const order = await db.order.update({
        where: { id: input.id },
        data: {
          paymentStatus: input.paymentStatus,
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

  createFromCart: baseProcedure
    .input(
      z.object({
        customerId: z.string(),
        paymentMethod: z.enum(["BANK_TRANSFER", "MERCADO_PAGO"]),
        paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
        cart: z.array(
          z.object({
            id: z.string(), // productVariantId
            quantity: z.number().min(1),
            price: z.number().min(0), // por ahora, como tu /api/checkout
            name: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // const status =
      //   input.paymentMethod === "transfer" ? "awaiting_transfer" : "pending";

      const total = input.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const order = await db.order.create({
        data: {
          customerId: input.customerId,
          paymentMethod: input.paymentMethod,
          paymentStatus: input.paymentStatus,
          total,
          items: {
            create: input.cart.map((item) => ({
              productVariantId: item.id,
              quantity: item.quantity,
              unitPrice: item.price,
              subtotal: item.price * item.quantity,
            })),
          },
        },
        include: { items: true, Customer: true },
      });

      return order;
    }),
});
