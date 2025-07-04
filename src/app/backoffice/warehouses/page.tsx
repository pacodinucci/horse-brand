import { WarehouseListHeader } from "@/modules/warehouses/ui/components/warehouse-list-header";
import {
  WarehouseView,
  WarehouseViewError,
  WarehouseViewLoading,
} from "@/modules/warehouses/ui/views/warehouses-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

const WarehousePage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.warehouse.getMany.queryOptions({}));

  return (
    <>
      <WarehouseListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<WarehouseViewLoading />}>
          <ErrorBoundary errorComponent={WarehouseViewError}>
            <WarehouseView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default WarehousePage;
