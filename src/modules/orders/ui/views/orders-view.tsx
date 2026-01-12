"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/components/data-table";
import { useState } from "react";
import { columns } from "../components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { OrderDetailsDialog } from "../components/order-details-dialog";

export const OrdersView = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.orders.getMany.queryOptions({}));

  const open = !!selectedOrderId;

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => setSelectedOrderId(row.id)}
      />

      <OrderDetailsDialog
        orderId={selectedOrderId}
        open={open}
        onOpenChange={(v) => {
          if (!v) setSelectedOrderId(null);
        }}
      />
    </div>
  );
};

export const OrdersViewLoading = () => {
  return (
    <LoadingState
      title="Cargando Órdenes"
      description="Esto puede tardar unos segundos..."
    />
  );
};

export const OrdersViewError = () => {
  return (
    <ErrorState title="Error al cargar ordenes" description="Algo salió mal." />
  );
};
