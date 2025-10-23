"use client";
import { useEffect, useRef, useState } from "react";
import { useSticky } from "@/hooks/useSticky";
import { NavbarMain } from "./navbar-main";
import { NavbarOptions } from "./navbar-options";

export function Navbar() {
  const isSticky = useSticky();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Dirección de scroll
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  // scrollY para el latch
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const delta = 6;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setScrollY(y);
        const diff = y - lastY.current;
        if (Math.abs(diff) >= delta) {
          setIsScrollingUp(diff < 0);
          lastY.current = y;
        }
        ticking.current = false;
      });
    };
    lastY.current = window.scrollY || 0;
    setScrollY(lastY.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // medir altura real del Main
  const mainRef = useRef<HTMLDivElement>(null);
  const [mainH, setMainH] = useState(0);
  useEffect(() => {
    const update = () => setMainH(mainRef.current?.offsetHeight ?? 0);
    update();
    const ro = new ResizeObserver(update);
    if (mainRef.current) ro.observe(mainRef.current);
    return () => ro.disconnect();
  }, []);

  // LATCH: si las options se fijaron, mantenerlas fijas hasta volver al tope real
  const [optionsFixed, setOptionsFixed] = useState(false);
  useEffect(() => {
    if (isSticky) setOptionsFixed(true);
    else if (scrollY <= 1) setOptionsFixed(false);
  }, [isSticky, scrollY]);

  const isOptionsFixed = isSticky || optionsFixed;

  // Main: fijo solo cuando las options están fijas; visible solo al scrollear hacia arriba
  const mainIsFixed = isOptionsFixed;
  const mainIsVisible = isOptionsFixed && isScrollingUp;

  // -----
  const prevOptionsFixed = useRef(false);
  const [suppressDownTransition, setSuppressDownTransition] = useState(false);

  useEffect(() => {
    // Entró a fixed (isOptionsFixed: false -> true) y estamos bajando
    if (!prevOptionsFixed.current && isOptionsFixed && !isScrollingUp) {
      setSuppressDownTransition(true);
      // En el próximo frame volvemos a habilitar transiciones
      requestAnimationFrame(() => setSuppressDownTransition(false));
    }
    prevOptionsFixed.current = isOptionsFixed;
  }, [isOptionsFixed, isScrollingUp]);

  // ----

  return (
    <nav className="hidden md:flex w-full bg-zinc-50 flex-col items-stretch justify-between">
      {/* NavbarMain sin opacidad: solo translateY */}
      <div
        ref={mainRef}
        className={[
          "w-full",
          mainIsFixed
            ? [
                "fixed top-0 left-0 z-50 bg-zinc-50",
                suppressDownTransition
                  ? "transition-none -translate-y-full"
                  : "transition-transform duration-300 ease-out",
              ].join(" ")
            : "",
          !mainIsFixed
            ? ""
            : mainIsVisible
            ? "translate-y-0"
            : "-translate-y-full",
        ].join(" ")}
      >
        <NavbarMain />
      </div>

      {/* NO hace falta spacer extra: cuando main no es fixed está en flujo ⚡ */}
      <div
        ref={wrapRef}
        className={[
          isOptionsFixed
            ? "fixed top-0 left-0 w-full z-50 bg-zinc-50"
            : "bg-zinc-50",
          "flex justify-center transition-all duration-300 ease-out",
        ].join(" ")}
        style={isOptionsFixed ? { top: mainIsVisible ? mainH : 0 } : undefined}
      >
        <NavbarOptions />
      </div>
    </nav>
  );
}
