import { warehouseRouter } from "@/modules/warehouses/server/procedures";
import { createTRPCRouter } from "../init";
import { productsRouter } from "@/modules/products/server/procedures";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  warehouse: warehouseRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
