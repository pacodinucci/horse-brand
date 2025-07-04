"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { useRouter } from "next/navigation";

export const WarehouseView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.warehouse.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/backoffice/warehouses/${row.id}`)}
      />
    </div>
  );
};

export const WarehouseViewLoading = () => {
  return (
    <LoadingState
      title="Cargando Depósitos"
      description="Esto puede tardar unos segundos..."
    />
  );
};

export const WarehouseViewError = () => {
  return (
    <ErrorState
      title="Error al cargar depósitos"
      description="Algo salió mal."
    />
  );
};
