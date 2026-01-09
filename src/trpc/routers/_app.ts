import { warehouseRouter } from "@/modules/warehouses/server/procedures";
import { createTRPCRouter } from "../init";
import { productsRouter } from "@/modules/products/server/procedures";
import { categoryRouter } from "@/modules/category/server/procedures";
import { subcategoryRouter } from "@/modules/subcategory/server/procedures";
import { stockRouter } from "@/modules/stock/server/procedures";
import { customersRouter } from "@/modules/customers/server/procedures";
import { ordersRouter } from "@/modules/orders/server/procedures";
import { searchRouter } from "./search";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  warehouse: warehouseRouter,
  category: categoryRouter,
  subcategory: subcategoryRouter,
  stock: stockRouter,
  customers: customersRouter,
  orders: ordersRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
