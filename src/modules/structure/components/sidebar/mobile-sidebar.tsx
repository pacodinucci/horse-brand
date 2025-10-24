"use client";

import { AiOutlineClose } from "react-icons/ai";
import { PiPlus, PiMapPinLight, PiUserLight } from "react-icons/pi";
import { TbMessageDots } from "react-icons/tb";
import { useMemo } from "react";

import { MENU_DATA, MENU_KEYS } from "@/lib/data";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ open, onClose }: MobileSidebarProps) => {
  const items = useMemo(
    () => MENU_KEYS.map((k) => ({ key: k, label: MENU_DATA[k].title })),
    []
  );

  return (
    <div
      className={`fixed inset-0 z-[100] md:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Overlay (queda tapado si el panel ocupa todo el ancho, lo dejo por consistencia) */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-white/40
              transition-opacity duration-700 ease-out
              will-change-[opacity]
              ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Panel: full width y animación desde la izquierda */}
      <aside
        className={`absolute left-0 top-0 h-full w-full
        bg-[#F6F0E7] text-neutral-900 shadow-xl
        transition-all duration-300 ease-out
        ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de colecciones"
      >
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-black/10">
          <h2 className="text-2xl tracking-wide">Colecciones</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 -mr-2 rounded-md hover:bg-black/5"
          >
            <AiOutlineClose size={22} />
          </button>
        </header>

        {/* Lista principal */}
        <nav className="h-[calc(100%-16rem)] overflow-y-auto px-6 py-4 space-y-1">
          {items.map((it) => (
            <button
              key={it.key}
              className="w-full flex items-center justify-between py-2 text-xs tracking-wider uppercase"
            >
              <span>{it.label}</span>
              <PiPlus size={12} className="shrink-0" />
            </button>
          ))}
        </nav>

        {/* Accesos rápidos inferiores */}
        <div className="mt-auto border-t border-black/10">
          <ul className="px-6 py-6 space-y-5">
            <li className="flex items-center gap-3">
              <PiMapPinLight size={22} />
              <span className="text-[17px]">Encuentre una tienda</span>
            </li>
            <li className="flex items-center gap-3">
              <PiUserLight size={22} />
              <span className="text-[17px]">Mi cuenta</span>
            </li>
            <li className="flex items-center gap-3">
              <TbMessageDots size={22} />
              <span className="text-[17px]">Contacte con nosotros</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
