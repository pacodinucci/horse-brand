import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type OrderGetOne = inferRouterOutputs<AppRouter>["orders"]["getOne"];
