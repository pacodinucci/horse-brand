import { ProductForm } from "@/modules/products/ui/components/product-form";
import { ProdcutIdViewHeader } from "@/modules/products/ui/components/product-id-view-header";
import { ProductIdView } from "@/modules/products/ui/views/product-id-view";
import {
  ProductsViewError,
  ProductsViewLoading,
} from "@/modules/products/ui/views/products-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

interface ProductIdPageProps {
  params: Promise<{ productId: string }>;
}

const ProductIdPage = async ({ params }: ProductIdPageProps) => {
  const { productId } = await params;

  if (productId === "new") {
    return (
      <div className="px-8 py-4">
        <ProdcutIdViewHeader productName="Nuevo Producto" />
        <ProductForm />
      </div>
    );
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductsViewLoading />}>
        <ErrorBoundary errorComponent={ProductsViewError}>
          <ProductIdView productId={productId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductIdPage;
