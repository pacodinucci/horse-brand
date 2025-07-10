"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { StockForm } from "../components/stock-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";

export const StockIdView = () => {
  const params = useParams();
  const id = params?.stockId as string; // Ajustá si tu param se llama diferente
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.stock.getOne.queryOptions({ id }));

  const initialValues = {
    id: data.id,
    productId: data.ProductVariant?.product.id ?? "",
    warehouseId: data.warehouse.id,
    quantity: data.quantity,
    sku: data.ProductVariant?.sku ?? "",
    attributes:
      typeof data.ProductVariant?.attributes === "object" &&
      data.ProductVariant?.attributes !== null
        ? (data.ProductVariant.attributes as Record<string, string>)
        : {},
  };

  return <StockForm initialValues={initialValues} />;
};

export const StockIdViewLoading = () => {
  return (
    <LoadingState
      title="Cargando Stock"
      description="Esto puede tardar unos segundos..."
    />
  );
};

export const StockIdViewError = () => {
  return (
    <ErrorState title="Error al cargar stock" description="Algo salió mal." />
  );
};
