import { useCallback, useEffect, useRef, useState } from "react";
import { MobileNavbar } from "../navbar/mobile-navbar";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { MobileImageSlider } from "./mobile-image-slider";
import { ProductDetail } from "./product-detail";
import { Footer } from "../footer/footer";
import { MobileBuyBar } from "./mobile-buy-bar";

const stripImages = [
  { src: "/bag.png", alt: "Vista frontal" },
  { src: "/cat8.png", alt: "Vista lateral" },
  { src: "/cat9.png", alt: "Detalle hebilla" },
  { src: "/cat10.png", alt: "Vista detrás" },
];

export const MobileProductView = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const footerRef = useRef<HTMLDivElement | null>(null);

  const openMenu = useCallback(() => setOpenSidebar(true), []);
  const closeMenu = useCallback(() => setOpenSidebar(false), []);

  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <MobileNavbar onOpenMenu={openMenu} />
      <MobileSidebar open={openSidebar} onClose={closeMenu} />
      <div className="pt-14 bg-zinc-200">
        <MobileImageSlider images={stripImages} />
        <div>
          <ProductDetail />
        </div>
        <MobileBuyBar
          hidden={footerVisible}
          onApplePay={() => {
            // lógica de Apple Pay
          }}
          onAddToCart={() => {
            // lógica para añadir al carrito
          }}
        />
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
};
