import { warehouseRouter } from "@/modules/warehouses/server/procedures";
import { createTRPCRouter } from "../init";
import { productsRouter } from "@/modules/products/server/procedures";
import { categoryRouter } from "@/modules/category/server/procedures";
import { subcategoryRouter } from "@/modules/subcategory/server/procedures";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  warehouse: warehouseRouter,
  category: categoryRouter,
  subcategory: subcategoryRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
