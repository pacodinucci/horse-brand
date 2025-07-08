"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StockGetOne } from "../../types";
// import { format } from "date-fns";

export const columns: ColumnDef<StockGetOne>[] = [
  {
    accessorKey: "ProductVariant",
    header: "Producto",
    cell: ({ row }) => {
      console.log(row.original);
      return "Nombre del producto mas atributos";
    },
  },
];
