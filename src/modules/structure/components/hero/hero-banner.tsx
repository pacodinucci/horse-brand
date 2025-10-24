"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const montserrat = Montserrat({
  weight: ["100", "200", "400", "500"],
  subsets: ["latin"],
});

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonLabel?: string;
  buttonLink?: string;
}

export const HeroBanner = ({
  title,
  subtitle,
  imageUrl,
  buttonLabel,
  buttonLink,
}: HeroBannerProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ticking = useRef(false);

  // Detecta móvil según breakpoint Tailwind md (<768px)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);

  // Solo en móviles aplicamos el efecto de scroll
  useEffect(() => {
    if (!isMobile) {
      setScrolled(false);
      return;
    }

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled((window.scrollY || 0) > 0);
        ticking.current = false;
      });
    };

    // Estado inicial por si entra con scroll
    setScrolled((window.scrollY || 0) > 0);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  return (
    <section
      className="relative w-full h-[95svh] min-h-[480px] max-h-[820px] overflow-hidden"
      aria-label="Hero banner"
    >
      {/* Wrapper que escala SOLO en móvil */}
      <div
        className={[
          "absolute inset-0 will-change-transform",
          isMobile ? "transition-transform duration-300 ease-out" : "",
          isMobile && scrolled ? "scale-115" : "",
        ].join(" ")}
        aria-hidden="true"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 h-full">
        <div className="mx-auto h-full px-6 md:px-8">
          <div className="flex h-full flex-col justify-end pb-10 md:pb-16">
            <h1
              className={`${montserrat.className} text-3xl leading-tight font-light uppercase tracking-wide text-white md:text-5xl drop-shadow`}
            >
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-3 max-w-3xl text-sm md:text-base text-white/90">
                {subtitle}
              </p>
            ) : null}

            {buttonLabel && buttonLink ? (
              <div className="mt-6">
                <Button asChild size="lg" className="shadow-lg">
                  <Link href={buttonLink} aria-label={buttonLabel}>
                    {buttonLabel}
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
