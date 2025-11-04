"use client";

import { useRef, useState } from "react";
import { Navbar } from "../navbar/navbar";
import {
  ProductImagesStrip,
  ProductImagesStripHandle,
} from "./product-image-strip";
import { ProductThumbnails } from "./product-thumbnails";
import { ProductDetail } from "./product-detail";

const stripImages = [
  { src: "/bag.png", alt: "Vista frontal" },
  { src: "/cat8.png", alt: "Vista lateral" },
  { src: "/cat9.png", alt: "Detalle hebilla" },
  { src: "/cat10.png", alt: "Vista detrás" },
];

export const ProductView = () => {
  const stripRef = useRef<ProductImagesStripHandle | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectThumb = (index: number) => {
    setActiveIndex(index);
    stripRef.current?.scrollToIndex(index);
  };
  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full">
        <Navbar />
      </div>
      <div className="relative max-h-screen">
        <ProductImagesStrip ref={stripRef} images={stripImages} />

        {/* thumbnails encima, abajo a la izquierda */}
        <ProductThumbnails
          images={stripImages}
          activeIndex={activeIndex}
          onSelect={handleSelectThumb}
          className="absolute left-6 bottom-6 pointer-events-auto"
        />
      </div>
      <div className="absolute z-40 bg-transparent top-20 right-10 h-full">
        <div className="relative h-full">
          <ProductDetail />
        </div>
      </div>
      <div className="min-h-screen"></div>
      <div className="min-h-screen bg-red-200"></div>
      <div className="min-h-screen bg-red-400"></div>
    </>
  );
};
