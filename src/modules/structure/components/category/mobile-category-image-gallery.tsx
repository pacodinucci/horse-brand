"use client";

import Image from "next/image";
import Link from "next/link";

type SideItem = {
  src: string;
  alt?: string;
  title: string;
  price?: string | number;
  href?: string; // opcional para hacer clic en toda la tarjeta
};

type Props = {
  items: SideItem[]; // 1 => single, >1 => grid (debe ser par)
  className?: string;
};

const formatPrice = (p?: string | number) => {
  if (p === undefined || p === null) return "";
  if (typeof p === "number") {
    try {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(p);
    } catch {
      return `$ ${p}`;
    }
  }
  return p;
};

function Card({ item, sizes }: { item: SideItem; sizes: string }) {
  const Body = (
    <figure className="relative w-full">
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={item.src}
          alt={item.alt ?? item.title}
          fill
          sizes={sizes}
          className="object-cover"
          priority={false}
        />
      </div>

      <figcaption className="pt-2">
        <div className="text-[13px] leading-snug text-neutral-900">
          {item.title}
        </div>
        {item.price !== undefined && item.price !== "" && (
          <div className="text-[12px] text-neutral-600">
            {formatPrice(item.price)}
          </div>
        )}
      </figcaption>
    </figure>
  );

  return item.href ? (
    <Link href={item.href} className="block">
      {Body}
    </Link>
  ) : (
    Body
  );
}

export const MobileCategoryImageGallery = ({ items, className }: Props) => {
  const isSingle = items.length === 1;

  if (!isSingle && items.length % 2 !== 0) {
    // En grid, debe ser par sí o sí
    throw new Error(
      `[MobileCategoryImageGallery] En modo grid, la cantidad de items debe ser par. Recibidos: ${items.length}`
    );
  }

  return (
    <div
      className={["block md:hidden w-full px-1 py-3", className || ""].join(
        " "
      )}
    >
      {isSingle ? (
        <Card item={items[0]} sizes="(max-width: 768px) 100vw" />
      ) : (
        <div className="grid grid-cols-2 gap-1">
          {items.map((it, idx) => (
            <Card key={idx} item={it} sizes="(max-width: 768px) 50vw" />
          ))}
        </div>
      )}
    </div>
  );
};
