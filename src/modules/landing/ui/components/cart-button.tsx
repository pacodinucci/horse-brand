"use client";

import { useCartStore } from "@/store/cart";
import { ShoppingCart, Trash2Icon } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botón carrito */}
      <button className="relative flex items-center">
        <ShoppingCart className="w-7 h-7 text-neutral-700" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 text-xs font-bold bg-[var(--var-brown)] text-white rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
      {/* Dropdown del carrito */}
      {open && (
        <div className="absolute right-0 z-30 mt-3 w-[370px] rounded-xl bg-white border shadow-2xl p-4 flex flex-col gap-3">
          <span className="text-base font-semibold mb-2">
            Carrito ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
          {cartItems.length === 0 ? (
            <span className="text-sm text-neutral-500 py-4 text-center">
              Carrito vacío.
            </span>
          ) : (
            <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b py-2 relative"
                >
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-neutral-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="object-cover w-14 h-14"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-neutral-200" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-neutral-900">
                      {item.name}
                    </span>
                    <span className="text-xs text-neutral-700">
                      {item.attributes &&
                        Object.entries(item.attributes).map(
                          ([k, v]) => `${k}: ${v} `
                        )}
                    </span>
                    <span className="text-sm text-neutral-800">
                      x{item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-semibold text-sm mr-4">
                      ${item.price?.toLocaleString("es-AR")}
                    </div>
                    {/* Botón eliminar */}
                    <Button
                      variant={"link"}
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-400 hover:text-[var(--var-red)] transition"
                      title="Quitar del carrito"
                    >
                      <Trash2Icon size={18} />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-col gap-2">
            <Link
              href="/cart"
              className="block text-center py-2 bg-[var(--var-brown)] text-white rounded-lg hover:brightness-110 font-semibold"
            >
              Ir al carrito
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
