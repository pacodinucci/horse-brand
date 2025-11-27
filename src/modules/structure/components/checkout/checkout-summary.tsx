"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

export const CheckoutSummary = () => {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [isOpen, setIsOpen] = useState(false);

  // ref para medir la altura del contenido colapsable
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [cartItems.length, isOpen]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const formatCurrency = (value: number) =>
    value.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleQtyChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(id, quantity);
  };

  return (
    <div className="bg-zinc-50 px-6 py-4 text-sm self-start">
      {/* HEADER RESUMEN */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-neutral-800"
      >
        <span>Resumen</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-500",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div className="h-px bg-[#e8dccb] mt-3 mb-0" />

      {/* CONTENIDO COLAPSABLE CON TRANSICIÓN */}
      <div
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-500 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        style={{
          maxHeight: isOpen ? contentHeight : 0,
        }}
      >
        {/* Texto cantidad */}
        <p className="mt-4 mb-3 text-[12px] text-neutral-600">
          {itemCount === 1
            ? "Tiene 1 artículo en su carrito."
            : `Tiene ${itemCount} artículos en su cesta.`}
        </p>

        {/* Items */}
        <div className="space-y-4 mb-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b border-[#e8dccb]"
            >
              {/* Imagen */}
              <div className="relative w-20 h-20 bg-neutral-200 overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Info + qty */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between gap-2">
                  <div className="text-[13px] text-neutral-800">
                    <p>{item.name}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-neutral-500 hover:text-neutral-800"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-2 inline-flex border border-[#d7d0c6] text-[10px] w-20">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center border-r border-[#d7d0c6] leading-none"
                  >
                    -
                  </button>

                  <span className="w-8 h-7 flex items-center justify-center border-r border-[#d7d0c6] leading-none">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center leading-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Precio por línea */}
              <div className="min-w-[80px] text-right text-[13px]">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBTOTAL */}
      <div className="flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.18em] text-neutral-700">
        <span>Subtotal</span>
        <span className="text-[13px]">{formatCurrency(subtotal)}</span>
      </div>

      {/* ENVÍO */}
      <div className="py-3 border-t border-[#e8dccb]">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-neutral-700">
          <span>Envío</span>
          <span className="text-[13px]">-</span>
        </div>
        <p className="mt-1 text-[11px] text-neutral-500">
          Los gastos de envío se calcularán en el momento del pago
        </p>
      </div>

      {/* TOTAL */}
      <div className="flex items-center justify-between border-t border-[#e8dccb] pt-3 mt-3 text-[11px] uppercase tracking-[0.18em] text-neutral-800">
        <span>Total</span>
        <span className="text-[13px] font-medium">
          {formatCurrency(subtotal)}
        </span>
      </div>
    </div>
  );
};
