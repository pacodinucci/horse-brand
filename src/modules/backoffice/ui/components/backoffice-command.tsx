"use client";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedValue } from "@/hooks/use-debounce-value";
import { useQuery } from "@tanstack/react-query";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const BackOfficeCommand = ({ open, setOpen }: DashboardCommandProps) => {
  const trpc = useTRPC();
  const router = useRouter();

  const [rawQuery, setRawQuery] = useDebouncedValue("", 150);
  const query = rawQuery.trim();

  const enabled = open && query.length >= 2;

  // 👇 IMPORTANTE: usar queryOptions + useQuery (como venís usando en otras pantallas)
  const q = trpc.backoffice.search.queryOptions({ query });
  const { data, isFetching } = useQuery({
    ...q,
    enabled,
    staleTime: 10_000,
  });

  const hasAny = useMemo(() => {
    if (!data) return false;
    return (
      data.products.length > 0 ||
      data.orders.length > 0 ||
      data.customers.length > 0
    );
  }, [data]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Buscar en Backoffice"
        onValueChange={(v) => setRawQuery(v)}
      />

      <CommandList>
        <CommandEmpty>
          {isFetching
            ? "Buscando…"
            : query.length < 2
            ? "Escribí al menos 2 caracteres."
            : "Sin resultados."}
        </CommandEmpty>

        {data?.products?.length ? (
          <CommandGroup heading="Productos">
            {data.products.map((p) => (
              <CommandItem
                key={p.id}
                value={p.name}
                onSelect={() => go(`/backoffice/products/${p.id}`)}
              >
                {p.name}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.orders?.length ? (
          <CommandGroup heading="Órdenes">
            {data.orders.map((o) => (
              <CommandItem
                key={o.id}
                value={o.orderNumber}
                onSelect={() => go(`/backoffice/orders/${o.id}`)}
              >
                Orden #{o.orderNumber}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.customers?.length ? (
          <CommandGroup heading="Clientes">
            {data.customers.map((c) => (
              <CommandItem
                key={c.id}
                value={c.email ? `${c.name} ${c.email}` : c.name}
                onSelect={() => go(`/backoffice/customers/${c.id}`)}
              >
                <div className="flex flex-col">
                  <span>{c.name}</span>
                  {c.email ? (
                    <span className="text-xs text-muted-foreground">
                      {c.email}
                    </span>
                  ) : null}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data && !hasAny ? null : null}
      </CommandList>
    </CommandResponsiveDialog>
  );
};
