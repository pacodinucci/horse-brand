"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { PaidNotDeliveredOrdersTable } from "../ui/components/paid-not-delivered-orders-table";
import { OrderDetailsDialog } from "@/modules/orders/ui/components/order-details-dialog";
import { SalesCountChart } from "../ui/components/sales-count-chart";
import { RevenueLineChart } from "../ui/components/revenue-line-chart";

export const BackofficeView = () => {
  const trpc = useTRPC();
  const q = trpc.orders.getPaidNotDelivered.queryOptions();
  const { data, isLoading } = useQuery(q);

  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (isLoading) return <div>Cargando órdenes...</div>;
  if (!data || data.length === 0)
    return <div>No hay órdenes pendientes de entrega</div>;

  return (
    <div className="space-y-4 px-6 py-4">
      <PaidNotDeliveredOrdersTable
        orders={data}
        onSelectOrder={({ id }) => {
          setOrderId(id);
          setOpen(true);
        }}
      />

      <SalesCountChart />

      <RevenueLineChart />

      <OrderDetailsDialog
        orderId={orderId}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setOrderId(null);
        }}
      />
    </div>
  );
};
