"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { label: "CARRITO", href: "/structure-hermes/cart" },
  { label: "ENVÍO & PAGO", href: "/structure-hermes/checkout" },
  { label: "CONFIRMACIÓN", href: "/structure-hermes/checkout/confirmation" },
];

export function CheckoutSteps() {
  const pathname = usePathname();

  const foundIndex = STEPS.findIndex((step) => pathname.startsWith(step.href));
  const activeIndex = foundIndex === -1 ? 0 : foundIndex;

  return (
    <div className="w-full py-6">
      {/* Capa de puntos + línea */}
      <div className="relative w-full">
        {/* línea al centro de los puntos */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-300" />

        {/* puntos */}
        <div className="flex">
          {STEPS.map((step, index) => {
            const isActive = index === activeIndex;
            const isCompleted = index < activeIndex; // 👈 solo pasos anteriores

            return (
              <div
                key={step.href}
                className="flex-1 flex justify-center relative z-10"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border bg-zinc-100 flex items-center justify-center",
                    "border-neutral-400",
                    (isActive || isCompleted) &&
                      "bg-neutral-800 border-neutral-800"
                  )}
                >
                  {isCompleted && (
                    <Check className="w-3 h-3 text-zinc-50" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels debajo, centrados bajo cada punto */}
      <div className="mt-2 flex">
        {STEPS.map((step, index) => {
          const isCompletedOrActive = index <= activeIndex;

          return (
            <div key={step.href} className="flex-1 text-center">
              <span
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  "text-neutral-500",
                  isCompletedOrActive && "text-neutral-800"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
