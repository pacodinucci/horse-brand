import { ColumnDef } from "@tanstack/react-table";
import { OrderGetOne } from "../../types";

export const columns: ColumnDef<OrderGetOne>[] = [
  {
    accessorKey: "id",
    header: "N° Orden",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "Customer.name",
    header: "Cliente",
    cell: ({ row }) => <span>{row.original.Customer?.name || "—"}</span>,
  },
  {
    accessorKey: "Customer.email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.Customer?.email || "—"}
      </span>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ getValue }) => (
      <span>
        $
        {Number(getValue() || 0).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ getValue }) => {
      const status = (getValue() as string).toUpperCase();
      let color = "bg-gray-300 text-gray-800";
      if (status === "PAID") color = "bg-green-200 text-green-800";
      else if (status === "PENDING") color = "bg-yellow-100 text-yellow-900";
      else if (status === "CANCELLED") color = "bg-red-100 text-red-700";
      return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return <span>{date.toLocaleDateString("es-AR")}</span>;
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => <span>{row.original.items?.length ?? 0}</span>,
  },
];
