"use client";

import Image from "next/image";
import { useState, TouchEvent } from "react";

type Slide = {
  src: string;
  alt?: string;
};

type MobileImageSliderProps = {
  images: Slide[];
  className?: string;
};

export function MobileImageSlider({
  images,
  className,
}: MobileImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  if (!images.length) return null;

  const goTo = (index: number) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setActiveIndex(index);
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const threshold = 40; // px mínimos para considerar swipe

    if (Math.abs(distance) > threshold) {
      if (distance > 0) goNext(); // swipe izquierda → siguiente
      else goPrev(); // swipe derecha → anterior
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className={[
        "relative w-full max-w-sm mx-auto select-none",
        className || "",
      ].join(" ")}
    >
      <div
        className="relative w-full aspect-[24/25] overflow-hidden bg-neutral-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, idx) => (
          <div
            key={img.src + idx}
            className={[
              "absolute inset-0 transition-transform duration-300 ease-out",
              idx === activeIndex
                ? "translate-x-0"
                : idx < activeIndex
                ? "-translate-x-full"
                : "translate-x-full",
            ].join(" ")}
          >
            <Image
              src={img.src}
              alt={img.alt ?? ""}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <div className="pointer-events-auto relative h-4 w-24">
          {images.map((_, idx) => {
            const offset = (idx - activeIndex) * 12;
            const isActive = idx === activeIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Ir a imagen ${idx + 1}`}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
                style={{ left: `calc(50% + ${offset}px)` }}
              >
                <span
                  className={[
                    "block rounded-full transition-all duration-300",
                    isActive
                      ? "w-2 h-2 border border-white bg-transparent"
                      : "w-1.5 h-1.5 bg-white/60",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
