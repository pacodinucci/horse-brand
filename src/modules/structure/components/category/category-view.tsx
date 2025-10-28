"use client";

import { useCallback, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "../navbar/mobile-navbar";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { Navbar } from "../navbar/navbar";
import { CategoryImageGallery } from "./category-image-gallery";

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
      <div className="min-h-screen bg-zinc-100">
        <CategoryImageGallery count={3} />
        <CategoryImageGallery count={2} asymetric inverse />
        <CategoryImageGallery count={6} />
        <CategoryImageGallery count={2} asymetric />
      </div>
    </div>
  );
};
