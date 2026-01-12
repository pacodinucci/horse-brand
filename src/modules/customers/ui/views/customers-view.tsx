"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useState } from "react";
import { columns } from "../components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CustomerDetailsDialog } from "../components/customer-details-dialog";
import type { RouterOutputs } from "@/trpc/client";

type CustomerRow = RouterOutputs["customers"]["getMany"]["items"][number];

export const CustomersView = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.customers.getMany.queryOptions({}));

  const open = !!selectedCustomerId;

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable<CustomerRow, unknown>
        data={data.items}
        columns={columns}
        onRowClick={(row) => {
          if (!row) return;
          setSelectedCustomerId(row.id);
        }}
      />

      <CustomerDetailsDialog
        customerId={selectedCustomerId}
        open={open}
        onOpenChange={(next) => {
          if (!next) setSelectedCustomerId(null);
        }}
      />
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
