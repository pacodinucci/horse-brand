import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type ProductsGetOne =
  inferRouterOutputs<AppRouter>["products"]["getOne"];
