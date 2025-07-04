import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type CategoryGetOne =
  inferRouterOutputs<AppRouter>["category"]["getOne"];
