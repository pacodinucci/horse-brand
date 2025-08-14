import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  OrdersViewLoading,
  OrdersViewError,
  OrdersView,
} from "@/modules/orders/ui/views/orders-view";
import { OrdersListHeader } from "@/modules/orders/ui/components/orders-list-header";

const OrdersPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.orders.getMany.queryOptions({}));

  return (
    <>
      <OrdersListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<OrdersViewLoading />}>
          <ErrorBoundary errorComponent={OrdersViewError}>
            <OrdersView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default OrdersPage;
