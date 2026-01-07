import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import db from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { customerInsertSchema, customerUpdateSchema } from "../schemas";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const customersRouter = createTRPCRouter({
  findByEmail: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const customer = await db.customer.findUnique({
        where: { email: input.email },
      });

      if (!customer) return null;

      return customer;
    }),
  // create: baseProcedure
  //   .input(customerInsertSchema)
  //   .mutation(async ({ input }) => {
  //     const customer = await db.customer.create({
  //       data: {
  //         name: input.name,
  //         email: input.email,
  //         phone: input.phone,
  //         address: input.address,
  //       },
  //     });
  //     return customer;
  //   }),
  create: baseProcedure
    .input(customerInsertSchema)
    .mutation(async ({ input }) => {
      const email = normalizeEmail(input.email);

      try {
        const customer = await db.customer.upsert({
          where: { email },
          create: {
            name: input.name,
            email,
            phone: input.phone,
            address: input.address,
            city: input.city,
            state: input.state,
            country: input.country,
            zipCode: input.zipCode,
          },
          update: {
            name: input.name,
            phone: input.phone,
            address: input.address,
            city: input.city,
            state: input.state,
            country: input.country,
            zipCode: input.zipCode,
          },
        });

        return customer;
      } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Ya existe un cliente con ese email.",
              cause: err,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No se pudo crear/actualizar el cliente",
          cause: err,
        });
      }
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(100).default(20),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;
      const where = search
        ? {
            OR: [
              {
                name: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
              {
                email: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
              {
                phone: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
            ],
          }
        : {};
      const [items, total] = await Promise.all([
        db.customer.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        db.customer.count({ where }),
      ]);
      return { items, total, totalPages: Math.ceil(total / pageSize) };
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const customer = await db.customer.findUnique({
        where: { id: input.id },
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cliente no encontrado.",
        });
      }
      return customer;
    }),
  update: protectedProcedure
    .input(customerUpdateSchema)
    .mutation(async ({ input }) => {
      const customer = await db.customer.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
        },
      });
      return customer;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const customer = await db.customer.findUnique({
        where: { id: input.id },
      });
      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cliente no encontrado.",
        });
      }
      await db.customer.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
