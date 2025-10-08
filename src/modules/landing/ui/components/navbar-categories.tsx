"use client";

import {
  Shapes,
  Lamp,
  Armchair,
  Shirt,
  Gem,
  Flame,
  ChevronDown,
} from "lucide-react";
import { useRef, useState } from "react";
import { MegaMenu } from "./mega-menu";

export const CATEGORY_OPTIONS = [
  { name: "Cueros", slug: "cueros", icon: Shapes, hasDropdown: true },
  { name: "Deco", slug: "deco", icon: Lamp, hasDropdown: true },
  { name: "Living", slug: "living", icon: Armchair, hasDropdown: true },
  {
    name: "Bolsos & Carteras",
    slug: "bolsos-y-carteras",
    icon: Shirt,
    hasDropdown: true,
  },
  { name: "Accesorios", slug: "accesorios", icon: Gem, hasDropdown: true },
  {
    name: "SALE",
    slug: "sale",
    icon: Flame,
    highlightClass: "text-red-600",
    hasDropdown: false,
  },
] as const;

export const NavbarCategories = () => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (slug: string | null) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveSlug(slug);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveSlug(null), 120);
  };

  return (
    <div className="relative">
      <nav className="flex items-center gap-8 text-lg text-neutral-200">
        {CATEGORY_OPTIONS.map(({ name, slug, icon: Icon, hasDropdown }) => (
          <a
            key={slug}
            href={`/${slug}`}
            className={`flex items-center gap-2 font-medium hover:opacity-80`}
            onMouseEnter={() => (hasDropdown ? open(slug) : open(null))}
            onMouseLeave={scheduleClose}
          >
            <Icon className="h-5 w-5" />
            <span className="uppercase tracking-wide">{name}</span>
            {hasDropdown && <ChevronDown className="h-3 w-3 opacity-60" />}
          </a>
        ))}
      </nav>

      <MegaMenu
        open={!!activeSlug}
        slug={activeSlug}
        onMouseEnter={() => open(activeSlug)}
        onMouseLeave={scheduleClose}
      />
    </div>
  );
};
