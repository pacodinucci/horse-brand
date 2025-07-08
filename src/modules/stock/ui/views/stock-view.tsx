"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { useRouter } from "next/navigation";
// import { DataPagination } from "@/components/data-pagination";

export const StockView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.stock.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/backoffice/stock/${row.id}`)}
      />
      {/* <DataPagination /> */}
    </div>
  );
};

export const StockViewLoading = () => {
  return (
    <LoadingState
      title="Cargando Stock"
      description="Esto puede tardar unos segundos..."
    />
  );
};

export const StockViewError = () => {
  return (
    <ErrorState title="Error al cargar stock" description="Algo salió mal." />
  );
};
