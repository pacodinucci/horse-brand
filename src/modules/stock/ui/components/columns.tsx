"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StockGetOne } from "../../types";
// import { format } from "date-fns";

export const columns: ColumnDef<StockGetOne>[] = [
  {
    accessorKey: "ProductVariant",
    header: "Producto",
    cell: ({ row }) => {
      const variant = row.original.ProductVariant;
      const productName = variant?.product?.name || "";
      const attrs = variant?.attributes
        ? Object.entries(variant.attributes)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_, value]) => ` ${value}`)
            .join("  ")
        : "";

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
];
