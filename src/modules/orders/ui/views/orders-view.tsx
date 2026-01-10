"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/components/data-table";
import { useState } from "react";
import { columns } from "../components/columns";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function formatARS(centsOrPesos: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(centsOrPesos);
}

export const OrdersView = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // QueryOptions (para poder invalidar con queryKey)
  const getManyOptions = trpc.orders.getMany.queryOptions({});
  const getOneOptions = (id: string) => trpc.orders.getOne.queryOptions({ id });

  // listado
  const { data } = useSuspenseQuery(getManyOptions);

  // detalle (solo cuando hay id)
  const orderQuery = useQuery({
    ...getOneOptions(selectedOrderId ?? ""),
    enabled: !!selectedOrderId,
  });

  const selectedOrder = orderQuery.data;

  const setDeliveredStatusMutation = useMutation(
    trpc.orders.setDeliveredStatus.mutationOptions({
      onSuccess: async () => {
        // refresca listado
        await queryClient.invalidateQueries({
          queryKey: getManyOptions.queryKey,
        });

        // refresca detalle (si sigue abierto)
        if (selectedOrderId) {
          await queryClient.invalidateQueries({
            queryKey: getOneOptions(selectedOrderId).queryKey,
          });
        }
      },
    })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => {
          setSelectedOrderId(row.id);
          setOpen(true);
        }}
      />

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelectedOrderId(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle de la orden</DialogTitle>
            <DialogDescription>
              {selectedOrderId ? `Order ID: ${selectedOrderId}` : ""}
            </DialogDescription>
          </DialogHeader>

          {orderQuery.isLoading && (
            <div className="py-8">
              <LoadingState
                title="Cargando orden"
                description="Cargando items y totales..."
              />
            </div>
          )}

          {orderQuery.isError && (
            <div className="py-8">
              <ErrorState
                title="Error al cargar orden"
                description="No se pudo cargar el detalle."
              />
            </div>
          )}

          {selectedOrder && (
            <div className="flex flex-col gap-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <div className="text-muted-foreground">Cliente</div>
                  <div className="font-medium">
                    {selectedOrder.Customer?.name ?? "—"}
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-muted-foreground">Total</div>
                  <div className="font-medium">
                    {formatARS(selectedOrder.total)}
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-muted-foreground">Pago</div>
                  <div className="font-medium">
                    {selectedOrder.paymentMethod} —{" "}
                    {selectedOrder.paymentStatus}
                  </div>
                </div>

                <div className="rounded-md border p-3 flex flex-col gap-2">
                  <div className="text-muted-foreground">Entregada</div>

                  <span
                    className={`font-medium ${
                      selectedOrder.delivered
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {selectedOrder.delivered ? "Sí" : "No"}
                  </span>

                  {selectedOrder.delivered && selectedOrder.deliveredAt ? (
                    <div className="text-xs text-muted-foreground">
                      {new Date(selectedOrder.deliveredAt).toLocaleString(
                        "es-AR"
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">—</div>
                  )}

                  <Button
                    className={`mt-2 rounded-md px-3 py-1.5 text-sm font-medium
                      disabled:opacity-50
                    `}
                    variant={"secondary"}
                    size={"sm"}
                    disabled={setDeliveredStatusMutation.isPending}
                    onClick={() =>
                      setDeliveredStatusMutation.mutate({
                        id: selectedOrder.id,
                        delivered: !selectedOrder.delivered,
                      })
                    }
                  >
                    {setDeliveredStatusMutation.isPending
                      ? "Actualizando..."
                      : selectedOrder.delivered
                      ? "Marcar como NO entregada"
                      : "Marcar como entregada"}
                  </Button>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-md border overflow-hidden">
                <div className="px-4 py-3 border-b font-medium">
                  Items ({selectedOrder.items.length})
                </div>

                <div className="divide-y">
                  {selectedOrder.items.map((it) => {
                    const pv = it.productVariant;
                    const p = pv?.product;

                    const productName = p?.name ?? "Producto sin nombre";
                    const variantLabel = [pv?.color, pv?.material, pv?.measure]
                      .filter(Boolean)
                      .join(" · ");
                    const img = p?.images?.[0] ?? "";

                    return (
                      <div
                        key={it.id}
                        className="px-4 py-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative size-14 rounded-md bg-muted overflow-hidden shrink-0">
                            {img && (
                              <Image
                                src={img}
                                alt={productName}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {productName}
                            </div>

                            {variantLabel ? (
                              <div className="text-xs text-muted-foreground truncate">
                                {variantLabel}
                              </div>
                            ) : null}

                            <div className="text-xs">
                              Cantidad:{" "}
                              <span className="font-medium">{it.quantity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            {formatARS(it.subtotal)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {it.quantity} × {formatARS(it.unitPrice)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end">
                <div className="text-sm text-muted-foreground">
                  Creada:{" "}
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString("es-AR")
                    : "—"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
