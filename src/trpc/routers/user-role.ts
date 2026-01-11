import { createTRPCRouter, baseProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import db from "@/lib/db";

export const meRouter = createTRPCRouter({
  me: baseProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return { role: user?.role ?? "USER" };
  }),
});
