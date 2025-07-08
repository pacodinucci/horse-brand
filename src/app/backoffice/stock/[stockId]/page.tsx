import { StockForm } from "@/modules/stock/ui/components/stock-form";
import {
  StockIdView,
  StockIdViewError,
  StockIdViewLoading,
} from "@/modules/stock/ui/views/stock-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

interface StockIdPageProps {
  params: Promise<{ stockId: string }>;
}

const StockIdPage = async ({ params }: StockIdPageProps) => {
  const { stockId } = await params;

  if (stockId === "new") {
    return (
      <div>
        <StockForm />
      </div>
    );
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.stock.getOne.queryOptions({
      id: stockId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<StockIdViewLoading />}>
        <ErrorBoundary errorComponent={StockIdViewError}>
          <StockIdView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default StockIdPage;
