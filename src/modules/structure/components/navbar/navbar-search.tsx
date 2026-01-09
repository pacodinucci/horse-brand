"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PiMagnifyingGlassThin } from "react-icons/pi";

type SearchResult = {
  id: string;
  type: "product" | "category";
  title: string;
  subtitle?: string;
  href: string;
};

const MOCK_RESULTS: SearchResult[] = [
  {
    id: "p-1",
    type: "product",
    title: "Banquito Niño",
    subtitle: "$215.000",
    href: "/product/banquito-nino",
  },
  {
    id: "c-1",
    type: "category",
    title: "Sillones",
    subtitle: "Categoría",
    href: "/category/sillones",
  },
  {
    id: "p-2",
    type: "product",
    title: "Mesa Ratona Roble",
    subtitle: "$320.000",
    href: "/product/mesa-ratona-roble",
  },
];

function useDebouncedValue<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export const NavbarSearch = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 200);

  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Abrir modal cuando empieza a tipear (y mantenerlo abierto mientras haya query o foco)
  useEffect(() => {
    if (query.trim().length > 0) setOpen(true);
    if (query.trim().length === 0) setOpen(false);
  }, [query]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return MOCK_RESULTS.filter((r) =>
      (r.title + " " + (r.subtitle ?? "")).toLowerCase().includes(q)
    ).slice(0, 8);
  }, [debouncedQuery]);

  return (
    <div className="flex items-center gap-2 text-neutral-700">
      <PiMagnifyingGlassThin
        className="size-5 opacity-90 cursor-pointer"
        onClick={() => {
          inputRef.current?.focus();
          if (query.trim()) setOpen(true);
        }}
      />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        placeholder="Buscar"
        className="
          w-40 text-sm bg-transparent px-0 py-0
          border-0 border-b border-neutral-800/60
          outline-none ring-0 shadow-none
          focus:outline-none focus:ring-0 focus:ring-offset-0
          focus:shadow-none focus:border-neutral-800/60
          placeholder:text-neutral-500
        "
        style={{ WebkitTapHighlightColor: "transparent" }}
      />

      <SearchResultsModal
        open={open}
        query={query}
        results={results}
        onClose={() => {
          setOpen(false);
        }}
        onClear={() => {
          setQuery("");
          setOpen(false);
          inputRef.current?.focus();
        }}
      />
    </div>
  );
};

function SearchResultsModal({
  open,
  query,
  results,
  onClose,
  onClear,
}: {
  open: boolean;
  query: string;
  results: SearchResult[];
  onClose: () => void;
  onClear: () => void;
}) {
  if (!open) return null;

  const q = query.trim();

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay */}
      <button
        aria-label="Cerrar búsqueda"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute left-1/2 top-24 w-[min(720px,calc(100vw-24px))] -translate-x-1/2 rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
        {/* Header: query */}
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-xs text-neutral-600 hover:text-neutral-900"
              onClick={onClear}
            >
              Limpiar
            </button>
            <button
              type="button"
              className="text-xs text-neutral-600 hover:text-neutral-900"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-auto p-2">
          {q.length === 0 ? (
            <EmptyState />
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
                  <a
                    href={r.href}
                    className="flex items-start justify-between gap-3 rounded-xl px-3 py-3 hover:bg-neutral-50"
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
                      {r.type === "product" ? "Producto" : "Categoría"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-4 py-3">
          <p className="text-xs text-neutral-500">
            Enter (luego) para buscar, Esc para cerrar.
          </p>
        </div>
      </div>
    </div>
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
