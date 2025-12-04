"use client";

import ProductView from "@/modules/structure/components/product/product-view";
import { MobileProductView } from "@/modules/structure/components/product/mobile-product-view";

const Page = () => {
  return (
    <div className="relative">
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileProductView />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <ProductView />
      </div>
    </div>
  );
};

export default Page;
