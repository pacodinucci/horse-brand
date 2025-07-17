"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { StockForm } from "../components/stock-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { StockIdViewHeader } from "../components/stock-id-view-header";

export const StockIdView = () => {
  const params = useParams();
  const id = params?.stockId as string;
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.stock.getOne.queryOptions({ id }));

  const initialValues = {
    id: data.id,
    productId: data.ProductVariant?.product.id ?? "",
    productName: data.product?.name,
    warehouseId: data.warehouse.id,
    quantity: data.quantity,
    sku: data.ProductVariant?.sku ?? "",
    attributes:
      typeof data.ProductVariant?.attributes === "object" &&
      data.ProductVariant?.attributes !== null
        ? (data.ProductVariant.attributes as Record<string, string>)
        : {},
  };

  const productName = initialValues.productName || "";
  const attrs = initialValues.attributes
    ? Object.values(initialValues.attributes).join(" ")
    : "";
  const stockTitle = attrs ? `${productName} - ${attrs}` : productName;

  return (
    <div className="p-6">
      <StockIdViewHeader stockTitle={stockTitle} />
      <StockForm initialValues={initialValues} />
    </div>
  );
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
