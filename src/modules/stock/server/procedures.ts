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
  // createOrUpdate: protectedProcedure
  //   .input(stockInsertSchema)
  //   .mutation(async ({ input }) => {
  //     const { productId, warehouseId, attributes, quantity, sku } = input;

  //     let productVariant = await db.productVariant.findFirst({
  //       where: {
  //         productId,
  //         attributes: {
  //           equals: attributes,
  //         },
  //       },
  //     });

  //     if (!productVariant) {
  //       productVariant = await db.productVariant.create({
  //         data: {
  //           productId,
  //           attributes,
  //           sku,
  //         },
  //       });
  //     }

  //     let stock = await db.stock.findFirst({
  //       where: {
  //         productVariantId: productVariant.id,
  //         warehouseId,
  //       },
  //     });

  //     if (stock) {
  //       stock = await db.stock.update({
  //         where: { id: stock.id },
  //         data: {
  //           quantity: stock.quantity + quantity,
  //         },
  //       });
  //     } else {
  //       stock = await db.stock.create({
  //         data: {
  //           productVariantId: productVariant.id,
  //           warehouseId,
  //           quantity,
  //           productId,
  //         },
  //       });
  //     }

  //     return stock;
  //   }),

  create: protectedProcedure
    .input(stockInsertSchema)
    .mutation(async ({ input }) => {
      const { id, productId, warehouseId, attributes, quantity, sku } = input;

      if (id) {
        // Si viene id, editar directamente el stock (NO sumar, actualizar a la cantidad)
        return db.stock.update({
          where: { id },
          data: {
            quantity, // PONE la cantidad nueva, NO suma
            // Si querés permitir editar la variante también:
            // productVariantId: ..., // requeriría más lógica
          },
        });
      }

      // --- FLUJO DE CREAR ---

      let productVariant = await db.productVariant.findFirst({
        where: {
          productId,
          attributes: {
            equals: attributes, // attributes es tu objeto { size: "L", colors: "Rojo" }
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
        // Suma cantidad si ya existe (caso "entrada")
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

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Primero, comprobá que exista (opcional pero prolijo)
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
        // Podés permitir cambiar atributos, productVariant, etc, según tu lógica
        // attributes: z.record(z.string(), z.string()).optional(),
        // productVariantId: z.string().optional(),
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

      // Actualizá solo lo necesario (agregá más campos si querés)
      const updated = await db.stock.update({
        where: { id },
        data: {
          quantity,
          warehouse: { connect: { id: warehouseId } },
        },
      });

      return updated;
    }),
});
