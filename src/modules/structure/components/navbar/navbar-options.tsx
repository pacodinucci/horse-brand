"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import { MenuSection } from "./menu-section";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "500", "600"],
});

type Props = { className?: string };

// Slug fallback mientras tu DB devuelve slug: null
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function NavbarOptions({ className }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.category.getMany.queryOptions({}));

  const categories = data.items ?? [];

  // key del menú = category.id (estable)
  const [activeId, setActiveId] = useState<string | null>(null);

  // ---- Subrayado que crece 1ª vez y luego se traslada ----
  const [underline, setUnderline] = useState({
    left: 0,
    width: 0,
    visible: false,
    mode: "grow" as "grow" | "slide",
  });

  const wrapRef = useRef<HTMLDivElement>(null);

  const underlineTo = (el: HTMLButtonElement) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const left = rect.left - wrapRect.left;
    const targetWidth = rect.width;

    if (underline.mode === "grow" || !underline.visible) {
      setUnderline({ left, width: 0, visible: true, mode: "slide" });
      requestAnimationFrame(() =>
        setUnderline((u) => ({ ...u, width: targetWidth }))
      );
    } else {
      setUnderline((u) => ({
        ...u,
        left,
        width: targetWidth,
        visible: true,
        mode: "slide",
      }));
    }
  };

  // ---- Apertura/cierre del dropdown con tolerancia para mover el mouse ----
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setActiveId(null);
      setUnderline((u) => ({ ...u, visible: false, mode: "grow" }));
    }, 120);
  };
  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  // ---- Top absoluto para que el dropdown ocupe todo el ancho de pantalla ----
  const [dropdownTop, setDropdownTop] = useState<number | null>(null);
  const placeDropdown = () => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDropdownTop(rect.bottom);
  };

  const openMenu = (categoryId: string, el: HTMLButtonElement) => {
    setActiveId(categoryId);
    cancelHide();
    underlineTo(el);
    placeDropdown();
  };

  useEffect(() => {
    if (!activeId) return;
    const onRecalc = () => placeDropdown();
    window.addEventListener("scroll", onRecalc, { passive: true });
    window.addEventListener("resize", onRecalc);
    return () => {
      window.removeEventListener("scroll", onRecalc);
      window.removeEventListener("resize", onRecalc);
    };
  }, [activeId]);

  // armamos los props para MenuSection desde la categoría activa
  const activeSection = useMemo(() => {
    if (!activeId) return null;
    const cat = categories.find((c) => c.id === activeId);
    if (!cat) return null;

    const title = cat.name;
    const catSlug = cat.slug ?? slugify(cat.name);

    return {
      title,
      image: { src: "/chair.png", alt: title },
      links: (cat.subcategories ?? []).map((s) => {
        const subSlug = s.slug ?? slugify(s.name);
        return {
          label: s.name,
          href: `category/${catSlug}/${subSlug}`,
        };
      }),
    };
  }, [activeId, categories]);

  return (
    <div
      ref={wrapRef}
      className={["relative flex items-center text-sm", className].join(" ")}
      onMouseLeave={scheduleHide}
      onMouseEnter={cancelHide}
    >
      {/* Botones */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onMouseEnter={(e) => openMenu(cat.id, e.currentTarget)}
          onFocus={(e) => openMenu(cat.id, e.currentTarget)}
          className={`
            ${poppins.className}
            uppercase text-xs font-semibold tracking-wider cursor-pointer relative py-4 px-8
            text-neutral-800 hover:text-black outline-none
          `}
          onClick={() => router.push(`/category/${cat.id}`)}
        >
          {cat.name}
        </button>
      ))}

      {/* Subrayado único */}
      <span
        style={{
          left: underline.left,
          width: underline.width,
          opacity: underline.visible ? 1 : 0,
          transition:
            underline.mode === "grow"
              ? "width 200ms ease-out, opacity 120ms ease-out"
              : "left 200ms ease-out, opacity 120ms ease-out, width 0ms linear",
        }}
        className="pointer-events-none absolute bottom-0 h-px bg-black"
      />

      {/* Panel dropdown */}
      {activeSection && (
        <div
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          className="fixed left-0 right-0 z-50 bg-zinc-50"
          style={{ top: dropdownTop ?? 0 }}
        >
          <MenuSection {...activeSection} />
        </div>
      )}
    </div>
  );
}
