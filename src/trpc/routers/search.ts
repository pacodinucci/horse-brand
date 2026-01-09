import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import db from "@/lib/db";

export const searchRouter = createTRPCRouter({
  global: baseProcedure
    .input(
      z.object({
        q: z.string().trim().min(1),
        limit: z.number().int().min(1).max(20).default(8),
      })
    )
    .query(async ({ input }) => {
      const q = input.q;
      const limit = input.limit;

      // 1) Productos
      const products = await db.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            // si tenés slug o sku:
            // { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          price: true,
        },
        take: limit,
      });

      // 2) Categorías
      const categories = await db.category.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: { id: true, name: true, slug: true },
        take: limit,
      });

      // 3) Subcategorías
      const subcategories = await db.subcategory.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: {
          id: true,
          name: true,
          slug: true,
          category: { select: { id: true, name: true, slug: true } },
        },
        take: limit,
      });

      // Unificamos al mismo shape que tu UI ya espera
      const results = [
        ...products.map((p) => ({
          id: `p_${p.id}`,
          type: "product" as const,
          title: p.name,
          subtitle:
            p.price != null
              ? `$${Number(p.price).toLocaleString("es-AR")}`
              : "Producto",
          href: `/product/${p.id}`,
        })),
        ...categories.map((c) => ({
          id: `c_${c.id}`,
          type: "category" as const,
          title: c.name,
          subtitle: "Categoría",
          href: c.slug ? `/category/${c.slug}` : `/category/${c.id}`,
        })),
        ...subcategories.map((s) => ({
          id: `s_${s.id}`,
          type: "subcategory" as const,
          title: s.name,
          subtitle: s.category?.name
            ? `Subcategoría · ${s.category.name}`
            : "Subcategoría",
          href: s.slug ? `/subcategory/${s.slug}` : `/subcategory/${s.id}`,
        })),
      ];

      // Podés ordenar para priorizar productos, o por "startsWith"
      // (mantengo simple y determinista)
      return results.slice(0, limit);
    }),
});
