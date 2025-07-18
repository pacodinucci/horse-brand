"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getColumns } from "../components/columns";
import { useState } from "react";
import { StockFormDialog } from "../components/stock-form-dialog";
import { StockGetOne } from "../../types";
import { StockFormProps } from "../components/stock-form";
import { toast } from "sonner";
// import { DataPagination } from "@/components/data-pagination";

export const StockView = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(trpc.stock.getMany.queryOptions({}));

  const [selectedRow, setSelectedRow] = useState<StockFormProps | null>(null);

  const getInitialValues = (row: StockGetOne) => ({
    id: row.id,
    productId: row.ProductVariant?.product?.id ?? "",
    warehouseId: row.warehouse?.id ?? "",
    quantity: row.quantity,
    sku: row.ProductVariant?.sku ?? "",
    attributes:
      typeof row.ProductVariant?.attributes === "object" &&
      row.ProductVariant?.attributes !== null
        ? row.ProductVariant.attributes
        : {},
  });

  const removeStock = useMutation(
    trpc.stock.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.stock.getMany.queryOptions({})
        );
        toast.success("Stock eliminado");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleDelete = (row: StockGetOne) => {
    if (
      window.confirm(
        `¿Seguro que querés eliminar el stock de "${
          row.ProductVariant?.product?.name || "Producto"
        }"?`
      )
    ) {
      removeStock.mutate({ id: row.id });
    }
  };

  return (
    <>
      {selectedRow && (
        <StockFormDialog
          open={!!selectedRow}
          onOpenChange={(open) => {
            if (!open) setSelectedRow(null);
          }}
          title={selectedRow.ProductVariant?.product?.name ?? "Editar stock"}
          description="Editar stock"
          initialValues={getInitialValues(selectedRow)}
        />
      )}
      <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        <DataTable
          data={data.items}
          columns={getColumns({ onDelete: handleDelete })}
          // onRowClick={(row) => router.push(`/backoffice/stock/${row.id}`)}
          onRowClick={(row) => setSelectedRow(row)}
        />
        {/* <DataPagination /> */}
      </div>
    </>
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
