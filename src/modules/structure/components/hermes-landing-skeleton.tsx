"use client";

import { Footer } from "./footer/footer";
import { HeroBanner } from "./hero/hero-banner";
import { Collection } from "./landing/collection";
import { ConceptGrid } from "./landing/concept-grid";
import { Navbar } from "./navbar/navbar";
import { mueblesLiving } from "@/lib/data";
import { carterasBolsos } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "./navbar/mobile-navbar";
import { MobileSidebar } from "./sidebar/mobile-sidebar";
import { useCallback, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function HermesLandingSkeleton() {
  const isMobile = useIsMobile();
  const [openSidebar, setOpenSidebar] = useState(false);
  const openMenu = useCallback(() => setOpenSidebar(true), []);
  const closeMenu = useCallback(() => setOpenSidebar(false), []);

  const { data: session } = authClient.useSession();
  console.log("Session --> ", session);

  return (
    <main className="min-h-[200vh] bg-zinc-100 text-neutral-900">
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
      <HeroBanner title="Horse Brand" imageUrl="/silla-landing.png" />
      <ConceptGrid />
      <Collection {...mueblesLiving} />
      <Collection {...carterasBolsos} className="pb-32" />
      <Footer />
    </main>
  );
}
