import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import db from "@/lib/db";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;

      // Filtro solo por búsqueda
      const where = search
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive, // <--- ESTA ES LA CLAVE
            },
          }
        : {};

      // Datos paginados
      const [items, total] = await Promise.all([
        db.product.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        db.product.count({ where }),
      ]);

      return {
        items,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const product = await db.product.findUnique({
        where: { id: input.id },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Producto no encontrado.",
        });
      }

      return product;
    }),
});
