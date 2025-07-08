import { StockListHeader } from "@/modules/stock/ui/components/stock-list-header";
import {
  StockView,
  StockViewError,
  StockViewLoading,
} from "@/modules/stock/ui/views/stock-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

const StockPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.stock.getMany.queryOptions({}));

  return (
    <>
      <StockListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<StockViewLoading />}>
          <ErrorBoundary errorComponent={StockViewError}>
            <StockView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default StockPage;
