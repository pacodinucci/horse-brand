"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tags, PlusIcon, FilePlus2, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ImportFromExcelModal } from "./import-excel-dialog";
import { toast } from "sonner";

function extractFilenameFromContentDisposition(header?: string | null) {
  if (!header) return null;
  // Content-Disposition: attachment; filename="productos_2025-09-03-12-30-00.xlsx"
  const match =
    /filename\*=UTF-8''([^;]+)|filename="([^"]+)"|filename=([^;]+)/i.exec(
      header
    );
  return decodeURIComponent(match?.[1] || match?.[2] || match?.[3] || "");
}

export const ProductsListHeader = () => {
  const router = useRouter();
  const [excelOpen, setExcelOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadExcel = async () => {
    try {
      setDownloading(true);
      const res = await fetch("/api/products/export", { method: "GET" });
      if (!res.ok) {
        throw new Error("No se pudo generar el Excel");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Intentar obtener el nombre de archivo desde el header
      const cd = res.headers.get("Content-Disposition");
      const filename =
        extractFilenameFromContentDisposition(cd) || "productos.xlsx";

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error al descargar el Excel");
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Productos</h5>

          <div className="flex gap-x-2">
            <Button onClick={handleDownloadExcel} disabled={downloading}>
              {downloading ? "Generando..." : "Descargar Excel"}
            </Button>

            <Button
              onClick={() => router.push("/backoffice/category")}
              className="cursor-pointer bg-[var(--var-teal)] hover:bg-[var(--var-teal)]/80"
            >
              <Tags className="mr-2 h-4 w-4" />
              Administrar Categorías
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer bg-[var(--var-brick)] hover:bg-[var(--var-brick)]/80">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nuevo producto
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onSelect={() => router.push("/backoffice/products/new")}
                  className="cursor-pointer"
                >
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Cargar nuevo producto
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => setExcelOpen(true)}
                  className="cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Cargar desde Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ImportFromExcelModal open={excelOpen} onOpenChange={setExcelOpen} />
    </>
  );
};
