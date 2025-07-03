"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../ui/columns";
import { DataPagination } from "@/components/data-pagination";

export const ProductsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable data={data.items} columns={columns} />
      {/* <DataPagination /> */}
    </div>
  );
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
