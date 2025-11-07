"use client";

import { FaApple } from "react-icons/fa";
// import { HiOutlineShoppingBag } from "react-icons/hi2";

type MobileBuyBarProps = {
  onApplePay?: () => void;
  onAddToCart?: () => void;
  hidden?: boolean;
};

export function MobileBuyBar({
  onApplePay,
  onAddToCart,
  hidden,
}: MobileBuyBarProps) {
  return (
    <div
      className={`
        fixed inset-x-0 bottom-0 z-50
        md:hidden
        border-t border-neutral-200
        bg-neutral-50/95 backdrop-blur
        px-4 pt-3
        pb-[calc(0.75rem+env(safe-area-inset-bottom))]
        transition-transform duration-300
        ${hidden ? "translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="flex gap-3">
        {/* Botón Apple Pay */}
        <button
          type="button"
          onClick={onApplePay}
          className="
            flex-1 h-11
            rounded-sm
            border border-neutral-400
            bg-white
            text-sm font-medium
            flex items-center justify-center
            shadow-[0_0_0_1px_rgba(0,0,0,0.02)]
            active:scale-[0.98] transition space-x-2
          "
        >
          <FaApple />
          <span>Pay</span>
        </button>

        {/* Botón Añadir a mi cesta */}
        <button
          type="button"
          onClick={onAddToCart}
          className="
            flex-1 h-11
            rounded-sm
            bg-neutral-900 text-neutral-50 px-2
            text-xs font-semibold tracking-[0.14em] uppercase
            flex items-center justify-center gap-2
            active:scale-[0.98] transition
          "
        >
          {/* <HiOutlineShoppingBag className="w-4 h-4" /> */}
          <span>Agregar al carrito</span>
        </button>
      </div>
    </div>
  );
}
