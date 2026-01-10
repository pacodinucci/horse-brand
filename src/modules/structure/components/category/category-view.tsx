"use client";

import { useCallback, useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "../navbar/mobile-navbar";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { Navbar } from "../navbar/navbar";
import { CategoryImageGallery, GalleryItem } from "./category-image-gallery";
import { EditorialSection } from "./category-editorial-section";
import { MobileCategoryImageGallery } from "./mobile-category-image-gallery";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const PRODUCT_PLACEHOLDER_IMAGES = [
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

export function pickStableImages(productId: string, pool: string[], count = 4) {
  if (!pool.length) return [];
  const seed = hashStringToNumber(productId);
  const out: string[] = [];

  for (let i = 0; i < count; i++) {
    const idx = (seed + i * 31) % pool.length;
    out.push(pool[idx]);
  }

  return out;
}

interface CategoryViewProps {
  categoryId: string;
  /** opcional: si viene, filtra por subcategoría */
  subcategoryId?: string;
}

const formatPriceARS = (value: number) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

export const CategoryView = ({
  categoryId,
  subcategoryId,
}: CategoryViewProps) => {
  const trpc = useTRPC();

  // 1) Traemos por categoría (como hoy)
  const { data } = useSuspenseQuery(
    trpc.products.getByCategoryId.queryOptions({
      categoryId,
      page: 1,
      pageSize: 100,
    })
  );

  // 2) Filtramos en cliente si llega subcategoryId (sin romper tu API actual)
  const filteredProducts = useMemo(() => {
    const all = data.items ?? [];
    if (!subcategoryId) return all;

    // Ajustá el campo según tu modelo real:
    // - subcategoryId
    // - subCategoryId
    // - subcategory?.id
    // - subCategory?.id
    return all.filter((p: any) => {
      const direct = p.subcategoryId ?? p.subCategoryId;
      const nested = p.subcategory?.id ?? p.subCategory?.id;
      return (direct ?? nested) === subcategoryId;
    });
  }, [data.items, subcategoryId]);

  const items: GalleryItem[] = useMemo(() => {
    return filteredProducts.map((p: any) => {
      const imgs =
        p.images && p.images.length > 0
          ? p.images
          : pickStableImages(p.id, PRODUCT_PLACEHOLDER_IMAGES, 5);

      const base = imgs[0];
      const hover = imgs.filter((src: string) => src !== base).slice(0, 4);

      return {
        id: p.id,
        image: base,
        hoverImages: hover.length ? hover : [base],
        title: p.name,
        price: typeof p.price === "number" ? formatPriceARS(p.price) : p.price,
      };
    });
  }, [filteredProducts]);

  const isMobile = useIsMobile();
  const [openSidebar, setOpenSidebar] = useState(false);
  const openMenu = useCallback(() => setOpenSidebar(true), []);
  const closeMenu = useCallback(() => setOpenSidebar(false), []);

  return (
    <div className="min-h-[200vh] bg-zinc-100 text-neutral-900">
      {isMobile ? (
        <>
          <MobileNavbar onOpenMenu={openMenu} />
          <MobileSidebar open={openSidebar} onClose={closeMenu} />
        </>
      ) : (
        <div className="absolute top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      )}

      {isMobile ? (
        <div className="min-h-screen bg-zinc-100 pt-14">
          {/* TODO: acá todavía tenés galerías mockeadas.
              Si querés que el filtro por subcategoría aplique también en mobile,
              reemplazá estas secciones por tu data real (items / filteredProducts). */}
          <MobileCategoryImageGallery
            items={[
              { src: "/cat1.png", title: "Producto 1", price: "$100.000" },
              { src: "/cat2.png", title: "Producto 2", price: "$100.000" },
              { src: "/cat4.png", title: "Producto 4", price: "$100.000" },
              { src: "/cat5.png", title: "Producto 5", price: "$100.000" },
            ]}
          />
          <MobileCategoryImageGallery
            items={[
              {
                src: "/cat3.png",
                alt: "Horse Brand",
                title: "Producto 3",
                price: "$100.00",
              },
            ]}
          />
          <MobileCategoryImageGallery
            items={[
              { src: "/cat6.png", title: "Producto 1", price: "$100.000" },
              { src: "/cat7.png", title: "Producto 2", price: "$100.000" },
              { src: "/cat8.png", title: "Producto 4", price: "$100.000" },
              { src: "/cat9.png", title: "Producto 5", price: "$100.000" },
              { src: "/cat10.png", title: "Producto 5", price: "$100.000" },
              { src: "/cat11.png", title: "Producto 5", price: "$100.000" },
            ]}
          />
          <MobileCategoryImageGallery
            items={[
              {
                src: "/cat2.png",
                alt: "Horse Brand",
                title: "Producto 3",
                price: "$100.00",
              },
            ]}
          />
          <EditorialSection
            image={{
              src: "/editorial1.png",
              alt: "Horse Brand Editorial",
              priority: true,
            }}
            title="¡Chapó!"
            subtitle="La elegancia monocromática del accesorio emerge discretamente entre el ritmo frenético de la ciudad."
          />
          <MobileCategoryImageGallery
            items={[
              { src: "/cat6.png", title: "Producto 1", price: "$100.000" },
              { src: "/cat7.png", title: "Producto 2", price: "$100.000" },
              { src: "/cat8.png", title: "Producto 4", price: "$100.000" },
              { src: "/cat9.png", title: "Producto 5", price: "$100.000" },
              { src: "/cat10.png", title: "Producto 5", price: "$100.000" },
              { src: "/cat11.png", title: "Producto 5", price: "$100.000" },
              { src: "/cat1.png", title: "Producto 5", price: "$100.000" },
              { src: "/cat3.png", title: "Producto 5", price: "$100.000" },
              { src: "/cat5.png", title: "Producto 5", price: "$100.000" },
              { src: "/cat8.png", title: "Producto 5", price: "$100.000" },
            ]}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-zinc-100">
          <CategoryImageGallery items={items} count={3} />
          <CategoryImageGallery
            items={items.slice(3)}
            count={2}
            asymetric
            inverse
          />
          <CategoryImageGallery items={items.slice(5)} count={6} />
          <CategoryImageGallery items={items.slice(11)} count={2} asymetric />

          <EditorialSection
            image={{
              src: "/editorial1.png",
              alt: "Horse Brand Editorial",
              priority: true,
            }}
            title="¡Chapó!"
            subtitle="La elegancia monocromática del accesorio emerge discretamente entre el ritmo frenético de la ciudad."
          />
        </div>
      )}
    </div>
  );
};
