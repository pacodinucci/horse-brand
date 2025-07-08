import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type StockGetOne = inferRouterOutputs<AppRouter>["stock"]["getOne"];
