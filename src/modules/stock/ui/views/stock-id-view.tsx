"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { StockForm } from "../components/stock-form";

export const StockIdView = () => {
  return <StockForm />;
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
