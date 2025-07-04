import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import db from "@/lib/db";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { warehouseInsertSchema, warehouseUpdateSchema } from "../schemas";
import { TRPCError } from "@trpc/server";

export const warehouseRouter = createTRPCRouter({
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

      const where = search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {};

      const [items, total] = await Promise.all([
        db.warehouse.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        db.warehouse.count({ where }),
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
      const warehouse = await db.warehouse.findUnique({
        where: { id: input.id },
      });

      if (!warehouse) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Depósito no encontrado.",
        });
      }

      return warehouse;
    }),

  create: protectedProcedure
    .input(warehouseInsertSchema)
    .mutation(async ({ input }) => {
      const warehouse = await db.warehouse.create({
        data: {
          name: input.name,
          location: input.location,
        },
      });
      return warehouse;
    }),

  update: protectedProcedure
    .input(warehouseUpdateSchema)
    .mutation(async ({ input }) => {
      const updatedWarehouse = await db.warehouse.update({
        where: { id: input.id },
        data: {
          name: input.name,
          location: input.location,
        },
      });

      return updatedWarehouse;
    }),
});
