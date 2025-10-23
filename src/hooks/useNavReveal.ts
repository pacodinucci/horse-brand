"use client";
import { useEffect, useRef, useState } from "react";

type Mode = "full" | "options";

/**
 * Modo:
 * - "full": al scrollear hacia arriba o estar cerca del tope
 * - "options": al scrollear hacia abajo
 */
export function useNavReveal(topThreshold = 80, delta = 4) {
  const [mode, setMode] = useState<Mode>("full");
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const diff = y - lastY.current;

        // poco movimiento = no cambiamos estado para evitar jitter
        if (Math.abs(diff) >= delta) {
          if (diff < 0) {
            // subiendo
            setMode("full");
          } else {
            // bajando
            setMode(y > topThreshold ? "options" : "full");
          }
          lastY.current = y;
        }

        ticking.current = false;
      });
    };

    // estado inicial
    lastY.current = window.scrollY || 0;
    setMode((lastY.current ?? 0) > topThreshold ? "options" : "full");

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [topThreshold, delta]);

  return mode;
}
