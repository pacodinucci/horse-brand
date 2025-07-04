import { CategoryListHeader } from "@/modules/category/ui/components/category-list-header";
import {
  CategoryView,
  CategoryViewError,
} from "@/modules/category/ui/views/category-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

const CategoryPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({}));

  return (
    <>
      <CategoryListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<CategoryViewError />}>
          <ErrorBoundary errorComponent={CategoryViewError}>
            <CategoryView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default CategoryPage;
