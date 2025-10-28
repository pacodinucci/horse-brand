"use client";

import { useCallback, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "../navbar/mobile-navbar";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { Navbar } from "../navbar/navbar";
import { CategoryImageGallery } from "./category-image-gallery";
import { EditorialSection } from "./category-editorial-section";
import { MobileCategoryImageGallery } from "./mobile-category-image-gallery";

export const CategoryView = () => {
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
          <CategoryImageGallery count={3} />
          <CategoryImageGallery count={2} asymetric inverse />
          <CategoryImageGallery count={6} />
          <CategoryImageGallery count={2} asymetric />
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
