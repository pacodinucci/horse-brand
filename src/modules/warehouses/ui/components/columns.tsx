"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WarehouseGetOne } from "../../types";
import { format } from "date-fns";

export const columns: ColumnDef<WarehouseGetOne>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "location",
    header: "Dirección",
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
