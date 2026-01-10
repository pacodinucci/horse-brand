"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCategoriesStore } from "@/store/categories";

type CategoryBreadcrumbProps = {
  categoryId: string;
  subcategoryId?: string;
  className?: string;
  /** Si querés mostrar el separador como texto distinto */
  separator?: string;
};

export const CategoryBreadcrumb = ({
  categoryId,
  subcategoryId,
  className,
  separator = ">",
}: CategoryBreadcrumbProps) => {
  const { categories } = useCategoriesStore();

  const { categoryName, subcategoryName } = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId);
    const categoryName = cat?.name ?? "";

    const sub =
      subcategoryId && cat?.subcategories?.length
        ? cat.subcategories.find((s) => s.id === subcategoryId)
        : undefined;

    const subcategoryName = sub?.name ?? "";

    return { categoryName, subcategoryName };
  }, [categories, categoryId, subcategoryId]);

  // Fallback básico si todavía no está hidratado el store
  if (!categoryName) return null;

  const baseHref = `/category/${categoryId}`;
  const subHref = subcategoryId
    ? `${baseHref}?subcategoryId=${encodeURIComponent(subcategoryId)}`
    : "";

  return (
    <div
      className={["w-full bg-zinc-50 text-neutral-900", className ?? ""].join(
        " "
      )}
      aria-label="Breadcrumb"
    >
      <div className="max-w-6xl px-6 py-6">
        <nav className="flex items-center gap-2 text-sm tracking-wide uppercase text-neutral-700">
          <Link href={baseHref} className="hover:text-neutral-900">
            {categoryName}
          </Link>

          {subcategoryName ? (
            <>
              <span className="text-neutral-400">{separator}</span>
              <Link href={subHref} className="hover:text-neutral-900">
                {subcategoryName}
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </div>
  );
};
