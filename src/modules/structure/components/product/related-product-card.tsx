"use client";

import Link from "next/link";
import Image from "next/image";

function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export type RelatedProduct = {
  id: string;
  name: string;
  price: number;
  images: string[];
};

export function RelatedProductCard({ product }: { product: RelatedProduct }) {
  const hero = product.images?.[0] ?? "/cat1.png";

  return (
    <Link
      href={`/product/${product.id}`}
      className="
        group flex items-center gap-4
        h-[116px] w-full
        rounded-sm bg-white
        border border-neutral-200
        px-5
        hover:shadow-sm transition
      "
    >
      {/* Imagen */}
      <div className="relative h-[80px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={hero}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="72px"
        />
      </div>

      {/* Texto */}
      <div className="min-w-0">
        <p className="uppercase tracking-wide text-sm text-neutral-800 line-clamp-2">
          {product.name}
        </p>
        <p className="text-sm text-neutral-600 mt-1">
          {formatARS(product.price)}
        </p>
      </div>
    </Link>
  );
}
