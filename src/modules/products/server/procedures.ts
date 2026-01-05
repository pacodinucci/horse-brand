import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  baseProcedure,
} from "@/trpc/init";
import db from "@/lib/db";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";
import { productsInsertSchema, productsUpdateSchema } from "../schemas";

/** === Excel row schema === */
const rowSchema = z.object({
  Categoria: z.string().optional().nullable(),
  Subcategoria: z.string().optional().nullable(),
  "Nombre Base": z.string().min(1),
  Color: z.string().optional().nullable(),
  Material: z.string().optional().nullable(),
  Medidas: z.string().optional().nullable(),
  Precio: z.union([z.string(), z.number()]).optional().nullable(),
  Proveedor: z.string().optional().nullable(),
});
type Row = z.infer<typeof rowSchema>;

/** === Helpers === */
const norm = (v: unknown): string | undefined => {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
};
const toInt = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
};
const union = (arr: Array<string | undefined | null>): string[] =>
  Array.from(new Set(arr.filter((s): s is string => !!s)));

const getCatSub = (
  categoria?: string | null,
  subcategoria?: string | null
): { cat: string; sub: string } | null => {
  const c = norm(categoria);
  const s = norm(subcategoria);
  if (c && s) return { cat: c, sub: s }; // caso ideal

  if (c && !s) {
    // Soporta "Categoria/Subcategoria" en una sola celda
    const parts = c
      .split("/")
      .map((t) => t.trim())
      .filter(Boolean);
    if (parts.length >= 2) return { cat: parts[0], sub: parts[1] };
    return null; // falta sub
  }
  return null; // falta cat o ambas
};

/** === Router === */
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

  getMany: baseProcedure
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
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {};

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

  getOne: baseProcedure
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

  /** Importa desde Excel:
   * - Asegura cat/sub por fila (case-insensitive)
   * - Crea producto solo si "Nombre Base" no existe
   */
  createNewFromRows: protectedProcedure
    .input(z.object({ rows: z.array(rowSchema).min(1) }))
    .mutation(async ({ input }) => {
      // 1) Agrupar por "Nombre Base"
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
        return {
          ok: true as const,
          created: 0,
          skippedExisting: 0,
          skippedInvalid: 0,
          invalid: [] as Array<{ name: string; reason: string }>,
        };
      }

      // 2) Buscar existentes (case-insensitive)
      const existing = await db.product.findMany({
        where: {
          OR: allNames.map((n) => ({
            name: { equals: n, mode: Prisma.QueryMode.insensitive },
          })),
        },
        select: { name: true },
      });
      const existingLower = new Set(existing.map((e) => e.name.toLowerCase()));

      const newNames = allNames.filter(
        (n) => !existingLower.has(n.toLowerCase())
      );

      // 3) Crear cada producto NUEVO (no tocamos existentes)
      let created = 0;
      const invalid: Array<{ name: string; reason: string }> = [];

      for (const name of newNames) {
        const rows = groups.get(name)!;

        // Atributos agregados desde TODAS las filas de ese producto
        const colors = union(rows.map((r) => norm(r.Color)));
        const materials = union(rows.map((r) => norm(r.Material)));
        const measures = union(rows.map((r) => norm(r.Medidas)));
        const first = rows[0];

        // Validar Categoría/Subcategoría (obligatorio)
        const catSub = getCatSub(first.Categoria, first.Subcategoria);
        if (!catSub) {
          invalid.push({
            name,
            reason:
              "Falta Categoría y/o Subcategoría. Usá columnas 'Categoria' + 'Subcategoria' o 'Categoria/Subcategoria' en 'Categoria'.",
          });
          continue; // salteamos este producto
        }
        const { cat, sub } = catSub;

        const price = toInt(first.Precio);
        const supplier = norm(first.Proveedor) ?? "";

        // Transacción por producto: asegura cat/sub y crea el producto
        await db.$transaction(async (tx) => {
          // A) Category (insensitive). Usamos findFirst para evitar issues de casing.
          let category = await tx.category.findFirst({
            where: {
              name: { equals: cat, mode: Prisma.QueryMode.insensitive },
            },
            select: { id: true },
          });
          if (!category) {
            try {
              category = await tx.category.create({
                data: { name: cat },
                select: { id: true },
              });
            } catch (e: unknown) {
              // Si otro proceso la creó con distinto casing, re-leemos
              if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002"
              ) {
                category = await tx.category.findFirst({
                  where: {
                    name: { equals: cat, mode: Prisma.QueryMode.insensitive },
                  },
                  select: { id: true },
                });
              } else {
                throw e;
              }
            }
          }

          if (!category) {
            // fallback extremo
            throw new Error("No se pudo asegurar la categoría");
          }

          // B) Subcategory (insensitive dentro de la categoría)
          let subcategory = await tx.subcategory.findFirst({
            where: {
              categoryId: category.id,
              name: { equals: sub, mode: Prisma.QueryMode.insensitive },
            },
            select: { id: true },
          });
          if (!subcategory) {
            try {
              subcategory = await tx.subcategory.create({
                data: { categoryId: category.id, name: sub },
                select: { id: true },
              });
            } catch (e: unknown) {
              // Si existe por unique compuesto (si lo tenés) o se creó en paralelo
              if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002"
              ) {
                subcategory = await tx.subcategory.findFirst({
                  where: {
                    categoryId: category.id,
                    name: { equals: sub, mode: Prisma.QueryMode.insensitive },
                  },
                  select: { id: true },
                });
              } else {
                throw e;
              }
            }
          }

          if (!subcategory) {
            throw new Error("No se pudo asegurar la subcategoría");
          }

          // C) Crear Product (name @unique)
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
            if (
              e instanceof Prisma.PrismaClientKnownRequestError &&
              e.code === "P2002"
            ) {
              // Otro proceso lo creó entre que filtramos y creamos → ignoramos
              // (no incrementamos created)
            } else if (e instanceof Error) {
              // Log suave y seguimos con el resto
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
        skippedExisting: allNames.length - created - invalid.length,
        skippedInvalid: invalid.length,
        invalid, // útil para mostrar detalle en UI
      };
    }),

  getByCategoryId: baseProcedure
    .input(
      z.object({
        categoryId: z.string().uuid(),
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        subCategoryId: z.string().uuid().nullish(), // opcional
      })
    )
    .query(async ({ input }) => {
      const { categoryId, page, pageSize, search, subCategoryId } = input;

      const where: Prisma.ProductWhereInput = {
        categoryId,
        ...(subCategoryId ? { subCategoryId } : {}),
        ...(search
          ? {
              name: { contains: search, mode: Prisma.QueryMode.insensitive },
            }
          : {}),
      };

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
});
