import "server-only";

// import { createCallerFactory } from "@/server/api/trpc";
import { createCallerFactory } from "@/trpc/init";
// import { createTRPCContext } from "@/server/api/trpc";
import { createTRPCContext } from "@/trpc/init";
// import { appRouter } from "@/server/api/root";
import { appRouter } from "@/trpc/routers/_app";

const createCaller = createCallerFactory(appRouter);

export async function getCategoriesForNavbar() {
  const ctx = await createTRPCContext();
  const caller = createCaller(ctx);

  return caller.category.getMany({
    page: 1,
    pageSize: 50,
  });
}
