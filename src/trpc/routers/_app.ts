import { createTRPCRouter } from "../init";
import { productsRouter } from "@/modules/products/server/procedures";

export const appRouter = createTRPCRouter({
  products: productsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
