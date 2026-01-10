import { ColumnDef } from "@tanstack/react-table";
import { OrderRow } from "../../types";

export const columns: ColumnDef<OrderRow>[] = [
  {
    accessorKey: "id",
    header: "N° Orden",
  },
  {
    id: "customer",
    header: "Cliente",
    accessorFn: (row) => row.Customer?.name ?? "—",
  },
  {
    id: "email",
    header: "Email",
    accessorFn: (row) => row.Customer?.email ?? "—",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "paymentStatus",
    header: "Estado",
  },
  {
    id: "items",
    header: "Items",
    accessorFn: (row) => row.items.length,
  },
];
