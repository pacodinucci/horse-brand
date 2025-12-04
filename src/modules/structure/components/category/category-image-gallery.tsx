"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

type GalleryItem = {
  image: string;
  hoverImages: string[];
  title: string;
  price: string | number;
};

const ITEMS: GalleryItem[] = [
  {
    image: "/cat1.png",
    hoverImages: ["/cat2.png", "/cat1.png", "/cat6.png"],
    title: "Producto 1",
    price: "$ 100.000",
  },
  {
    image: "/cat3.png",
    hoverImages: ["/cat4.png", "/cat3.png"],
    title: "Producto 2",
    price: "$ 100.000",
  },
  {
    image: "/cat5.png",
    hoverImages: ["/cat6.png", "/cat5.png"],
    title: "Producto 3",
    price: "$ 100.000",
  },
  {
    image: "/cat7.png",
    hoverImages: ["/cat8.png", "/cat7.png"],
    title: "Producto 4",
    price: "$ 100.000",
  },
  {
    image: "/cat9.png",
    hoverImages: ["/cat10.png", "/cat9.png"],
    title: "Producto 5",
    price: "$ 100.000",
  },
  {
    image: "/cat11.png",
    hoverImages: ["/cat12.png", "/cat11.png"],
    title: "Producto 6",
    price: "$ 100.000",
  },
];

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
  const slides = item.hoverImages.length ? item.hoverImages : [item.image];
  const track = [slides[slides.length - 1], ...slides, slides[0]];

  // índice visible dentro del track clonado (1..slides.length)
  const [idx, setIdx] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [jumping, setJumping] = useState(false); // ← cuando “saltamos” al real NO hay transición
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // helper: 2 frames para asegurar que el navegador pinte el cambio sin transición
  const doubleRaf = (cb: () => void) =>
    requestAnimationFrame(() => requestAnimationFrame(cb));

  const hardSetIndex = (n: number) => {
    // Apaga transición, cambia índice y sólo después de 2 frames vuelve a habilitarla
    setJumping(true);
    setIdx(n);
    doubleRaf(() => setJumping(false));
  };

  const onTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (e) => {
    // responder SOLO a transform del propio slider
    if (e.currentTarget !== sliderRef.current) return;
    if (e.propertyName !== "transform") return;

    if (idx === 0) {
      // estábamos en el clon izquierdo → saltar al último real sin animar
      hardSetIndex(slides.length);
      setIsAnimating(false);
      return;
    }
    if (idx === slides.length + 1) {
      // estábamos en el clon derecho → saltar al primero real sin animar
      hardSetIndex(1);
      setIsAnimating(false);
      return;
    }
    // transición normal terminada
    setIsAnimating(false);
  };

  const next = () => {
    if (isAnimating || jumping) return;
    setIsAnimating(true);
    setIdx((i) => i + 1); // puede ir a slides.length + 1 (clon). Luego se corrige en onTransitionEnd.
  };

  const prev = () => {
    if (isAnimating || jumping) return;
    setIsAnimating(true);
    setIdx((i) => i - 1); // puede ir a 0 (clon). Luego se corrige en onTransitionEnd.
  };

  const resetHover = () => {
    // Volver silenciosamente al primero real
    setIsAnimating(false);
    hardSetIndex(1);
  };

  return (
    <div className="group select-none">
      <div
        className={`relative mt-6 ${widthClass} aspect-square overflow-hidden bg-zinc-100 cursor-pointer`}
        onMouseLeave={resetHover}
        onClick={() => router.push("/product")}
      >
        {/* Imagen base (reposo) */}
        <Image
          src={item.image}
          alt={`${item.title} base`}
          fill
          priority={priority}
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
        />

        {/* Carrusel en hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
          <div className="h-full w-full overflow-hidden">
            <div
              ref={sliderRef}
              className={`flex h-full w-full ${
                // si estamos “saltando”, no aplicar transición
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

        {/* Controles */}
        <button
          type="button"
          aria-label="Anterior"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/85 text-neutral-800 border border-black/10 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <MdOutlineChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={next}
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
  count = 3,
  asymetric = false,
  inverse = false,
}: {
  count?: 2 | 3 | 6;
  asymetric?: boolean;
  inverse?: boolean;
}) => {
  const baseItems = ITEMS.slice(0, count);
  const items = inverse ? [...baseItems].reverse() : baseItems;

  const cols =
    count === 2
      ? "flex items-start justify-center mt-0"
      : "grid grid-cols-3 place-items-first mt-28 py-8";

  const gapClass = count === 2 && asymetric ? "gap-x-6 gap-y-3" : "gap-3";

  return (
    <div className={`px-8 bg-zinc-100 ${cols} ${gapClass}`}>
      {items.map((item, i) => {
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
            key={i}
            item={item}
            priority={i === 0}
            widthClass={widthClass}
          />
        );
      })}
    </div>
  );
};
