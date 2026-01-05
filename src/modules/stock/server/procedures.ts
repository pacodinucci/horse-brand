import { z } from "zod";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
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

const norm = (v?: string | null) => v?.trim().toLowerCase() || undefined;

export const stockRouter = createTRPCRouter({
  create: protectedProcedure
    .input(stockInsertSchema)
    .mutation(async ({ input }) => {
      const {
        id,
        productId,
        warehouseId,
        quantity,
        sku,
        color,
        material,
        measure,
      } = input;

      if (id) {
        // Editar stock existente
        return db.stock.update({
          where: { id },
          data: { quantity },
        });
      }

      // Buscar variante concreta por columnas
      let productVariant = await db.productVariant.findFirst({
        where: {
          productId,
          color,
          material,
          measure,
        },
      });

      if (!productVariant) {
        productVariant = await db.productVariant.create({
          data: {
            productId,
            color,
            material,
            measure,
            sku,
          },
        });
      }

      // Buscar stock de esa variante en ese depósito
      let stock = await db.stock.findFirst({
        where: {
          productVariantId: productVariant.id,
          warehouseId,
        },
      });

      if (stock) {
        // Sumar cantidad
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
          product: true,
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

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const stock = await db.stock.findUnique({ where: { id: input.id } });

      if (!stock) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stock no encontrado.",
        });
      }

      await db.stock.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number(),
        warehouseId: z.string(),
        sku: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, quantity, warehouseId } = input;

      const stock = await db.stock.findUnique({ where: { id } });
      if (!stock) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stock no encontrado.",
        });
      }

      const updated = await db.stock.update({
        where: { id },
        data: {
          quantity,
          warehouse: { connect: { id: warehouseId } },
        },
      });

      return updated;
    }),

  // ✅ EXACTAMENTE como lo necesitás
  getAvailabilityBySelection: baseProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        color: z.string().optional(),
        material: z.string().optional(),
        measure: z.string().optional(),
        warehouseId: z.string().uuid().optional(), // opcional
      })
    )
    .query(async ({ input }) => {
      const color = norm(input.color);
      const material = norm(input.material);
      const measure = norm(input.measure);

      // 1) Buscar variant por productId + TODOS los atributos provistos
      const whereVariant: Prisma.ProductVariantWhereInput = {
        productId: input.productId,

        ...(color
          ? { color: { equals: color, mode: Prisma.QueryMode.insensitive } }
          : {}),
        ...(material
          ? {
              material: {
                equals: material,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {}),
        ...(measure
          ? { measure: { equals: measure, mode: Prisma.QueryMode.insensitive } }
          : {}),
      };

      const variant = await db.productVariant.findFirst({
        where: whereVariant,
        select: { id: true, sku: true },
      });

      if (!variant) {
        return {
          productVariantId: null as string | null,
          sku: null as string | null,
          available: 0,
          perWarehouse: [] as Array<{ warehouseId: string; quantity: number }>,
        };
      }

      // 2) Stock por productVariantId (y opcional warehouseId)
      const whereStock: Prisma.StockWhereInput = {
        productVariantId: variant.id,
        ...(input.warehouseId ? { warehouseId: input.warehouseId } : {}),
      };

      const totalAgg = await db.stock.aggregate({
        where: whereStock,
        _sum: { quantity: true },
      });

      const rows = await db.stock.findMany({
        where: { productVariantId: variant.id },
        select: { warehouseId: true, quantity: true },
      });

      return {
        productVariantId: variant.id,
        sku: variant.sku ?? null,
        available: totalAgg._sum.quantity ?? 0,
        perWarehouse: rows.map((r) => ({
          warehouseId: r.warehouseId,
          quantity: r.quantity,
        })),
      };
    }),
});
