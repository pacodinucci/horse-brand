import { inferRouterOutputs } from "@trpc/server";
import type { RouterOutputs } from "@/trpc/client";

import type { AppRouter } from "@/trpc/routers/_app";

export type OrderGetOne = inferRouterOutputs<AppRouter>["orders"]["getOne"];
export type OrderRow = RouterOutputs["orders"]["getMany"]["items"][number];
