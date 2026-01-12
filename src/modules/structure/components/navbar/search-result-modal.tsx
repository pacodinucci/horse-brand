"use client";

import * as React from "react";
import Link from "next/link";
import { ResponsiveDialog } from "@/components/responsive-dialog";

export type SearchResult = {
  id: string;
  type: "product" | "category" | "subcategory";
  title: string;
  subtitle?: string;
  href: string;
};

type Props = {
  open: boolean;
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => void;
};

export function SearchResultsModal({
  open,
  query,
  results,
  isLoading,
  onOpenChange,
}: Props) {
  const q = query.trim();

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Búsqueda"
      description={
        q.length
          ? `Resultados para: ${q}`
          : "Buscá productos, categorías y subcategorías."
      }
    >
      <div className="w-full max-w-[720px] bg-white">
        {/* Header visual */}
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs text-neutral-500">Buscando</p>
            <p className="truncate text-sm text-neutral-900">
              {q.length ? (
                <>
                  “<span className="font-medium">{q}</span>”
                </>
              ) : (
                <span className="text-neutral-500">—</span>
              )}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-auto p-2">
          {q.length === 0 ? (
            <EmptyState />
          ) : isLoading ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-neutral-700">Buscando...</p>
              <p className="mt-1 text-xs text-neutral-500">
                Consultando productos, categorías y subcategorías.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-neutral-700">Sin resultados</p>
              <p className="mt-1 text-xs text-neutral-500">
                Probá con otro término.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((r) => (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    className="flex items-start justify-between gap-3 rounded-xl px-3 py-3 hover:bg-neutral-50"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-neutral-900">
                        {r.title}
                      </p>
                      {r.subtitle ? (
                        <p className="truncate text-xs text-neutral-500">
                          {r.subtitle}
                        </p>
                      ) : null}
                    </div>

                    <span className="shrink-0 rounded-full border border-neutral-200 px-2 py-1 text-[10px] uppercase tracking-wide text-neutral-600">
                      {r.type === "product"
                        ? "Producto"
                        : r.type === "category"
                        ? "Categoría"
                        : "Subcategoría"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ResponsiveDialog>
  );
}

function EmptyState() {
  return (
    <div className="px-3 py-8 text-center">
      <p className="text-sm text-neutral-700">Escribí para buscar</p>
      <p className="mt-1 text-xs text-neutral-500">Productos o categorías.</p>
    </div>
  );
}
