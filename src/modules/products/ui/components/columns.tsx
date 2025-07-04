"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductsGetOne } from "../../types";
import { format } from "date-fns";

export const columns: ColumnDef<ProductsGetOne>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    header: "Categoría",
    cell: ({ row }) => row.original.category?.name ?? "—",
  },
  {
    header: "Subcategoría",
    cell: ({ row }) => row.original.subCategory?.name ?? "—",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ getValue }) => {
      const date = getValue<Date>();
      return format(new Date(date), "dd/MM/yyyy HH:mm");
    },
  },
];
