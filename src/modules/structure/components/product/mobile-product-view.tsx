"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MobileNavbar } from "../navbar/mobile-navbar";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { MobileImageSlider } from "./mobile-image-slider";
import { ProductDetail } from "./product-detail";
import { Footer } from "../footer/footer";
import { MobileBuyBar } from "./mobile-buy-bar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

// Ideal: importalos desde un lugar común (ej: modules/structure/constants/images.ts)
const PRODUCT_PLACEHOLDER_IMAGES = [
  "/cat1.png",
  "/cat2.png",
  "/cat3.png",
  "/cat4.png",
  "/cat5.png",
  "/cat6.png",
  "/cat7.png",
  "/cat8.png",
  "/cat9.png",
  "/cat10.png",
  "/cat11.png",
  "/cat12.png",
];

function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickStableImages(productId: string, pool: string[], count = 4) {
  if (!pool.length) return [];
  const seed = hashStringToNumber(productId);
  const out: string[] = [];
  const used = new Set<number>();

  // aseguramos que no se repitan tanto (por si count < pool)
  for (let i = 0; i < count; i++) {
    let idx = (seed + i * 31) % pool.length;
    // pequeña corrección si colisiona
    while (used.has(idx) && used.size < pool.length) {
      idx = (idx + 1) % pool.length;
    }
    used.add(idx);
    out.push(pool[idx]);
  }

  return out;
}

interface MobileProductViewProps {
  productId: string;
}

export const MobileProductView = ({ productId }: MobileProductViewProps) => {
  const trpc = useTRPC();

  // 1) Traemos el producto por id
  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  // 2) Armamos imágenes para slider (si no hay images en DB, placeholders estables)
  const sliderImages = useMemo(() => {
    const imgs =
      product.images && product.images.length > 0
        ? product.images
        : pickStableImages(product.id, PRODUCT_PLACEHOLDER_IMAGES, 4);

    return imgs.map((src, i) => ({
      src,
      alt: `${product.name} ${i + 1}`,
    }));
  }, [product]);

  const [openSidebar, setOpenSidebar] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const footerRef = useRef<HTMLDivElement | null>(null);

  const openMenu = useCallback(() => setOpenSidebar(true), []);
  const closeMenu = useCallback(() => setOpenSidebar(false), []);

  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setFooterVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.1 }
    );

    observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <MobileNavbar onOpenMenu={openMenu} />
      <MobileSidebar open={openSidebar} onClose={closeMenu} />

      <div className="pt-14 bg-zinc-200">
        <MobileImageSlider images={sliderImages} />

        <div className="px-4 py-4">
          {/* 3) ProductDetail ahora recibe el producto real + una imagen “hero” */}
          <ProductDetail product={product} heroImage={sliderImages[0]?.src} />
        </div>

        <MobileBuyBar
          hidden={footerVisible}
          onApplePay={() => {
            // TODO: lógica de Apple Pay
          }}
          onAddToCart={() => {
            // Ideal: que ProductDetail exporte/reciba callback
            // o repetís acá la lógica usando useCartStore.
          }}
        />
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
};
