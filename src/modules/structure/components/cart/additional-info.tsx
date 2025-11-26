"use client";

import Image from "next/image";
import { Truck, RefreshCcw, Lock } from "lucide-react";

export function AdditionalInfo() {
  return (
    <div className="mt-12 space-y-4">
      {/* Tarjeta superior */}
      <section className="bg-zinc-50 px-6 py-5">
        <h4 className="text-sm uppercase tracking-[0.18em] text-neutral-800">
          Información adicional
        </h4>

        <div className="mt-3 h-px bg-neutral-300" />

        <div className="mt-4 flex items-center gap-4">
          {/* imagen tipo caja naranja (podés cambiar src) */}
          <div className="w-16 h-16 relative flex-shrink-0">
            <Image
              src="/orange-box.png" // cambia por la imagen que quieras
              alt="Información adicional"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-sm text-neutral-700 leading-relaxed">
            Acá puede ir información sobre el envío, tiempos de preparación,
            empaques especiales, etc.
          </p>
        </div>
      </section>

      {/* Tarjeta inferior con beneficios */}
      <section className="bg-zinc-50 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-neutral-800">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-6 h-6" />
            <p>Entrega gratuita</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <RefreshCcw className="w-6 h-6" />
            <p>Cambios &amp; devoluciones</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Lock className="w-6 h-6" />
            <p>Pago seguro</p>
          </div>
        </div>
      </section>
    </div>
  );
}
