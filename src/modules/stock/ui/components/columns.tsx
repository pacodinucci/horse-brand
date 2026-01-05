"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { StockGetOne } from "../../types";
// import { format } from "date-fns";

type ColumnsProps = {
  onDelete: (row: StockGetOne) => void;
};

export const getColumns = ({
  onDelete,
}: ColumnsProps): ColumnDef<StockGetOne>[] => [
  {
    accessorKey: "ProductVariant",
    header: "Producto",
    cell: ({ row }) => {
      const variant = row.original.ProductVariant;
      const productName = variant?.product?.name || "";
      const attrs = [variant?.color, variant?.material, variant?.measure]
        .filter(Boolean)
        .join(" · ");

      return `${productName}${attrs ? " - " + attrs : ""}`;
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => row.original.quantity,
  },
  {
    accessorKey: "warehouse",
    header: "Depósito",
    cell: ({ row }) => row.original.warehouse?.name || "-",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(row.original);
        }}
        className="cursor-pointer hover:bg-zinc-100"
      >
        <Trash2 className="w-5 h-5 text-red-500" />
      </Button>
    ),
  },
];
