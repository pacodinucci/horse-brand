"use client";

import * as React from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { RouterOutputs } from "@/trpc/client";
import { OrderDetailsDialog } from "@/modules/orders/ui/components/order-details-dialog"; // AJUSTÁ el path si difiere

type Props = {
  customerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Customer = NonNullable<RouterOutputs["customers"]["getOne"]>;

export function CustomerDetailsDialog({
  customerId,
  open,
  onOpenChange,
}: Props) {
  const trpc = useTRPC();

  const { data, isLoading, isError } = useQuery({
    ...trpc.customers.getOne.queryOptions(
      { id: customerId ?? "" },
      { enabled: open && !!customerId }
    ),
  });

  return (
    <ResponsiveDialog
      title="Detalle del cliente"
      description="Información asociada al cliente seleccionado"
      open={open}
      onOpenChange={onOpenChange}
    >
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error />
      ) : !data ? (
        <Empty />
      ) : (
        <CustomerDetails data={data} />
      )}
    </ResponsiveDialog>
  );
}

/* ------------------------- UI helpers ------------------------- */

function Loading() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

function Error() {
  return (
    <div className="text-sm text-destructive">
      No se pudo cargar el cliente.
    </div>
  );
}

function Empty() {
  return (
    <div className="text-sm text-muted-foreground">
      No hay información para mostrar.
    </div>
  );
}

function CustomerDetails({ data }: { data: Customer }) {
  const orders = data.orders ?? [];

  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(
    null
  );
  const isOrderOpen = !!selectedOrderId;

  return (
    <>
      <div className="grid gap-6">
        {/* Datos del cliente */}
        <div className="grid gap-3 text-sm">
          <Row label="Nombre" value={data.name ?? "-"} />
          <Row label="Email" value={data.email ?? "-"} />
          <Row label="Teléfono" value={data.phone ?? "-"} />
          <Row label="Dirección" value={data.address ?? "-"} />
          <Row
            label="Creado"
            value={
              data.createdAt
                ? new Date(data.createdAt).toLocaleString("es-AR")
                : "-"
            }
          />
        </div>

        {/* Órdenes */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Órdenes</h3>
            <span className="text-xs text-muted-foreground">
              {orders.length} total
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Este cliente todavía no tiene órdenes.
            </div>
          ) : (
            <div className="divide-y rounded-md border">
              {orders.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelectedOrderId(o.id)}
                  className="w-full text-left p-3 flex items-center justify-between gap-4
                             hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        #{o.id.slice(0, 8)}
                      </span>

                      <Badge variant="secondary" className="shrink-0">
                        {String(o.paymentStatus ?? "UNKNOWN")}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString("es-AR")
                        : "-"}
                    </div>
                  </div>

                  <div className="text-sm font-semibold shrink-0">
                    {formatMoneyARS(o.total ?? 0)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal reutilizable de Orden */}
      <OrderDetailsDialog
        orderId={selectedOrderId}
        open={isOrderOpen}
        onOpenChange={(next) => {
          if (!next) setSelectedOrderId(null);
        }}
      />
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function formatMoneyARS(value: number) {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}
