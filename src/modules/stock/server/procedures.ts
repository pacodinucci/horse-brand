import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import db from "@/lib/db";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";
import { stockInsertSchema } from "../schemas";
import { Prisma } from "@prisma/client";

export const stockRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(stockInsertSchema)
    .mutation(async ({ input }) => {
      const { productId, warehouseId, attributes, quantity, sku } = input;

      let productVariant = await db.productVariant.findFirst({
        where: {
          productId,
          attributes: {
            equals: attributes,
          },
        },
      });

      if (!productVariant) {
        productVariant = await db.productVariant.create({
          data: {
            productId,
            attributes,
            sku,
          },
        });
      }

      let stock = await db.stock.findFirst({
        where: {
          productVariantId: productVariant.id,
          warehouseId,
        },
      });

      if (stock) {
        stock = await db.stock.update({
          where: { id: stock.id },
          data: {
            quantity: stock.quantity + quantity,
          },
        });
      } else {
        stock = await db.stock.create({
          data: {
            productVariantId: productVariant.id,
            warehouseId,
            quantity,
            productId,
          },
        });
      }

      return stock;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const stock = await db.stock.findUnique({
        where: { id: input.id },
        include: {
          warehouse: true,
          ProductVariant: {
            include: { product: true },
          },
        },
      });

      if (!stock) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stock no encontrado.",
        });
      }

      return stock;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(), // Buscar por nombre de producto o SKU de la variante
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;

      // 🔑 Filtro correcto para relaciones en Prisma: usá `is` para 1 a 1
      let where: Prisma.StockWhereInput = {};

      if (search) {
        where = {
          OR: [
            {
              ProductVariant: {
                is: {
                  product: {
                    name: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              },
            },
            {
              ProductVariant: {
                is: {
                  sku: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          ],
        };
      }

      const [items, total] = await Promise.all([
        db.stock.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            warehouse: true,
            ProductVariant: {
              include: {
                product: true,
              },
            },
          },
        }),
        db.stock.count({ where }),
      ]);

      return {
        items,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    }),
});
