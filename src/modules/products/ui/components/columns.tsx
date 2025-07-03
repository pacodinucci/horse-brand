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
    accessorKey: "category",
    header: "Categoría",
  },
  {
    accessorKey: "subCategory",
    header: "Subcategoría",
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
