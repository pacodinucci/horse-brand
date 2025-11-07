"use client";

import ProductView from "@/modules/structure/components/product/product-view";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileProductView } from "@/modules/structure/components/product/mobile-product-view";
const Page = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative">
      {!isMobile ? <ProductView /> : <MobileProductView />}
    </div>
  );
};

export default Page;
