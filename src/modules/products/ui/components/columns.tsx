"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductsGetOne } from "../../types";
import { format } from "date-fns";
import Image from "next/image";

const PLACEHOLDER_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSbaXwqbkTkBrhQlStfpYmocGn0pg07Bn0DQ&s";

export const columns: ColumnDef<ProductsGetOne>[] = [
  {
    accessorKey: "name",
    header: "Producto", // Cambiado de 'Nombre' a 'Producto'
    cell: ({ row }) => {
      const product = row.original;
      const imageUrl = product.images?.[0] || PLACEHOLDER_IMAGE;
      return (
        <div>
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                width={40}
                height={40}
                className="object-cover w-10 h-10"
                style={{ width: 40, height: 40 }}
                unoptimized={imageUrl === PLACEHOLDER_IMAGE}
              />
            ) : (
              <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                Sin imagen
              </div>
            )}
            <div>
              <span>{product.name}</span>
              <div className="text-xs text-muted-foreground">
                {product.category?.name ?? "Sin categoría"}
              </div>
            </div>
          </div>
        </div>
      );
    },
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
