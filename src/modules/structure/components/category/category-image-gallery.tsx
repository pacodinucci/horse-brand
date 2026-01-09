"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

export type GalleryItem = {
  id: string;
  image: string;
  hoverImages: string[];
  title: string;
  price: string | number;
};

function ItemCard({
  item,
  priority,
  widthClass = "w-[31vw]",
}: {
  item: GalleryItem;
  priority?: boolean;
  widthClass?: string;
}) {
  const router = useRouter();
  const slides = [item.image, ...item.hoverImages].filter(
    (src, i, arr) => arr.indexOf(src) === i
  );

  const track = [slides[slides.length - 1], ...slides, slides[0]];
  const startIdx = slides.length > 1 ? 2 : 1;

  const [idx, setIdx] = useState(startIdx);
  const [isAnimating, setIsAnimating] = useState(false);
  const [jumping, setJumping] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const doubleRaf = (cb: () => void) =>
    requestAnimationFrame(() => requestAnimationFrame(cb));

  const hardSetIndex = (n: number) => {
    setJumping(true);
    setIdx(n);
    doubleRaf(() => setJumping(false));
  };

  const onTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (e) => {
    if (e.currentTarget !== sliderRef.current) return;
    if (e.propertyName !== "transform") return;

    if (idx === 0) {
      hardSetIndex(slides.length);
      setIsAnimating(false);
      return;
    }
    if (idx === slides.length + 1) {
      hardSetIndex(1);
      setIsAnimating(false);
      return;
    }
    setIsAnimating(false);
  };

  const next = () => {
    if (isAnimating || jumping) return;
    setIsAnimating(true);
    setIdx((i) => i + 1);
  };

  const prev = () => {
    if (isAnimating || jumping) return;
    setIsAnimating(true);
    setIdx((i) => i - 1);
  };

  const resetHover = () => {
    setIsAnimating(false);
    hardSetIndex(startIdx);
  };

  return (
    <div className="group select-none">
      <div
        className={`relative mt-6 ${widthClass} aspect-square overflow-hidden bg-zinc-100 cursor-pointer`}
        onMouseLeave={resetHover}
        // onClick={() => router.push("/product")}
        onClick={() => router.push(`/product/${item.id}`)}
      >
        <Image
          src={item.image}
          alt={`${item.title} base`}
          fill
          priority={priority}
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
          <div className="h-full w-full overflow-hidden">
            <div
              ref={sliderRef}
              className={`flex h-full w-full ${
                jumping
                  ? "transition-none"
                  : "transition-transform duration-500 ease-out"
              }`}
              style={{ transform: `translateX(-${idx * 100}%)` }}
              onTransitionEnd={onTransitionEnd}
            >
              {track.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative h-full w-full shrink-0"
                >
                  <Image
                    src={src}
                    alt={`${item.title} ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Anterior"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/85 text-neutral-800 border border-black/10 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <MdOutlineChevronLeft size={20} />
        </button>

        <button
          type="button"
          aria-label="Siguiente"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            next();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/85 text-neutral-800 border border-black/10 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <MdOutlineChevronRight size={20} />
        </button>
      </div>

      <div className="mt-3">
        <h3 className="text-[15px] leading-tight">{item.title}</h3>
        <p className="text-sm text-neutral-600">{item.price}</p>
      </div>
    </div>
  );
}

export const CategoryImageGallery = ({
  items,
  count = 3,
  asymetric = false,
  inverse = false,
}: {
  items: GalleryItem[];
  count?: 2 | 3 | 6;
  asymetric?: boolean;
  inverse?: boolean;
}) => {
  const baseItems = items.slice(0, count);
  const finalItems = inverse ? [...baseItems].reverse() : baseItems;

  const cols =
    count === 2
      ? "flex items-start justify-center mt-0"
      : "grid grid-cols-3 place-items-first mt-28 py-8";

  const gapClass = count === 2 && asymetric ? "gap-x-6 gap-y-3" : "gap-3";

  return (
    <div className={`px-8 bg-zinc-100 ${cols} ${gapClass}`}>
      {finalItems.map((item, i) => {
        const isBig =
          count === 2 && asymetric ? (inverse ? i === 1 : i === 0) : false;

        const widthClass =
          count === 2 && asymetric
            ? isBig
              ? "w-[38vw]"
              : "w-[31vw]"
            : "w-[31vw]";

        return (
          <ItemCard
            key={`${item.title}-${i}`}
            item={item}
            priority={i === 0}
            widthClass={widthClass}
          />
        );
      })}
    </div>
  );
};
