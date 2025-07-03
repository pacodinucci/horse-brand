import { ProductsListHeader } from "@/modules/products/ui/components/products-list-header";
import {
  ProductsView,
  ProductsViewError,
  ProductsViewLoading,
} from "@/modules/products/ui/views/products-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

const ProductsPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({}));

  return (
    <>
      <ProductsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductsViewLoading />}>
          <ErrorBoundary errorComponent={ProductsViewError}>
            <ProductsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default ProductsPage;
