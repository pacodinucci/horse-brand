import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import db from "@/lib/db";
import {
  categoryInsertSchema,
  categoryUpdateSchema,
  categoryWithSubsInsertSchema,
  categoryWithSubsUpdateSchema,
} from "../schemas";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

export const categoryRouter = createTRPCRouter({
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
        db.category.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            subcategories: true,
          },
        }),
        db.category.count({ where }),
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
      const category = await db.category.findUnique({
        where: { id: input.id },
        include: {
          subcategories: true,
        },
      });
      if (!category) throw new Error("Categoría no encontrada");
      return category;
    }),

  create: protectedProcedure
    .input(categoryInsertSchema)
    .mutation(async ({ input }) => {
      return db.category.create({ data: input });
    }),

  update: protectedProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ input }) => {
      return db.category.update({
        where: { id: input.id },
        data: input,
      });
    }),

  createWithSubcategories: protectedProcedure
    .input(categoryWithSubsInsertSchema)
    .mutation(async ({ input }) => {
      // Crea categoría y subcategorías en la misma transacción
      const created = await db.category.create({
        data: {
          name: input.name,
          description: input.description,
          subcategories: {
            create: input.subcategories.map((sc) => ({
              name: sc.name,
              description: sc.description,
            })),
          },
        },
        include: { subcategories: true },
      });
      return created;
    }),

  updateWithSubcategories: protectedProcedure
    .input(categoryWithSubsUpdateSchema)
    .mutation(async ({ input }) => {
      // Opcional: podés manejar borrado de subcategorías aquí si querés
      // Por ahora, actualiza la categoría y reemplaza todas las subcategorías
      const updated = await db.category.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          // Elimina y vuelve a crear subcategorías
          subcategories: {
            deleteMany: {}, // borra todas
            create: input.subcategories.map((sc) => ({
              name: sc.name,
              description: sc.description,
            })),
          },
        },
        include: { subcategories: true },
      });
      return updated;
    }),

  ensureByNames: protectedProcedure
    .input(z.object({ names: z.array(z.string().min(1)).min(1) }))
    .mutation(async ({ input }) => {
      // normalizar + deduplicar
      const names = Array.from(
        new Set(input.names.map((n) => n.trim()).filter(Boolean))
      );

      const created: { id: string; name: string }[] = [];
      const existing: { id: string; name: string }[] = [];

      await db.$transaction(async (tx) => {
        for (const name of names) {
          const found = await tx.category.findFirst({
            where: { name: { equals: name, mode: "insensitive" } },
            select: { id: true, name: true },
          });

          if (found) {
            existing.push(found);
          } else {
            const c = await tx.category.create({
              data: { name }, // description si querés
              select: { id: true, name: true },
            });
            created.push(c);
          }
        }
      });

      return {
        createdCount: created.length,
        existingCount: existing.length,
        created,
        existing,
      };
    }),
});
