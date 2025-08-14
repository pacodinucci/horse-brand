import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  CustomersViewLoading,
  CustomersViewError,
  CustomersView,
} from "@/modules/customers/ui/views/customers-view";
import { CustomersListHeader } from "@/modules/customers/ui/components/customers-list-header";

export const dynamic = "force-dynamic";

const CustomersPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.customers.getMany.queryOptions({}));

  return (
    <>
      <CustomersListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<CustomersViewLoading />}>
          <ErrorBoundary errorComponent={CustomersViewError}>
            <CustomersView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default CustomersPage;
