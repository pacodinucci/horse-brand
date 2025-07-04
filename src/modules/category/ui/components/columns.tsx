"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CategoryGetOne } from "../../types";

export const columns: ColumnDef<CategoryGetOne>[] = [
  {
    accessorKey: "name",
    header: "Categoría",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "subcategories",
    header: "Subcategorías",
    cell: ({ row }) => {
      const subs = row.original.subcategories;
      if (!subs?.length)
        return (
          <span className="text-muted-foreground italic">
            Sin subcategorías
          </span>
        );
      return (
        <ul className="flex flex-col gap-1">
          {subs.map((sub) => (
            <li
              key={sub.id}
              className="text-sm pl-2 before:content-['•'] before:mr-2 before:text-muted-foreground"
            >
              {sub.name}
            </li>
          ))}
        </ul>
      );
    },
  },
];
