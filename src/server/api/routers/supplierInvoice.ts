import { z } from "zod";
import { trycatch } from "../../../utils/trycatch";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const createSupplierInvoiceSchema = z.object({
  description: z.string(),
  invoiceNo: z.string(),
  invoiceDate: z.date(),
  vendorName: z.string(),
  vendorAddress: z.string(),
  vendorPhone: z.string(),
  supplierName: z.string(),
  supplierAddress: z.string(),
  supplierPhone: z.string(),
  amount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  fileId: z.string(),
  projectId: z.string(),
  budgetId: z.string(),
  supplierInvoiceItem: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      uom: z.string(),
      unitPrice: z.number(),
      discount: z.number(),
      amount: z.number(),
    })
  ),
});

export const getSupplierInvoicesSchema = z.object({
  projectId: z.string(),
});

export const getSupplierInvoicesFilterSchema = z.object({
  projectId: z.string(),
  budgetId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getSupplierInvoiceSchema = z.object({
  supplierInvoiceId: z.string(),
});

export const updateSupplierInvoiceSchema = z.object({
  id: z.string(),
  description: z.string(),
  invoiceNo: z.string(),
  invoiceDate: z.date(),
  vendorName: z.string(),
  vendorAddress: z.string(),
  vendorPhone: z.string(),
  supplierName: z.string(),
  supplierAddress: z.string(),
  supplierPhone: z.string(),
  amount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  fileId: z.string(),
  projectId: z.string(),
  budgetId: z.string(),
  supplierInvoiceItem: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      quantity: z.number(),
      uom: z.string(),
      unitPrice: z.number(),
      discount: z.number(),
      amount: z.number(),
    })
  ),
});

export const deleteSupplierInvoiceSchema = z.object({
  supplierInvoiceId: z.string(),
});

export const supplierInvoiceRouter = createTRPCRouter({
  createSupplierInvoice: protectedProcedure
    .input(createSupplierInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      return trycatch({
        fn: () => {
          const { supplierInvoiceItem, ...rest } = input;
          return ctx.prisma.supplierInvoice.create({
            data: {
              ...rest,
              createdById: ctx.session.user.id,
              supplierInvoiceItem: {
                createMany: {
                  data: supplierInvoiceItem.map((supplierInvoiceItem) => {
                    return {
                      ...supplierInvoiceItem,
                      createdById: ctx.session.user.id,
                    };
                  }),
                },
              },
            },
          });
        },
        errorMessages: ["Failed to create supplier invoice"],
      })();
    }),
  getSupplierInvoices: protectedProcedure
    .input(getSupplierInvoicesSchema)
    .query(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.supplierInvoice.findMany({
            where: {
              projectId: input.projectId,
            },
            orderBy: {
              createdAt: "desc",
            },
          });
        },
        errorMessages: ["Failed to get supplier invoices"],
      })();
    }),
    getSupplierInvoicesFilter: protectedProcedure
    .input(getSupplierInvoicesFilterSchema)
    .query(async ({ ctx, input }) => {
      return await trycatch({
        fn: async () => {
          if (
            input.startDate &&
            input.endDate &&
            input.startDate > input.endDate
          ) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
            });
          }
          const supplerInvoices = await ctx.prisma.supplierInvoice.findMany({
            where: {
              projectId: input.projectId,
              budgetId: input.budgetId,
              invoiceDate: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
              invoiceNo: true,
              invoiceDate: true,
              supplierName: true,
              budgetId: true,
              totalAmount: true,
              createdBy: {
                select: {
                  name: true,
                },
              },
            },
          });
          return supplerInvoices;
        },
        errorMessages: ["Failed to get supplier invoices"],
      })();
    }),
  getSupplierInvoice: protectedProcedure
    .input(getSupplierInvoiceSchema)
    .query(async ({ ctx, input }) => {
      return await trycatch({
        fn: async () => {
          const supplierInvoice =
            await ctx.prisma.supplierInvoice.findUniqueOrThrow({
              where: {
                id: input.supplierInvoiceId,
              },
              include: {
                supplierInvoiceItem: {
                  select: {
                    id: true,
                    description: true,
                    discount: true,
                    quantity: true,
                    uom: true,
                    unitPrice: true,
                    amount: true,
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                },
              },
            });
          return {
            ...supplierInvoice,
            budgetId: supplierInvoice.budgetId || "", // PLANETSCALE FIX
          };
        },
        errorMessages: ["Failed to get supplier invoice"],
      })();
    }),
  updateSupplierInvoice: protectedProcedure
    .input(updateSupplierInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { supplierInvoiceItem, ...other } = input;
          // https://github.com/prisma/prisma/issues/2255#issuecomment-683811551
          return ctx.prisma.supplierInvoice.update({
            where: {
              id: other.id,
            },
            data: {
              ...other,
              supplierInvoiceItem: {
                deleteMany: {
                  supplierInvoiceId: other.id,
                  NOT: input.supplierInvoiceItem.map(({ id }) => ({ id })),
                },
                upsert: input.supplierInvoiceItem.map(
                  (supplierInvoiceItem) => {
                    const { id, ...rest } = supplierInvoiceItem;
                    return {
                      where: { id: id },
                      update: { ...rest },
                      create: {
                        ...rest,
                        createdById: ctx.session.user.id,
                      },
                    };
                  }
                ),
              },
            },
          });
        },
        errorMessages: ["Failed to update supplier invoice"],
      })();
    }),
  deleteSupplierInvoice: protectedProcedure
    .input(deleteSupplierInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.supplierInvoice.delete({
            where: {
              id: input.supplierInvoiceId,
            },
          });
        },
        errorMessages: ["Failed to delete supplier invoice"],
      })();
    }),
});
