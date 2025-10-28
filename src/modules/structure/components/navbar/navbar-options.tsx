"use client";
import { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import { MenuSection } from "./menu-section";
import { SectionKey, MENU_DATA, MENU_KEYS } from "@/lib/data";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "500", "600"],
});

type Props = { className?: string };

export function NavbarOptions({ className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<SectionKey | null>(null);
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

  const openMenu = (key: SectionKey, el: HTMLButtonElement) => {
    setActiveKey(key);
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
      {MENU_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          onMouseEnter={(e) => openMenu(key, e.currentTarget)}
          onFocus={(e) => openMenu(key, e.currentTarget)}
          className={`
            ${poppins.className}
            uppercase text-xs font-semibold tracking-wider cursor-pointer relative py-4 px-8
            text-neutral-800 hover:text-black outline-none
          `}
        >
          {key}
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
