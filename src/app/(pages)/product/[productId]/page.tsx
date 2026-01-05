import ProductView from "@/modules/structure/components/product/product-view";
import { MobileProductView } from "@/modules/structure/components/product/mobile-product-view";

const Page = ({ params }: { params: { productId: string } }) => {
  const { productId } = params;

  return (
    <div className="relative">
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileProductView productId={params.productId} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <ProductView productId={productId} />
      </div>
    </div>
  );
};

export default Page;
