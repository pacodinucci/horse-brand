"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type Product = {
  id: string;
  href: string;
  name: string;
  price: string; // si usas number, formatealo antes
  imageUrl: string;
  imageAlt?: string;
};

type CollectionProps = {
  eyebrow?: string; // ej: "OTOÑO BICOLOR"
  title?: string; // opcional si querés un H1 más largo
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  heroImageUrl: string;
  heroImageAlt?: string;
  products: Product[];
  className?: string;
};

export function Collection({
  eyebrow = "OTOÑO BICOLOR",
  title,
  subtitle = "La cachemira aporta esa suavidad natural cuando abraza el cuello.",
  ctaLabel = "CALIDEZ PARA EL LOOK",
  ctaHref = "#",
  heroImageUrl,
  heroImageAlt = "",
  products,
  className,
}: CollectionProps) {
  return (
    <section
      className={["w-full bg-zinc-100 text-neutral-900", className || ""].join(
        " "
      )}
      aria-label={eyebrow}
    >
      {/* Encabezado */}
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-6 text-center">
        <p className="tracking-[0.2em] text-xs md:text-sm uppercase">
          {eyebrow}
        </p>
        {title ? (
          <h1 className="mt-2 text-lg md:text-xl font-medium">{title}</h1>
        ) : null}
        {subtitle ? (
          <p className="mx-auto mt-2 max-w-2xl text-[11px] md:text-sm text-neutral-600">
            {subtitle}
          </p>
        ) : null}
        {ctaLabel && ctaHref ? (
          <div className="mt-4">
            <Button
              asChild
              variant="link"
              className="px-0 underline underline-offset-4"
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        ) : null}
      </div>

      {/* Imagen hero */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={heroImageUrl}
            alt={heroImageAlt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw"
          />
        </div>
      </div>

      {/* Lista de productos */}
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <ul className="grid grid-cols-2 md:grid-cols-4 justify-items-center">
          {products.map((p) => (
            <li key={p.id}>
              <Card className="group border-none bg-transparent shadow-none">
                <Link
                  href={p.href}
                  className="block focus:outline-none focus:ring-2 focus:ring-neutral-800"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square w-32 md:w-40 overflow-hidden">
                      <Image
                        src={p.imageUrl}
                        alt={p.imageAlt ?? p.name}
                        fill
                        className="object-cover transition-transform duration-300"
                        sizes="(min-width: 768px) 10rem, 8rem" // md≈160px, base≈128px
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="px-0 pt-2 flex flex-col items-start gap-0">
                    <span className="text-[11px] md:text-sm leading-tight">
                      {p.name}
                    </span>
                    <span className="text-[10px] md:text-xs text-neutral-600">
                      {p.price}
                    </span>
                  </CardFooter>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
