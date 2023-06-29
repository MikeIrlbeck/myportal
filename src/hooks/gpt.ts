import { isValid, parse } from "date-fns";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import type { z } from "zod";
// import type { gptOutputSchema } from "../schema/gpt";
import type { updateSupplierInvoiceSchema } from "../schema/supplierInvoice";
import { api } from "../utils/api";

type SchemaWithId = z.infer<typeof updateSupplierInvoiceSchema>;
// type gptOutputSchema = z.infer<typeof gptOutputSchema>;

// could not get a return type of 'useExtractInvoiceInfo' to work
// type ExtractInvoiceInfoResult = {
//   data: SchemaWithId | undefined;
//   isLoading: boolean;
//   extractInvoiceInfo: UseMutateFunction<{
//     invoiceNo: string;
//     invoiceDate: string;
//     supplierName: string;
//     subtotal: number;
//     taxes: number;
//     discount: number;
//     grandTotal: number;
//     supplierInvoiceItems: {
//       description: string;
//       quantity: number;
//       unit: string;
//       unitPrice: number;
//       totalPrice: number;
//     }[];
//   }>;
// };

export const useExtractInvoiceInfo = () => {
  const {
    data,
    isLoading,
    mutate: extractInvoiceInfo,
  } = api.gpt.extractInvoiceInfo.useMutation();

  return {
    // we need useMemo here. Read "2. In the render function"
    // https://tkdodo.eu/blog/react-query-data-transformations
    // the reason is b/c we're doing a setSupplierInvoiceItems
    // in useEffect which causes a re-render
    data: useMemo(
      () =>
        data
          ? ({
              ...data,
              id: "",
              fileId: "",
              budgetId: "",
              paid: false,
              approved: false,
              invoiceDate: isValid(
                parse(data.invoiceDate, "dd/MM/yyyy", new Date())
              )
                ? parse(data.invoiceDate, "dd/MM/yyyy", new Date())
                : new Date(),
              supplierInvoiceItems: data.supplierInvoiceItems.map(
                (supplierInvoiceItem) => {
                  return {
                    ...supplierInvoiceItem,
                    id: nanoid(),
                  };
                }
              ),
            } as SchemaWithId)
          : undefined,
      [data]
    ),
    // data,
    isLoading,
    extractInvoiceInfo,
  };
};
