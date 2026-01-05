import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type StockGetOne = inferRouterOutputs<AppRouter>["stock"]["getOne"];

export type StockRow = {
  id: string;
  createdAt: string;
  updatedAt: string;

  productId: string;
  productVariantId: string | null;
  warehouseId: string;
  quantity: number;

  warehouse: {
    id: string;
    name: string;
  };

  ProductVariant: {
    id: string;
    sku: string | null;
    color: string | null;
    material: string | null;
    measure: string | null;

    product: {
      id: string;
      name: string;
    };
  } | null;
};
