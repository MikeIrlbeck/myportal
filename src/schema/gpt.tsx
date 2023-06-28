import { z } from "zod";

export const extractInvoiceInfoSchema = z.object({
  inputText: z.string().trim().min(1, "Input text is required"),
});

export const gptOutputSchema = z.object({
  invoiceNo: z.string().describe("The invoice number. Defaults to ''."),
  invoiceDate: z
    .string()
    .describe(
      "The invoice date. Should be returned in the form of dd/mm/yyyy. Defaults to today's date."
    ),
  supplierName: z
    .string()
    .describe(
      "The supplier name. The supplier name should not be mistaken as the vendor name. Defaults to ''."
    ),
  subtotal: z
    .number()
    .describe("The sum of the totalPrice of all items. Defaults to 0."),
  taxes: z
    .number()
    .describe(
      "The taxes incurred. DO NOT multiply the tax with any percentages. Defaults to 0."
    ),
  discount: z.number().describe("The discount given, if any. Defaults to 0."),
  grandTotal: z
    .number()
    .describe("The subtotal plus taxes less discount. Defaults to 0."),
  supplierInvoiceItems: z
    .array(
      z.object({
        description: z
          .string()
          .describe(
            "Item description. DO NOT include unit or quantity in the description. Defaults to ''."
          ),
        quantity: z
          .number()
          .describe(
            "Item quantity. Should be a whole number. Treat synonymous terms like 'Quantity/ (x)' as quantity too. (x) can be any value. Defaults to 0."
          ),
        unit: z
          .string()
          .describe(
            "Item unit. It takes values such as 'M', 'M2', 'M3', 'g', 'kg', 'tons', 'feet', 'NR', or '1'. Defaults to NR."
          ),
        unitPrice: z
          .number()
          .describe(
            "The unit price of an item. It represents a currency or monetary value. Defaults to 0."
          ),
        totalPrice: z
          .number()
          .describe(
            "The total price equals unitPrice multiplied by quantity. Defaults to 0."
          ),
      })
    )
    .describe("Items of the invoice. Defaults to an empty array []."),
});
