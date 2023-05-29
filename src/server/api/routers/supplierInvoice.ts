import { z } from "zod";
import { trycatch } from "../../../utils/trycatch";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
  supplierInvoiceDetails: z.array(
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
  supplierInvoiceDetails: z.array(
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
      return await trycatch({
        fn: () => {
          const { supplierInvoiceDetails, ...rest } = input;
          return ctx.prisma.$transaction(async (tx) => {
            const newSupplierInvoice = await tx.supplierInvoice.create({
              data: {
                ...rest,
                createdById: ctx.session.user.id,
              },
            });
            await tx.supplierInvoiceDetail.createMany({
              data: supplierInvoiceDetails.map((supplierInvoiceDetail) => {
                return {
                  createdById: ctx.session.user.id,
                  supplierInvoiceId: newSupplierInvoice.id,
                  ...supplierInvoiceDetail,
                };
              }),
            });
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
                supplierInvoiceDetails: {
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
          return supplierInvoice;
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
          const { supplierInvoiceDetails, ...other } = input;
          // https://github.com/prisma/prisma/issues/2255#issuecomment-683811551
          return ctx.prisma.supplierInvoice.update({
            where: {
              id: other.id,
            },
            data: {
              ...other,
              supplierInvoiceDetails: {
                deleteMany: {
                  supplierInvoiceId: other.id,
                  NOT: input.supplierInvoiceDetails.map(({ id }) => ({ id })),
                },
                upsert: input.supplierInvoiceDetails.map(
                  (supplierInvoiceDetail) => {
                    const { id, ...rest } = supplierInvoiceDetail;
                    return {
                      where: { id: id },
                      update: { ...rest },
                      create: {
                        createdById: ctx.session.user.id,
                        ...rest,
                      },
                    };
                  }
                ),
              },
            },

            // // How to upsert many https://github.com/prisma/prisma/discussions/7547
            // const promises = input.supplierInvoiceDetails.map(
            //   async (supplierInvoiceDetail) => {
            //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
            //     const { id, ...rest } = supplierInvoiceDetail; // we omit the id property if we were to create the object
            //     return tx.supplierInvoiceDetail.upsert({
            //       where: { id: id },
            //       update: { ...rest },
            //       create: {
            //         supplierInvoiceId: supplierInvoice.id,
            //         createdById: ctx.session.user.id,
            //         ...rest,
            //       },
            //     });
            //   }
            // );

            // await Promise.all(promises);
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
