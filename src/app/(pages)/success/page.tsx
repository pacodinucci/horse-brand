"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useCartStore } from "@/store/cart";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const clearCart = useCartStore((s) => s.clearCart);
  const trpc = useTRPC();

  // Evita doble ejecución (Strict Mode dev)
  const clearedRef = useRef(false);

  const q = trpc.orders.verifyPayment.queryOptions({
    orderId: orderId ?? "",
  });

  const { data } = useQuery({
    ...q,
    enabled: Boolean(orderId),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (clearedRef.current) return;

    if (data?.ok && data.paymentStatus === "PAID") {
      clearedRef.current = true;
      clearCart();
    }
  }, [data, clearCart]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Gracias por tu compra</h1>

      {!orderId ? (
        <p className="mt-2 text-sm text-destructive">
          Falta orderId en la URL.
        </p>
      ) : data?.ok === false ? (
        <p className="mt-2 text-sm text-destructive">Orden no encontrada.</p>
      ) : data?.ok ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Estado de pago:{" "}
          <span className="font-medium">{data.paymentStatus}</span>
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Verificando pago…</p>
      )}
    </div>
  );
}
