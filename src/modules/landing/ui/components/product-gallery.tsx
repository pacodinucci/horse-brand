import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[] | undefined;
  name: string | undefined;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!images?.length) return null;

  return (
    <div className="flex items-start gap-4">
      {/* Imagen principal */}
      <div className="relative w-80 h-80 bg-neutral-100 flex items-center justify-center rounded-xl border shadow overflow-hidden">
        <Image
          src={images[selectedIdx]}
          alt={name || "Imagen"}
          fill
          className="object-contain rounded-xl"
          sizes="320px"
          priority
        />
      </div>

      {/* Miniaturas con scroll si hay muchas */}
      <div
        className="
          flex flex-col gap-3 max-h-80 overflow-y-auto scrollbar-hide
          pr-1
        "
        style={{ maxHeight: 320 }}
      >
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-24 h-24 border rounded-lg overflow-hidden p-1 bg-white transition ring-2
              ${
                selectedIdx === idx
                  ? "border-[var(--var-brown)] ring-[var(--var-brown)]"
                  : "border-neutral-200 ring-transparent"
              }`}
            tabIndex={0}
            type="button"
            style={{ minWidth: 96, minHeight: 96 }}
          >
            <Image
              src={src}
              alt={`${name} miniatura ${idx + 1}`}
              fill
              className="object-cover rounded"
              sizes="96px"
            />
          </button>
        ))}
      </div>
      {/* 
        Si querés las miniaturas a la derecha, está perfecto el flex-col.
        Si las querés abajo, cambiá a flex-row y max-w en vez de max-h.
      */}
    </div>
  );
}
