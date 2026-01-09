"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CartHeader } from "../cart/cart-header";
import { CheckoutSteps } from "../cart/checkout-steps";

export const TfView = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const orderNumber = useMemo(() => {
    if (!orderId) return null;
    const parts = orderId.split("-");
    return parts[parts.length - 1];
  }, [orderId]);

  return (
    <div className="bg-zinc-100 min-h-screen w-full px-32 pb-24">
      <CartHeader />
      <CheckoutSteps />

      <div className="max-w-2xl mt-12 space-y-8 text-neutral-800">
        <h1 className="text-xl font-medium tracking-wide">
          Transferencia bancaria
        </h1>

        {orderNumber && (
          <div className="bg-white border border-neutral-200 p-5">
            <p className="uppercase text-[12px] tracking-[0.2em] text-neutral-600">
              Número de orden
            </p>
            <p className="text-lg font-medium mt-2">#{orderNumber}</p>
          </div>
        )}

        <p className="text-base leading-relaxed">
          Para finalizar tu compra mediante{" "}
          <strong>transferencia bancaria</strong>, seguí los pasos que se
          detallan a continuación:
        </p>

        <div className="text-base space-y-2">
          <p>
            <strong>Titular:</strong> Nombre del titular
          </p>
          <p>
            <strong>Banco:</strong> Nombre del banco
          </p>
          <p>
            <strong>Tipo de cuenta:</strong> Cuenta corriente
          </p>
          <p>
            <strong>CBU:</strong> XXX XXX XXX XXX XXX XXX XXX
          </p>
          <p>
            <strong>Alias:</strong> alias.ejemplo
          </p>
          <p>
            <strong>CUIT:</strong> XX-XXXXXXXX-X
          </p>
        </div>

        <p className="text-base leading-relaxed">
          Una vez realizada la transferencia, enviá el{" "}
          <strong>comprobante de pago</strong> por email a:
        </p>

        <p className="text-base">
          📧 <strong>pagos@horsebrand.com</strong>
        </p>

        <p className="text-base leading-relaxed">
          En el <strong>asunto del email</strong>, indicá tu número de orden{" "}
          {orderNumber && <strong>#{orderNumber}</strong>} para que podamos
          identificar tu pago correctamente.
        </p>

        <p className="text-sm text-neutral-600 leading-relaxed">
          Importante: tu compra quedará confirmada una vez que recibamos y
          validemos el comprobante de la transferencia. Este proceso puede
          demorar hasta 24 horas hábiles.
        </p>
      </div>
    </div>
  );
};
