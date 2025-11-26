"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "CARRITO", href: "/cart" },
  { label: "ENVÍO & PAGO", href: "/checkout" },
  { label: "CONFIRMACIÓN", href: "/checkout/confirmation" },
];

export function CheckoutSteps() {
  const pathname = usePathname();

  const currentIndex =
    STEPS.findIndex((step) => pathname.startsWith(step.href)) ?? 0;
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

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

            return (
              <div
                key={step.href}
                className="flex-1 flex justify-center relative z-10"
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full border bg-zinc-100",
                    "border-neutral-400",
                    isActive && "bg-neutral-800 border-neutral-800"
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels debajo, centrados bajo cada punto */}
      <div className="mt-2 flex">
        {STEPS.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <div key={step.href} className="flex-1 text-center">
              <span
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  "text-neutral-500",
                  isActive && "text-neutral-800"
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
