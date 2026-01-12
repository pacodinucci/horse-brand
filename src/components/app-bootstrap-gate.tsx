"use client";

import { useEffect, useMemo } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCategoriesStore } from "@/store/categories";
import { authClient } from "@/lib/auth-client";
import { PageLoader } from "./page-loader";

type Props = {
  children: React.ReactNode;
};

export function AppBootstrapGate({ children }: Props) {
  const { isPending: sessionPending } = authClient.useSession();
  const sessionReady = !sessionPending;

  const trpc = useTRPC();
  const {
    // categories: storeCategories,
    loaded,
    setCategories,
  } = useCategoriesStore();

  const categoriesReadyFromStore = loaded;

  const q = trpc.category.getMany.queryOptions({ page: 1, pageSize: 50 });
  const {
    data: categoriesData,
    isFetching,
    isLoading,
  } = useQuery({
    ...q,
    enabled: !categoriesReadyFromStore,
  });

  useEffect(() => {
    if (categoriesReadyFromStore) return;
    if (!categoriesData?.items) return;

    setCategories(categoriesData.items);
  }, [categoriesReadyFromStore, categoriesData?.items, setCategories]);

  const categoriesReady = useMemo(() => {
    if (categoriesReadyFromStore) return true;
    return categoriesData !== undefined && !isLoading && !isFetching;
  }, [categoriesReadyFromStore, categoriesData, isLoading, isFetching]);

  const ready = categoriesReady && sessionReady;

  if (!ready) return <PageLoader />;

  return <>{children}</>;
}
