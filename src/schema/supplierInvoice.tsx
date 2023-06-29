import { z } from "zod";

export const SupplierInvoiceItemSchema = z.object({
  id: z.string().trim().min(1, "An id is required"),
  description: z.string().trim().min(1, "A description is required"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .positive({ message: "Quantity must be positive" }),
  unit: z.string(),
  unitPrice: z
    .number({ invalid_type_error: "Unit price must be a number" })
    .positive({ message: "Unit price must be positive" }),
  totalPrice: z
    .number({ invalid_type_error: "Total price must be a number" })
    .positive({ message: "Total price must be positive" }),
});

export const createSupplierInvoiceSchema = z.object({
  invoiceNo: z.string().trim().min(1, "An invoice number is required"),
  invoiceDate: z.date(),
  supplierName: z.string().trim().min(1, "A supplier name is required"),
  subtotal: z
    .number({ invalid_type_error: "Subtotal must be a number" })
    .positive({ message: "Subtotal must be positive" }),
  taxes: z.number({ invalid_type_error: "Taxes must be a number" }),
  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .positive({ message: "Discount must be positive" }),
  grandTotal: z
    .number({ invalid_type_error: "Total must be a number" })
    .positive({ message: "Total must be positive" }),
  fileId: z.string().optional(),
  projectId: z.string(),
  budgetId: z.string(),
  paid: z.boolean(),
  approved: z.boolean(),
  supplierInvoiceItems: z.array(SupplierInvoiceItemSchema.omit({ id: true })),
});
export const updateSupplierInvoiceSchema = createSupplierInvoiceSchema
  .omit({ supplierInvoiceItems: true })
  .extend({
    id: z.string(),
    supplierInvoiceItems: z.array(SupplierInvoiceItemSchema),
  });

export const getSupplierInvoicesSchema = z.object({
  projectId: z.string(),
  approved: z.boolean().optional(),
  budgetId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getSupplierInvoicesForCSVDownloadSchema =
  getSupplierInvoicesSchema;

export const getSupplierInvoiceSchema = z.object({
  supplierInvoiceId: z.string(),
});

export const deleteSupplierInvoiceSchema = z.object({
  supplierInvoiceId: z.string(),
});
