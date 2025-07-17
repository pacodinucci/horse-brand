"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StockFormDialog } from "../components/stock-form-dialog";
// import { DataPagination } from "@/components/data-pagination";

export const StockView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.stock.getMany.queryOptions({}));

  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const getInitialValues = (row: any) => ({
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
          columns={columns}
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
