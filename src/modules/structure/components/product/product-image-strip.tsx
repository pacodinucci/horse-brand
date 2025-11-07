"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  MouseEvent,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ProductThumbnails } from "./product-thumbnails";

type ProductImage = {
  src: string;
  alt?: string;
};

type Props = {
  images: ProductImage[];
  className?: string;
};

export type ProductImagesStripHandle = {
  scrollToIndex: (index: number) => void;
};

const MAX_OVERSHOOT = 80;
const FRICTION = 0.92;
const MIN_SCROLL_VELOCITY = 0.1;

export const ProductImagesStrip = forwardRef<ProductImagesStripHandle, Props>(
  ({ images, className }, ref) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);

    const [dragging, setDragging] = useState(false);
    const lastXRef = useRef<number | null>(null);
    const scrollVelocityRef = useRef(0);

    const overshootRef = useRef(0);
    const inertiaRafRef = useRef<number | null>(null);
    const overshootRafRef = useRef<number | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const stopAnimations = () => {
      if (inertiaRafRef.current != null) {
        cancelAnimationFrame(inertiaRafRef.current);
        inertiaRafRef.current = null;
      }
      if (overshootRafRef.current != null) {
        cancelAnimationFrame(overshootRafRef.current);
        overshootRafRef.current = null;
      }
    };

    const applyOvershootTransform = () => {
      if (!trackRef.current) return;
      trackRef.current.style.transform = `translateX(${overshootRef.current}px)`;
    };

    const startScrollInertia = () => {
      const el = scrollRef.current;
      if (!el) return;

      const step = () => {
        const el = scrollRef.current;
        if (!el) return;

        const v = scrollVelocityRef.current;
        if (Math.abs(v) < MIN_SCROLL_VELOCITY) {
          scrollVelocityRef.current = 0;
          inertiaRafRef.current = null;
          return;
        }

        const maxScroll = el.scrollWidth - el.clientWidth;

        el.scrollLeft -= v;
        scrollVelocityRef.current = v * FRICTION;

        if (el.scrollLeft < 0) el.scrollLeft = 0;
        if (el.scrollLeft > maxScroll) el.scrollLeft = maxScroll;

        inertiaRafRef.current = requestAnimationFrame(step);
      };

      inertiaRafRef.current = requestAnimationFrame(step);
    };

    const startOvershootSpring = () => {
      const step = () => {
        const current = overshootRef.current;
        if (Math.abs(current) < 0.5) {
          overshootRef.current = 0;
          applyOvershootTransform();
          overshootRafRef.current = null;
          return;
        }

        overshootRef.current = current * 0.8;
        applyOvershootTransform();
        overshootRafRef.current = requestAnimationFrame(step);
      };

      if (overshootRafRef.current == null) {
        overshootRafRef.current = requestAnimationFrame(step);
      }
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      if (!scrollRef.current) return;
      setDragging(true);
      lastXRef.current = e.clientX;
      scrollVelocityRef.current = 0;
      stopAnimations();
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!dragging || !el) return;

      const x = e.clientX;
      const lastX = lastXRef.current ?? x;
      const dx = x - lastX;
      lastXRef.current = x;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const atLeft = el.scrollLeft <= 0;
      const atRight = el.scrollLeft >= maxScroll;

      if (atLeft && dx > 0) {
        overshootRef.current += dx * 0.6;
        if (overshootRef.current > MAX_OVERSHOOT) {
          overshootRef.current = MAX_OVERSHOOT;
        }
        scrollVelocityRef.current = 0;
      } else if (atRight && dx < 0) {
        overshootRef.current += dx * 0.6;
        if (overshootRef.current < -MAX_OVERSHOOT) {
          overshootRef.current = -MAX_OVERSHOOT;
        }
        scrollVelocityRef.current = 0;
      } else {
        el.scrollLeft -= dx;
        scrollVelocityRef.current = -dx;
        overshootRef.current *= 0.5;
      }

      applyOvershootTransform();
    };

    const stopDrag = () => {
      if (!dragging) return;
      setDragging(false);
      lastXRef.current = null;

      startScrollInertia();
      startOvershootSpring();
    };

    const scrollToIndex = (index: number) => {
      const container = scrollRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      stopAnimations();
      overshootRef.current = 0;
      applyOvershootTransform();

      const figures = Array.from(
        track.querySelectorAll("figure")
      ) as HTMLElement[];

      const target = figures[index];
      if (!target) return;

      container.scrollTo({
        left: target.offsetLeft,
        behavior: "smooth",
      });
    };

    useImperativeHandle(ref, () => ({
      scrollToIndex,
    }));

    const handleSelectThumbnail = (index: number) => {
      setActiveIndex(index);
      scrollToIndex(index);
    };

    return (
      <div
        className={[
          "w-full relative", // 👈 relative para posicionar las thumbs encima
          className || "",
        ].join(" ")}
      >
        {/* Strip scrolleable con drag + inercia */}
        <section
          ref={scrollRef}
          className="w-full overflow-x-auto select-none no-scrollbar"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <div ref={trackRef} className="flex">
            {images.map((img, idx) => (
              <figure
                key={idx}
                className="relative flex-none w-[55vw] md:w-[38vw] aspect-[3/4] bg-neutral-100"
              >
                <Image
                  src={img.src}
                  alt={img.alt ?? `Image ${idx + 1}`}
                  fill
                  draggable={false}
                  className="object-cover pointer-events-none"
                  sizes="(min-width: 1024px) 38vw, 55vw"
                  priority={idx === 0}
                />
              </figure>
            ))}

            <div className="flex-none w-[55vw] md:w-[28vw]" />
          </div>
        </section>

        {/* Miniaturas encima, esquina inferior izquierda */}
        <div className="absolute left-4 bottom-4 z-10">
          <ProductThumbnails
            images={images}
            activeIndex={activeIndex}
            onSelect={handleSelectThumbnail}
          />
        </div>
      </div>
    );
  }
);

ProductImagesStrip.displayName = "ProductImagesStrip";
