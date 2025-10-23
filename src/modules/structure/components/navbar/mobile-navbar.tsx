"use client";

import Link from "next/link";
import Image from "next/image";
import {
  PiMagnifyingGlassThin,
  PiShoppingCartSimpleThin,
  PiUserLight,
} from "react-icons/pi";
import { CiMenuBurger } from "react-icons/ci";
import { useCallback } from "react";

type MobileNavbarProps = {
  /** Logo centrado; por defecto podés poner tu svg en /public/logo.svg */
  logoSrc?: string;
  logoAlt?: string;
  logoHref?: string;
  /** Si el header va sobre una imagen, `transparent` lo hace más sutil */
  transparent?: boolean;
  /** Callbacks para abrir modales/sidebars más adelante */
  onOpenMenu?: () => void;
  onOpenSearch?: () => void;
  onOpenAccount?: () => void;
  onOpenCart?: () => void;
};

export const MobileNavbar = ({
  logoSrc = "/logos/HB lite positivo.svg",
  logoAlt = "Logo",
  logoHref = "/",
  transparent = true,
  onOpenMenu,
  onOpenSearch,
  onOpenAccount,
  onOpenCart,
}: MobileNavbarProps) => {
  // Fallbacks seguros para evitar undefined al clickear
  const noop = useCallback(() => {}, []);
  const _menu = onOpenMenu ?? noop;
  const _search = onOpenSearch ?? noop;
  const _account = onOpenAccount ?? noop;
  const _cart = onOpenCart ?? noop;

  return (
    <header
      role="navigation"
      aria-label="Mobile header"
      className={[
        "md:hidden fixed top-0 left-0 right-0 z-50",
        "supports-[padding:max(0px,env(safe-area-inset-top))]:pt-[env(safe-area-inset-top)]",
        transparent
          ? "bg-white/70 backdrop-blur-sm"
          : "bg-white shadow-sm border-b border-neutral-200",
      ].join(" ")}
    >
      <div className="h-14 px-3 flex items-center justify-between">
        {/* Izquierda: menú + búsqueda */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Abrir menú"
            onClick={_menu}
            className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition"
          >
            <CiMenuBurger className="size-6" />
          </button>
          <button
            aria-label="Buscar"
            onClick={_search}
            className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition"
          >
            <PiMagnifyingGlassThin className="size-6" />
          </button>
        </div>

        {/* Centro: logo */}
        <div className="shrink-0">
          <Link href={logoHref} aria-label="Ir al inicio" className="block">
            {/* Ajustá width/height al alto real de tu logo */}
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={80}
              height={0}
              // className="w-auto"
              priority
            />
          </Link>
        </div>

        {/* Derecha: cuenta + bolsa */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Mi cuenta"
            onClick={_account}
            className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition"
          >
            <PiUserLight className="size-6" />
          </button>
          <button
            aria-label="Carrito"
            onClick={_cart}
            className="relative p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition"
          >
            <PiShoppingCartSimpleThin className="size-6" />
            {/* Badge de cantidad (opcional, oculto por defecto) */}
            {/* <span className="absolute -top-0.5 -right-0.5 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-black text-white">2</span> */}
          </button>
        </div>
      </div>
    </header>
  );
};
