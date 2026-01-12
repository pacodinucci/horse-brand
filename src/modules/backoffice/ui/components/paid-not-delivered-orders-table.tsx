"use client";

import type { RouterOutputs } from "@/trpc/client";

type Orders = RouterOutputs["orders"]["getPaidNotDelivered"];
type OrderRow = Orders[number];

interface Props {
  orders: Orders;
  onSelectOrder: (order: Pick<OrderRow, "id">) => void; // o (orderId: string)
}

export const PaidNotDeliveredOrdersTable = ({
  orders,
  onSelectOrder,
}: Props) => {
  return (
    <div className="overflow-hidden space-y-3 border rounded-md bg-white p-4 shadow-sm">
      <h1 className="text-base font-bold">
        Ventas confirmadas con entrega pendiente
      </h1>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--var-sand)]/60">
            <tr>
              <th className="p-3 text-left">Orden</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                role="button"
                tabIndex={0}
                className="
                    border-t
                    cursor-pointer
                    odd:bg-[var(--var-sand)]/20
                    even:bg-[var(--var-sand)]/10
                    hover:bg--muted
                    focus:outline-none
                    focus:ring-2
                    focus:ring-ring
                "
                onClick={() => onSelectOrder({ id: order.id })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectOrder({ id: order.id });
                  }
                }}
              >
                <td className="p-3">#{order.id}</td>
                <td className="p-3">{order.Customer?.name ?? "—"}</td>
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="p-3 text-right font-medium">
                  ${order.total.toLocaleString("es-AR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
