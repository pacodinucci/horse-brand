import { ColumnDef } from "@tanstack/react-table";
import { CustomerGetOne } from "../../types";

export const columns: ColumnDef<CustomerGetOne>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  // Si querés sumar más campos, agregalos así:
  // {
  //   accessorKey: "phone",
  //   header: "Teléfono",
  //   cell: ({ getValue }) => (
  //     <span>{getValue() as string}</span>
  //   ),
  // },
  // {
  //   accessorKey: "createdAt",
  //   header: "Fecha alta",
  //   cell: ({ getValue }) => {
  //     const date = new Date(getValue() as string);
  //     return <span>{date.toLocaleDateString("es-AR")}</span>;
  //   },
  // },
];
