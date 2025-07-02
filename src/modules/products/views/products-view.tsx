"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const ProductsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({}));

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export const ProductsViewLoading = () => {
  return (
    <LoadingState
      title="Cargando Productos"
      description="Esto puede tardar unos segundos..."
    />
  );
};

export const ProductsViewError = () => {
  return (
    <ErrorState
      title="Error al cargar productos"
      description="Algo salió mal."
    />
  );
};
