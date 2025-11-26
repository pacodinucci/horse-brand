"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const CartComponent = () => {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = cartItems.reduce(
    (acc: number, item) => acc + item.price * item.quantity,
    0
  );

  const shipping: number = 0;
  const total = subtotal + shipping;

  // --- Estado HACER UN REGALO ---
  const [isGift, setIsGift] = useState(false);
  const [giftOption, setGiftOption] = useState<"blank" | "message">("blank");
  const [hidePrice, setHidePrice] = useState(false);

  return (
    <div className="pb-12">
      <div className="flex">
        <div className="flex-1 bg-zinc-50 px-4 py-6 mt-12">
          <h3 className="text-lg text-neutral-500 max-w-xs">
            Tenés {cartItems.length}{" "}
            {cartItems.length === 1 ? "producto" : "productos"} en el carrito
          </h3>

          <table className="w-full mb-6 border-t">
            <tbody>
              {cartItems.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-neutral-500"
                  >
                    El carrito está vacío.
                  </td>
                </tr>
              )}

              {cartItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-6 flex items-center gap-4">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      width={54}
                      height={54}
                      className="rounded"
                    />
                    <span className="text-base font-medium">{item.name}</span>
                  </td>

                  <td className="py-6">
                    <div className="flex items-center justify-center border border-[var(--var-brown)] w-[60%] py-1 px-2 rounded-sm">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-0 text-[var(--var-brown)]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-0 text-[var(--var-brown)]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>

                  <td className="py-6 text-right text-xl font-semibold">
                    $
                    {item.price.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="py-6 text-center">
                    <button
                      className="text-neutral-400 hover:text-[var(--var-brown)]"
                      title="Eliminar"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- RESUMEN: SUBTOTAL / ENVÍO / TOTAL --- */}
          {cartItems.length > 0 && (
            <div className="pt-6 space-y-4 text-sm">
              {/* SUBTOTAL */}
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-[0.18em] text-neutral-700">
                  Subtotal
                </span>
                <span className="text-lg font-semibold">
                  $
                  {subtotal.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* ENVÍO */}
              <div className="flex justify-between items-start border-t pt-4">
                <div>
                  <span className="uppercase tracking-[0.18em] text-neutral-700">
                    Envío
                  </span>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Los gastos de envío se calcularán en el momento del pago.
                  </p>
                </div>
                <span className="text-lg font-semibold">
                  {shipping === 0
                    ? "-"
                    : `$${shipping.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}`}
                </span>
              </div>

              {/* TOTAL */}
              <div className="flex justify-between items-center border-t pt-4">
                <span className="uppercase tracking-[0.18em] text-neutral-900">
                  Total
                </span>
                <span className="text-xl font-semibold">
                  $
                  {total.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* -------- HACER UN REGALO -------- */}
      <div className="mt-6 bg-zinc-50">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-[0.18em] text-neutral-700">
              Hacer un regalo
            </span>

            {/* ✅ checkbox nativo, pero con tamaño/borde ajustado */}
            <label className="cursor-pointer">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="w-4 h-4 border border-neutral-700 accent-neutral-800"
              />
            </label>
          </div>

          {/* línea fina solo cuando está abierto */}
          {isGift && <div className="mt-3 h-px bg-neutral-300" />}
        </div>

        {isGift && (
          <div className="px-4 pb-4 pt-1 text-sm text-neutral-800">
            {/* opción 1: tarjeta en blanco */}
            <button
              type="button"
              onClick={() => setGiftOption("blank")}
              className="w-full flex items-center gap-3 py-3"
            >
              <span className="inline-flex w-4 h-4 rounded-full border border-neutral-700 items-center justify-center">
                {giftOption === "blank" && (
                  <span className="w-2 h-2 rounded-full bg-neutral-800" />
                )}
              </span>
              <span>Tarjeta en blanco</span>
            </button>

            {/* opción 2: mensaje personal */}
            <button
              type="button"
              onClick={() => setGiftOption("message")}
              className="w-full flex items-center gap-3 py-3 border-t border-neutral-200"
            >
              <span className="inline-flex w-4 h-4 rounded-full border border-neutral-700 items-center justify-center">
                {giftOption === "message" && (
                  <span className="w-2 h-2 rounded-full bg-neutral-800" />
                )}
              </span>
              <span>Mensaje personal</span>
            </button>

            {/* ocultar precio en factura: también checkbox nativo */}
            <label className="w-full flex items-center gap-3 py-3 border-t border-neutral-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hidePrice}
                onChange={(e) => setHidePrice(e.target.checked)}
                className="w-4 h-4 border border-neutral-700 accent-neutral-800"
              />
              <span>Ocultar el precio en la factura</span>
            </label>
          </div>
        )}
      </div>

      {/* -------- BOTONES DE PAGO -------- */}
      <div className="mt-8 bg-zinc-50 px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {/* REALIZAR PEDIDO */}
          <Button
            type="button"
            className="
            px-10 py-3 rounded-sm
        bg-zinc-800 text-white
        text-[11px] tracking-[0.18em] uppercase
        hover:bg-neutral-900
        transition-colors cursor-pointer
      "
          >
            Realizar pedido
          </Button>

          {/* Apple Pay */}
          {/* <Button
            type="button"
            className="
            px-10 py-3 rounded-md
            border border-neutral-700 bg-transparent
            text-sm text-neutral-900
            flex items-center justify-center gap-2
            hover:bg-neutral-100
            transition-colors
            "
            >
            <span className="text-xl leading-none"></span>
            <span className="text-base">Pay</span>
          </Button> */}
        </div>
      </div>
      {/* -------- FIN BOTONES DE PAGO -------- */}
    </div>
  );
};
