import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useRef, useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";
import PermissionToProject from "../../../../components/auth/PermissionToProject";
import SessionAuth from "../../../../components/auth/SessionAuth";
import InvoiceEditableForm from "../../../../components/invoice/InvoiceEditableForm";
import { env } from "../../../../env/client.mjs";
import { useGetBudget } from "../../../../hooks/budget";
import { useGetPreSignedURLForDownload } from "../../../../hooks/s3";
import {
  useGetSupplierInvoice,
  useUpdateSupplierInvoice,
} from "../../../../hooks/supplierInvoice";
import type { SupplierInvoiceItemSchema } from "../../../../schema/supplierInvoice";
import { updateSupplierInvoiceSchema } from "../../../../schema/supplierInvoice";

type FormValues = z.infer<typeof updateSupplierInvoiceSchema>;
type ItemSchema = z.infer<typeof SupplierInvoiceItemSchema>;

const SupplierInvoiceView = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const supplierInvoiceId = router.query.supplierInvoiceId as string;
  const hiddenAnchorRef = useRef<HTMLAnchorElement | null>(null);

  const [supplierInvoiceItems, setSupplierInvoiceItems] = useState<
    ItemSchema[] | undefined
  >(undefined);

  const { supplierInvoiceData, isLoading } = useGetSupplierInvoice({
    supplierInvoiceId: supplierInvoiceId,
    onSucess: (supplierInvoiceItems: ItemSchema[]) =>
      setSupplierInvoiceItems(supplierInvoiceItems),
  });

  const { getPreSignedURLForDownload } = useGetPreSignedURLForDownload();

  const onInvoiceItemUpdate = (invoiceItem: ItemSchema, index: number) => {
    if (!supplierInvoiceItems) return;
    const newSupplierInvoiceItems = [...supplierInvoiceItems];
    newSupplierInvoiceItems[index] = invoiceItem;
    setSupplierInvoiceItems(newSupplierInvoiceItems);
  };

  const removeInvoiceItem = (index: number) => {
    if (!supplierInvoiceItems) return;
    const newSupplierInvoiceItems = [...supplierInvoiceItems];
    newSupplierInvoiceItems.splice(index, 1);
    setSupplierInvoiceItems(newSupplierInvoiceItems);
  };

  const useFormReturn = useForm<FormValues>({
    resolver: zodResolver(updateSupplierInvoiceSchema),
    defaultValues: {
      id: "",
      invoiceNo: "",
      invoiceDate: new Date(),
      supplierName: "",
      subtotal: 0,
      taxes: 0,
      discount: 0,
      grandTotal: 0,
      fileId: "",
      budgetId: "",
      paid: false,
      approved: false,
      supplierInvoiceItems: [],
    },
    values: supplierInvoiceData,
  });

  console.log(useFormReturn.getValues().budgetId);
  const { budget } = useGetBudget({
    budgetId: useFormReturn.getValues().budgetId,
    enabled: useFormReturn.getValues().budgetId !== "",
  });
  const { updateSupplierInvoice } = useUpdateSupplierInvoice({
    projectId: projectId,
    budget: budget,
  });

  const onSubmit = (
    data: FormValues,
    e: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => {
    e?.preventDefault();
    updateSupplierInvoice({
      ...data,
      projectId: projectId,
      fileId: data.fileId !== "" ? data.fileId : undefined,
      supplierInvoiceItems: supplierInvoiceItems || [],
    });
    void router.push("/projects/" + projectId + "/invoice/");
  };

  const handleDownloadFile = async () => {
    try {
      const fileId = supplierInvoiceData?.fileId;
      if (fileId) {
        const { preSignedURLForDownload } = await getPreSignedURLForDownload({
          fileId: projectId + "/" + fileId,
          projectId: projectId,
          aws_s3_bucket_name: env.NEXT_PUBLIC_AWS_S3_INVOICES_BUCKET_NAME,
        });
        const res = await fetch(preSignedURLForDownload, {
          method: "GET",
        });
        const url = window.URL.createObjectURL(new Blob([await res.blob()]));
        if (hiddenAnchorRef.current) {
          hiddenAnchorRef.current.href = url;
          hiddenAnchorRef.current.download = fileId;
          hiddenAnchorRef.current.click();
        }
      }
    } catch (error) {
      toast.error("Error when downloading file");
      // This try catch is necessary as getPreSignedURLForDownload
      // returns a promise that can possibly cause a runtime error.
      // we handle this error in src/utils/api.ts so there's no need
      // to do anything here other than catch the error.
    }
  };

  return (
    <SessionAuth>
      <PermissionToProject projectId={projectId}>
        <main>
          <div className="pt-5">
            <InvoiceEditableForm
              onSubmit={onSubmit}
              fileId={supplierInvoiceData?.fileId || undefined}
              handleDownloadFile={handleDownloadFile}
              useFormReturn={useFormReturn}
              supplierInvoiceItems={supplierInvoiceItems}
              setSupplierInvoiceItems={setSupplierInvoiceItems}
              onInvoiceItemUpdate={onInvoiceItemUpdate}
              removeInvoiceItem={removeInvoiceItem}
              isLoading={isLoading}
            />
            <a ref={hiddenAnchorRef} />
          </div>
        </main>
      </PermissionToProject>
    </SessionAuth>
  );
};

export default SupplierInvoiceView;
