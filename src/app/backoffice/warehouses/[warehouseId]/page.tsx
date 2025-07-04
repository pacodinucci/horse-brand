import { WarehouseForm } from "@/modules/warehouses/ui/components/warehouse-form";
import { WarehouseIdView } from "@/modules/warehouses/ui/views/warehouse-id-view";
import {
  WarehouseViewLoading,
  WarehouseViewError,
} from "@/modules/warehouses/ui/views/warehouses-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

interface WarehouseIdPageProps {
  params: Promise<{ warehouseId: string }>;
}

const WarehouseIdPage = async ({ params }: WarehouseIdPageProps) => {
  const { warehouseId } = await params;

  if (warehouseId === "new") {
    return <WarehouseForm />;
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.warehouse.getOne.queryOptions({
      id: warehouseId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<WarehouseViewLoading />}>
        <ErrorBoundary errorComponent={WarehouseViewError}>
          <WarehouseIdView warehouseId={warehouseId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default WarehouseIdPage;
