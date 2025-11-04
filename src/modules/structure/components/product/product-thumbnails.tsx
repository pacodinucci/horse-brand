"use client";

import Image from "next/image";

type Thumbnail = {
  src: string;
  alt?: string;
};

type Props = {
  images: Thumbnail[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function ProductThumbnails({
  images,
  activeIndex,
  onSelect,
  className,
}: Props) {
  return (
    <div
      className={[
        // 👇 'group' para poder usar group-hover en los hijos
        "group flex items-end gap-0 opacity-80 hover:opacity-100 transition-opacity mb-10",
        className || "",
      ].join(" ")}
    >
      {images.map((img, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(idx)}
          className="relative group/thumb"
        >
          <div
            className={`
              relative overflow-hidden bg-transparent cursor-pointer
              w-8 h-8 md:w-12 md:h-12
              transition-all
              duration-500
              outline-3
              outline-transparent
              group-hover:outline-zinc-100 
            `}
          >
            <Image
              src={img.src}
              alt={img.alt ?? `Miniatura ${idx + 1}`}
              fill
              className="object-cover"
              sizes="48px"
              draggable={false}
            />
          </div>

          {activeIndex === idx && (
            <span className="absolute inset-x-0 -bottom-[3px] h-[2px] bg-neutral-800" />
          )}
        </button>
      ))}
    </div>
  );
}
