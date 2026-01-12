"use client";

import * as React from "react";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";

function formatARS(centsOrPesos: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(centsOrPesos);
}

type Props = {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrderDetailsDialog({ orderId, open, onOpenChange }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const getManyOptions = trpc.orders.getMany.queryOptions({});
  const getOneOptions = (id: string) => trpc.orders.getOne.queryOptions({ id });

  const orderQuery = useQuery({
    ...getOneOptions(orderId ?? ""),
    enabled: open && !!orderId,
  });

  const order = orderQuery.data;

  const setDeliveredStatusMutation = useMutation(
    trpc.orders.setDeliveredStatus.mutationOptions({
      onSuccess: async () => {
        // refresca listado
        await queryClient.invalidateQueries({
          queryKey: getManyOptions.queryKey,
        });

        // refresca detalle (si sigue abierto)
        if (orderId) {
          await queryClient.invalidateQueries({
            queryKey: getOneOptions(orderId).queryKey,
          });
        }
      },
    })
  );

  return (
    <ResponsiveDialog
      title="Detalle de la orden"
      description={orderId ? `Order ID: ${orderId}` : ""}
      open={open}
      onOpenChange={onOpenChange}
    >
      {orderQuery.isLoading ? (
        <div className="py-2">
          <LoadingState
            title="Cargando orden"
            description="Cargando items y totales..."
          />
        </div>
      ) : orderQuery.isError ? (
        <div className="py-2">
          <ErrorState
            title="Error al cargar orden"
            description="No se pudo cargar el detalle."
          />
        </div>
      ) : !order ? (
        <div className="text-sm text-muted-foreground">—</div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Cliente</div>
              <div className="font-medium">{order.Customer?.name ?? "—"}</div>
            </div>

            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Total</div>
              <div className="font-medium">{formatARS(order.total)}</div>
            </div>

            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Pago</div>
              <div className="font-medium">
                {order.paymentMethod} — {order.paymentStatus}
              </div>
            </div>

            <div className="rounded-md border p-3 flex flex-col gap-2">
              <div className="text-muted-foreground">Entregada</div>

              <span
                className={`font-medium ${
                  order.delivered ? "text-green-700" : "text-red-700"
                }`}
              >
                {order.delivered ? "Sí" : "No"}
              </span>

              {order.delivered && order.deliveredAt ? (
                <div className="text-xs text-muted-foreground">
                  {new Date(order.deliveredAt).toLocaleString("es-AR")}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">—</div>
              )}

              <Button
                className="mt-2"
                variant="secondary"
                size="sm"
                disabled={setDeliveredStatusMutation.isPending}
                onClick={() =>
                  setDeliveredStatusMutation.mutate({
                    id: order.id,
                    delivered: !order.delivered,
                  })
                }
              >
                {setDeliveredStatusMutation.isPending
                  ? "Actualizando..."
                  : order.delivered
                  ? "Marcar como NO entregada"
                  : "Marcar como entregada"}
              </Button>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-md border overflow-hidden">
            <div className="px-4 py-3 border-b font-medium">
              Items ({order.items.length})
            </div>

            <div className="divide-y">
              {order.items.map((it) => {
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
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("es-AR")
                : "—"}
            </div>
          </div>
        </div>
      )}
    </ResponsiveDialog>
  );
}
