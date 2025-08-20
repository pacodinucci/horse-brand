"use client";

import { ImportProductDropzone } from "./import-product-dropzone";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Matrix, Cell } from "@/lib/types";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

// Coincide con el zod del server (createNewFromRows)
type RowInput = {
  "Nombre Base": string;
  Categoria?: string | null;
  Color?: string | null;
  Material?: string | null;
  Medidas?: string | null;
  Precio?: string | number | null;
  Proveedor?: string | null;
};

// Helper para normalizar texto
const norm = (v: unknown) => (v == null ? "" : String(v).trim());

// Convierte la matriz (header:1) a RowInput[]
function matrixToRowInputs(matrix: Matrix): RowInput[] {
  if (!matrix?.length) return [];
  const [headers, ...rows] = matrix;

  const findIdx = (name: string) =>
    headers.findIndex((h) => norm(h).toLowerCase() === name.toLowerCase());

  const idxNombre = findIdx("Nombre Base");
  if (idxNombre === -1) return []; // si falta la cabecera, devolvemos vacío

  const idxCategoria = findIdx("Categoria");
  const idxColor = findIdx("Color");
  const idxMaterial = findIdx("Material");
  const idxMedidas = findIdx("Medidas");
  const idxPrecio = findIdx("Precio");
  const idxProveedor = findIdx("Proveedor");

  const pickStr = (r: Cell[], i: number) =>
    i >= 0 ? norm(r?.[i]) || null : undefined;

  return rows
    .map((r) => {
      const nombre = norm(r?.[idxNombre]);
      if (!nombre) return null;
      const precio =
        idxPrecio >= 0
          ? (r?.[idxPrecio] as string | number | null | undefined) ?? null
          : undefined;

      const row: RowInput = {
        "Nombre Base": nombre,
        Categoria: pickStr(r as Cell[], idxCategoria),
        Color: pickStr(r as Cell[], idxColor),
        Material: pickStr(r as Cell[], idxMaterial),
        Medidas: pickStr(r as Cell[], idxMedidas),
        Precio: precio,
        Proveedor: pickStr(r as Cell[], idxProveedor),
      };
      return row;
    })
    .filter(Boolean) as RowInput[];
}

export const ImportFromExcelModal = ({ open, onOpenChange }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const ensureProducts = useMutation(
    trpc.products.createNewFromRows.mutationOptions({
      onSuccess: async (data) => {
        // pasá los filtros que uses en tu lista de productos (si los hay)
        await queryClient.invalidateQueries(
          trpc.products.getMany.queryOptions({})
        );

        toast.success("Productos procesados", {
          description: `Creados: ${data.created} · Saltados (ya existían): ${data.skippedExisting}`,
        });
        onOpenChange(false);
      },
      onError: (err: unknown) => {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Revisá el archivo.";
        toast.error("Error al crear productos", { description: message });
      },
    })
  );

  const handleFileProcessed = async (matrix: Matrix): Promise<void> => {
    setIsProcessingFile(true);
    try {
      const rows = matrixToRowInputs(matrix);
      if (!rows.length) {
        toast.error(
          "El archivo no tiene la columna 'Nombre Base' o está vacío."
        );
        return;
      }
      await ensureProducts.mutateAsync({ rows });
    } finally {
      setIsProcessingFile(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Importar productos desde Excel"
      description=""
    >
      <ImportProductDropzone
        onFileProcessed={handleFileProcessed}
        isProcessingFile={isProcessingFile}
      />
    </ResponsiveDialog>
  );
};
