import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import db from "@/lib/db";
import { subcategoryInsertSchema, subcategoryUpdateSchema } from "../schemas";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

export const subcategoryRouter = createTRPCRouter({
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
        categoryId: z.string().nullish(), // para filtrar por categoría opcional
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search, categoryId } = input;
      const where: Prisma.SubcategoryWhereInput = {};
      if (search)
        where.name = { contains: search, mode: "insensitive" as const };
      if (categoryId) where.categoryId = categoryId;

      const [items, total] = await Promise.all([
        db.subcategory.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        db.subcategory.count({ where }),
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
      const subcategory = await db.subcategory.findUnique({
        where: { id: input.id },
      });
      if (!subcategory) throw new Error("Subcategoría no encontrada");
      return subcategory;
    }),

  create: protectedProcedure
    .input(subcategoryInsertSchema)
    .mutation(async ({ input }) => {
      return db.subcategory.create({ data: input });
    }),

  update: protectedProcedure
    .input(subcategoryUpdateSchema)
    .mutation(async ({ input }) => {
      return db.subcategory.update({
        where: { id: input.id },
        data: input,
      });
    }),
});
