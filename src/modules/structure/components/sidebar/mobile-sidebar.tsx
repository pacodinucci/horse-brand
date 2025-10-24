"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { PiPlus, PiMapPinLight, PiUserLight } from "react-icons/pi";
import { TbMessageDots } from "react-icons/tb";

import { MENU_DATA, MENU_KEYS } from "@/lib/data";
import { poppins } from "@/lib/fonts";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ open, onClose }: MobileSidebarProps) => {
  const items = useMemo(
    () => MENU_KEYS.map((k) => ({ key: k, label: MENU_DATA[k].title })),
    []
  );

  // una abierta a la vez
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = useCallback(
    (k: string) => setOpenKey((curr) => (curr === k ? null : k)),
    []
  );

  return (
    <div
      className={`fixed inset-0 z-[100] md:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Overlay suave */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-white/40
              transition-opacity duration-700 ease-out
              will-change-[opacity]
              ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Panel: full width desde la izquierda */}
      <aside
        className={`absolute left-0 top-0 h-full w-full
        bg-zinc-50 text-neutral-800 shadow-xl
        transition-all duration-300 ease-out
        ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"} ${
          poppins.className
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de colecciones"
      >
        {/* Header fijo */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-zinc-50">
          <h2 className="text-lg uppercase tracking-wider">Colecciones</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 -mr-2 rounded-md hover:bg-black/5"
          >
            <AiOutlineClose size={22} />
          </button>
        </header>

        {/* Contenido scrolleable único */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto px-6 py-2">
          {/* Lista principal con acordeón animado */}
          <nav className="space-y-1">
            {items.map((it) => {
              const isOpen = openKey === it.key;
              const section = MENU_DATA[it.key];
              return (
                <div key={it.key}>
                  <button
                    id={`btn-${it.key}`}
                    aria-expanded={isOpen}
                    aria-controls={`panel-${it.key}`}
                    onClick={() => toggle(it.key)}
                    className={`
                        w-full flex items-center justify-between py-3 uppercase tracking-wider
                        transition-all duration-500
                        ${isOpen ? "text-lg font-medium" : "text-xs"}
                    `}
                    style={{ willChange: "font-size, letter-spacing" }}
                  >
                    <span>{it.label}</span>
                    <PiPlus
                      size={12}
                      className={`shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>

                  <AccordionItem
                    id={`panel-${it.key}`}
                    labelledBy={`btn-${it.key}`}
                    open={isOpen}
                  >
                    <ul className="pl-2 pb-2 space-y-2">
                      {section?.links?.map((l) => (
                        <li key={l.label}>
                          <a
                            href={l.href}
                            className="block text-[11px] normal-case tracking-normal text-neutral-700 hover:text-neutral-900"
                          >
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </AccordionItem>
                </div>
              );
            })}
          </nav>

          {/* Accesos inferiores incluidos en el mismo scroll */}
          <div className="mt-6 pt-4 border-t border-black/10 space-y-5">
            <div className="flex items-center gap-3">
              <PiMapPinLight size={22} />
              <span className="text-xs">Nuestra ubicación</span>
            </div>
            <div className="flex items-center gap-3">
              <PiUserLight size={22} />
              <span className="text-xs">Mi cuenta</span>
            </div>
            <div className="flex items-center gap-3">
              <TbMessageDots size={22} />
              <span className="text-xs">Contacte con nosotros</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

/** Item de acordeón con transición de altura medida (height + opacity) */
function AccordionItem({
  id,
  labelledBy,
  open,
  children,
  duration = 260, // ms
}: {
  id: string;
  labelledBy: string;
  open: boolean;
  children: React.ReactNode;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [rendered, setRendered] = useState(open);

  // Medir contenido y setear altura target
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open) {
      setRendered(true);
      // esperar al siguiente frame para leer scrollHeight estable
      requestAnimationFrame(() => {
        setHeight(el.scrollHeight);
      });
    } else {
      // animar hacia 0 y luego desmontar contenido (rendered=false) al terminar
      setHeight(el.scrollHeight);
      requestAnimationFrame(() => {
        setHeight(0);
      });
      const t = setTimeout(() => setRendered(false), duration);
      return () => clearTimeout(t);
    }
  }, [open, duration]);

  // Si cambia el contenido abierto, ajustamos altura
  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setHeight(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className="overflow-hidden transition-[height,opacity] ease-out"
      style={{
        height: open ? height : 0,
        opacity: open ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {/* Montamos el contenido solo cuando corresponde para evitar tab focus en cerrado */}
      <div ref={ref} className={rendered ? "block" : "hidden"}>
        {children}
      </div>
    </div>
  );
}
