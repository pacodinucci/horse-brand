"use client";

import { useEffect, useRef, useState } from "react";
import { PiMagnifyingGlassThin } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
// import {
//   SearchResultsModal,
//   type SearchResult,
// } from "@/components/navbar/search-results-modal";
import { SearchResultsModal, type SearchResult } from "./search-result-modal";

function useDebouncedValue<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export const NavbarSearch = () => {
  const trpc = useTRPC();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 200);

  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const q = query.trim();
    setOpen(q.length > 0);
  }, [query]);

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

  const q = debouncedQuery.trim();

  const { data: results = [], isFetching } = useQuery({
    ...trpc.search.global.queryOptions({ q, limit: 8 }),
    enabled: q.length > 0,
    staleTime: 30_000,
  });

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
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) inputRef.current?.blur();
        }}
        query={query}
        results={results as SearchResult[]}
        isLoading={isFetching}
        onClear={() => {
          setQuery("");
          setOpen(false);
          inputRef.current?.focus();
        }}
      />
    </div>
  );
};
