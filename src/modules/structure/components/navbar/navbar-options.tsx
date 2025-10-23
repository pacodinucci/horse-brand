"use client";
import { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
// import { MenuSection } from "@/components/MenuSection";
import { MenuSection } from "./menu-section";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

type Props = { className?: string };

const NAV_OPTIONS = [
  "Mujer",
  "Hombre",
  "Joyas",
  "Relojes",
  "Casa",
  "Beauty",
  "Ecuestre",
  "Regalos",
  "Historias",
  "Nosotros",
] as const;

// Contenido por opción (ejemplos; completá el resto)
const MENU_DATA: Record<
  (typeof NAV_OPTIONS)[number],
  Parameters<typeof MenuSection>[0]
> = {
  Mujer: {
    title: "Mujer",
    image: { src: "/chair.png", alt: "Colección Mujer" },
    links: [
      { label: "Bolsos", href: "/mujer/bolsos" },
      { label: "Pequeña marroquinería", href: "/mujer/marroquineria" },
      { label: "Calzado", href: "/mujer/calzado" },
      { label: "Accesorios", href: "/mujer/accesorios" },
    ],
  },
  Hombre: {
    title: "Hombre",
    image: { src: "/chair.png", alt: "Colección Hombre" },
    links: [
      { label: "Marroquinería", href: "/hombre/marroquineria" },
      { label: "Calzado", href: "/hombre/calzado" },
      { label: "Cinturones", href: "/hombre/cinturones" },
      { label: "Accesorios", href: "/hombre/accesorios" },
    ],
  },
  Joyas: {
    title: "Joyas",
    image: { src: "/chair.png", alt: "Joyas" },
    links: [
      { label: "Anillos", href: "/joyas/anillos" },
      { label: "Pulseras", href: "/joyas/pulseras" },
    ],
  },
  Relojes: {
    title: "Relojes",
    image: { src: "/chair.png", alt: "Relojes" },
    links: [
      { label: "Clásicos", href: "/relojes/clasicos" },
      { label: "Deportivos", href: "/relojes/deportivos" },
    ],
  },
  Casa: {
    title: "Casa",
    image: { src: "/chair.png", alt: "Casa" },
    links: [
      { label: "Decoración", href: "/casa/decoracion" },
      { label: "Mesa", href: "/casa/mesa" },
    ],
  },
  Beauty: {
    title: "Beauty",
    image: { src: "/chair.png", alt: "Beauty" },
    links: [
      { label: "Fragancias", href: "/beauty/fragancias" },
      { label: "Cuidado", href: "/beauty/cuidado" },
    ],
  },
  Ecuestre: {
    title: "Ecuestre",
    image: { src: "/chair.png", alt: "Ecuestre" },
    links: [
      { label: "Sillas", href: "/ecuestre/sillas" },
      { label: "Accesorios", href: "/ecuestre/accesorios" },
    ],
  },
  Regalos: {
    title: "Regalos y Petit H",
    image: { src: "/chair.png", alt: "Regalos", caption: "PETIT H" },
    links: [
      { label: "Petit H", href: "/petit-h" },
      { label: "Regalos para mujer", href: "/regalos/mujer" },
      { label: "Regalos para hombre", href: "/regalos/hombre" },
      { label: "Regalos para recién nacidos", href: "/regalos/recien-nacidos" },
    ],
  },
  Historias: {
    title: "Historias",
    image: { src: "/chair.png", alt: "Historias" },
    links: [{ label: "Maison", href: "/historias/maison" }],
  },
  Nosotros: {
    title: "Nosotros",
    image: { src: "/chair.png", alt: "Servicios" },
    links: [{ label: "Nostros", href: "/servicios/cuidado" }],
  },
};

export function NavbarOptions({ className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<
    (typeof NAV_OPTIONS)[number] | null
  >(null);

  // ---- Subrayado que crece 1ª vez y luego se traslada ----
  const [underline, setUnderline] = useState({
    left: 0,
    width: 0,
    visible: false,
    mode: "grow" as "grow" | "slide",
  });

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
      setActiveKey(null);
      setUnderline((u) => ({ ...u, visible: false, mode: "grow" })); // prepara el próximo grow
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

  const openMenu = (
    label: (typeof NAV_OPTIONS)[number],
    el: HTMLButtonElement
  ) => {
    setActiveKey(label);
    cancelHide();
    underlineTo(el);
    placeDropdown();
  };

  useEffect(() => {
    if (!activeKey) return;
    const onRecalc = () => placeDropdown();
    window.addEventListener("scroll", onRecalc, { passive: true });
    window.addEventListener("resize", onRecalc);
    return () => {
      window.removeEventListener("scroll", onRecalc);
      window.removeEventListener("resize", onRecalc);
    };
  }, [activeKey]);

  return (
    <div
      ref={wrapRef}
      className={["relative flex items-center text-sm", className].join(" ")}
      onMouseLeave={scheduleHide}
      onMouseEnter={cancelHide}
    >
      {/* Botones */}
      {NAV_OPTIONS.map((label) => (
        <button
          key={label}
          type="button"
          onMouseEnter={(e) => openMenu(label, e.currentTarget)}
          onFocus={(e) => openMenu(label, e.currentTarget)}
          className={`
            ${poppins.className}
            uppercase tracking-wider cursor-pointer relative py-4 px-8
            text-neutral-800 hover:text-black outline-none
          `}
        >
          {label}
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

      {/* Panel dropdown: ocupa todo el ancho del viewport */}
      {activeKey && (
        <div
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          className="fixed left-0 right-0 z-50 bg-zinc-50"
          style={{ top: dropdownTop ?? 0 }}
        >
          <MenuSection {...MENU_DATA[activeKey]} />
        </div>
      )}
    </div>
  );
}
