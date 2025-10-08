"use client";
import React, { useEffect, useState } from "react";

type LinkItem = { name: string; href: string };
type Data = { title: string; links: LinkItem[] };

type Props = {
  open: boolean;
  slug: string | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
};

const ITEMS_BY_SLUG: Record<string, Data> = {
  cueros: {
    title: "Cueros",
    links: [
      { name: "Lanar", href: "/cueros/lanar" },
      { name: "Vacuno", href: "/cueros/vacuno" },
      { name: "Hereford", href: "/cueros/hereford" },
      { name: "Ver todo", href: "/cueros" },
    ],
  },
  deco: {
    title: "Deco",
    links: [
      { name: "Almohadones", href: "/deco/almohadones" },
      { name: "Mantas", href: "/deco/mantas" },
      { name: "Puffs", href: "/deco/puffs" },
      { name: "Ver todo", href: "/deco" },
    ],
  },
  living: {
    title: "Living",
    links: [
      { name: "Sillones", href: "/living/sillones" },
      { name: "Banquitos", href: "/living/banquitos" },
      { name: "Mesas", href: "/living/mesas" },
      { name: "Ver todo", href: "/living" },
    ],
  },
  "bolsos-y-carteras": {
    title: "Bolsos & Carteras",
    links: [
      { name: "Materas", href: "/bolsos-y-carteras/materas" },
      { name: "Bolsos", href: "/bolsos-y-carteras/bolsos" },
      { name: "Mochilas", href: "/bolsos-y-carteras/mochilas" },
      { name: "Billeteras", href: "/bolsos-y-carteras/billeteras" },
      { name: "Accesorios", href: "/bolsos-y-carteras/accesorios" },
      { name: "Ver todo", href: "/bolsos-y-carteras" },
    ],
  },
  accesorios: {
    title: "Accesorios",
    links: [
      { name: "Cintos", href: "/accesorios/cintos" },
      { name: "Billeteras", href: "/accesorios/billeteras" },
      { name: "Llaveros", href: "/accesorios/llaveros" },
      { name: "Ver todo", href: "/accesorios" },
    ],
  },
  sale: {
    title: "SALE",
    links: [{ name: "Ver todo", href: "/sale" }],
  },
};

export function MegaMenu({
  open,
  slug,
  onMouseEnter,
  onMouseLeave,
  className = "",
}: Props) {
  const [enter, setEnter] = useState(false); // controla clases (in/out)
  const [visible, setVisible] = useState(false); // controla montaje para salida

  // Entrada / salida con retardo de desmontaje
  useEffect(() => {
    if (open && slug) {
      setVisible(true);
      // re-dispara animación en cada categoría
      setEnter(false);
      const raf = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(raf);
    } else {
      // dispara animación de salida
      setEnter(false);
      const to = setTimeout(() => setVisible(false), 200); // == duration
      return () => clearTimeout(to);
    }
  }, [open, slug]);

  if (!visible || !slug) return null;

  const data = ITEMS_BY_SLUG[slug] ?? {
    title: slug,
    links: [{ name: "Ver todo", href: `/${slug}` }],
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed inset-x-0 top-[18vh] z-40 border-t bg-white shadow-xl ${className}
        transition-all duration-300 ease-out
        ${enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-7">
          <div className="mb-4 text-sm font-semibold text-neutral-700 uppercase tracking-wide">
            {data.title}
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
            {data.links.map((it) => (
              <li key={it.href}>
                <a
                  href={it.href}
                  className="block text-[15px] text-neutral-800 hover:underline underline-offset-4"
                >
                  {it.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha opcional */}
        <div className="hidden md:flex col-span-12 md:col-span-5 items-center justify-center">
          <div className="rounded-2xl border bg-white shadow-sm p-6 w-64 text-center">
            <div className="text-neutral-900 font-semibold">hasta</div>
            <div className="text-5xl font-black text-blue-500 leading-none">
              6
            </div>
            <div className="text-2xl font-bold text-blue-500 -mt-1">cuotas</div>
            <div className="mt-3 inline-block bg-black text-white text-sm font-semibold rounded-lg px-3 py-1">
              sin interés
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
