"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Loader2 } from "lucide-react";
import { Matrix } from "@/lib/types";

type FileDropzoneProps = {
  onFileProcessed: (data: Matrix) => void | Promise<void>;
  isProcessingFile: boolean;
};

export const ImportProductDropzone: React.FC<FileDropzoneProps> = ({
  onFileProcessed,
  isProcessingFile,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles?.[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const buf = event.target?.result as ArrayBuffer;
          const data = new Uint8Array(buf);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
          }) as Matrix; // ⬅️ tipado
          onFileProcessed(jsonData);
        } catch (e) {
          console.error("[ImportProductDropzone] Error leyendo archivo:", e);
        }
      };

      reader.onerror = (e) => {
        console.error("[ImportProductDropzone] FileReader error:", e);
      };

      reader.readAsArrayBuffer(file);
    },
    [onFileProcessed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isProcessingFile, // opcional: deshabilitar mientras procesa
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
  });

  return (
    <div
      {...getRootProps()}
      aria-busy={isProcessingFile}
      className="border-2 border-dashed rounded-lg px-2 md:px-24 py-4 md:py-16 border-neutral-500"
    >
      <input {...getInputProps()} />
      {isProcessingFile ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm text-neutral-600">Procesando archivo…</p>
        </div>
      ) : (
        <p className="text-lg text-center text-neutral-700">
          {isDragActive
            ? "Soltá el archivo aquí…"
            : "Click o arrastrar archivo (.csv, .xls o .xlsx)"}
        </p>
      )}
    </div>
  );
};
