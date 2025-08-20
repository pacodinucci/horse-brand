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
import { productsInsertSchema, productsUpdateSchema } from "../schemas";

const rowSchema = z.object({
  Categoria: z.string().optional().nullable(), // "Cat" o "Cat/Sub"
  "Nombre Base": z.string().min(1), // Product.name
  Color: z.string().optional().nullable(),
  Material: z.string().optional().nullable(),
  Medidas: z.string().optional().nullable(),
  Precio: z.union([z.string(), z.number()]).optional().nullable(),
  Proveedor: z.string().optional().nullable(),
});

type Row = z.infer<typeof rowSchema>;

const norm = (v: unknown) => {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
};
const toInt = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
};
const splitCategoria = (raw?: string | null) => {
  const v = norm(raw);
  if (!v) return { cat: "Sin categoría", sub: "General" };
  const [cat, sub] = v
    .split("/")
    .map((x) => x.trim())
    .filter(Boolean);
  return { cat: cat ?? "Sin categoría", sub: sub ?? "General" };
};
const union = (arr: (string | undefined)[]) =>
  Array.from(new Set(arr.filter(Boolean) as string[]));

export const productsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(productsInsertSchema)
    .mutation(async ({ input }) => {
      const createdProduct = await db.product.create({
        data: {
          name: input.name,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          images: input.images ?? [],
          colors: input.colors ?? [],
          materials: input.materials ?? [],
          measures: input.measures ?? [],
          price: input.price,
          supplier: input.supplier ?? "",
        },
      });
      return createdProduct;
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
              mode: Prisma.QueryMode.insensitive,
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
          include: {
            category: true,
            subCategory: true,
            ProductVariant: true,
          },
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
      const product = await db.product.findFirst({
        where: { id: input.id },
        include: {
          category: true,
          subCategory: true,
          ProductVariant: true,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Producto no encontrado.",
        });
      }

      return product;
    }),

  update: protectedProcedure
    .input(productsUpdateSchema)
    .mutation(async ({ input }) => {
      const updatedProduct = await db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          images: input.images ?? [],
          colors: input.colors ?? [],
          materials: input.materials ?? [],
          measures: input.measures ?? [],
          price: input.price,
          supplier: input.supplier ?? "",
        },
      });

      return updatedProduct;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const product = await db.product.findUnique({ where: { id: input.id } });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Producto no encontrado.",
        });
      }

      await db.product.delete({ where: { id: input.id } });
      return { success: true };
    }),

  createNewFromRows: protectedProcedure
    .input(z.object({ rows: z.array(rowSchema).min(1) }))
    .mutation(async ({ input }) => {
      // 1) agrupar por "Nombre Base"
      const groups = new Map<string, Row[]>();
      for (const r of input.rows) {
        const name = norm(r["Nombre Base"]);
        if (!name) continue;
        const key = name.trim();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(r);
      }
      const allNames = Array.from(groups.keys());

      if (allNames.length === 0) {
        return { ok: true as const, created: 0, skippedExisting: 0 };
      }

      // 2) buscar existentes (case-insensitive)
      const existing = await db.product.findMany({
        where: {
          OR: allNames.map((n) => ({
            name: { equals: n, mode: "insensitive" as const },
          })),
        },
        select: { name: true },
      });
      const existingLower = new Set(existing.map((e) => e.name.toLowerCase()));

      const newNames = allNames.filter(
        (n) => !existingLower.has(n.toLowerCase())
      );
      if (newNames.length === 0) {
        return {
          ok: true as const,
          created: 0,
          skippedExisting: allNames.length,
        };
      }

      // 3) crear cada producto nuevo
      let created = 0;

      for (const name of newNames) {
        const rows = groups.get(name)!;

        // agregados para arrays y campos base
        const colors = union(rows.map((r) => norm(r.Color)));
        const materials = union(rows.map((r) => norm(r.Material)));
        const measures = union(rows.map((r) => norm(r.Medidas)));
        const first = rows[0];

        const { cat, sub } = splitCategoria(first.Categoria);
        const price = toInt(first.Precio);
        const supplier = norm(first.Proveedor) ?? "";

        await db.$transaction(async (tx) => {
          // A) Category por name (único)
          let category = await tx.category.findUnique({
            where: { name: cat }, // name @unique
            select: { id: true },
          });
          if (!category) {
            category = await tx.category.create({
              data: { name: cat }, // si manejás slug, agregalo acá
              select: { id: true },
            });
          }

          // B) Subcategory por (categoryId, name)
          // Si tenés @@unique([categoryId, name]) usá upsert; si no, findFirst + create.
          let subcategory = await tx.subcategory.findFirst({
            where: {
              categoryId: category.id,
              name: { equals: sub, mode: "insensitive" },
            },
            select: { id: true },
          });
          if (!subcategory) {
            subcategory = await tx.subcategory.create({
              data: { categoryId: category.id, name: sub }, // si manejás slug, agregalo acá
              select: { id: true },
            });
          }

          // C) Crear product (name es @unique → si otro proceso lo creó, puede tirar conflicto)
          try {
            await tx.product.create({
              data: {
                name,
                categoryId: category.id,
                subCategoryId: subcategory.id,
                images: [],
                colors,
                materials,
                measures,
                price,
                supplier,
              },
            });
            created++;
          } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
              // P2002 = violación de índice único (p. ej., name @unique)
              if (e.code === "P2002") {
                // ya existe → lo ignoramos (no incrementamos `created`)
                // opcional: log suave
                console.warn(
                  "[products.createNewFromRows] Producto duplicado (unique):",
                  name
                );
                return; // o sigue con la próxima fila
              }

              console.error(
                "[products.createNewFromRows] Prisma error",
                e.code,
                e.meta ?? ""
              );
            } else if (e instanceof Error) {
              console.error("[products.createNewFromRows] Error:", e.message);
            } else {
              console.error(
                "[products.createNewFromRows] Error desconocido:",
                e
              );
            }
          }
        });
      }

      return {
        ok: true as const,
        created,
        skippedExisting: allNames.length - created,
      };
    }),
});
