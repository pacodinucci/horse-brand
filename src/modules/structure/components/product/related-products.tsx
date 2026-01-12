"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { RelatedProductCard } from "./related-product-card";

type Props = {
  productId: string;
  categoryId: string;
  subCategoryId: string;
};

export function RelatedProducts({
  productId,
  categoryId,
  subCategoryId,
}: Props) {
  const trpc = useTRPC();

  const q = trpc.products.getRelated.queryOptions({
    productId,
    categoryId,
    subCategoryId,
    take: 5,
  });

  const { data, isLoading, isError } = useQuery(q);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-[2rem] bg-neutral-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-neutral-500">
        No se pudieron cargar los relacionados.
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-neutral-500">No hay productos relacionados.</p>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((p) => (
        <RelatedProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
