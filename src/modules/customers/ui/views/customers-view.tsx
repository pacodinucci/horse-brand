"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useState } from "react";
import { columns } from "../components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const CustomersView = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.customers.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => setSelectedCustomer(row.id)}
      />
      {/* <DataPagination /> */}
    </div>
  );
};

export const CustomersViewLoading = () => {
  return (
    <LoadingState
      title="Cargando Categorías"
      description="Esto puede tardar unos segundos..."
    />
  );
};

export const CustomersViewError = () => {
  return (
    <ErrorState
      title="Error al cargar categorías"
      description="Algo salió mal."
    />
  );
};
