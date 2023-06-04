import type { SupplierInvoice } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import parse from "date-fns/parse";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useRef, useState, type BaseSyntheticEvent } from "react";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PermissionToProject from "../../../../components/auth/PermissionToProject";
import SessionAuth from "../../../../components/auth/SessionAuth";
import type { SupplierInvoiceItem } from "../../../../components/invoice/InvoiceItem";
import InvoiceItem from "../../../../components/invoice/InvoiceItem";
import { env } from "../../../../env/client.mjs";
import { useGetBudgets } from "../../../../hooks/budget";
import { useGetPreSignedURLForDownload } from "../../../../hooks/s3";

import SelectList from "../../../../components/common/SelectList";
import {
  useGetSupplierInvoice,
  useUpdateSupplierInvoice,
} from "../../../../hooks/supplierInvoice";

const SupplierInvoiceView = () => {
  const router = useRouter();
  const hiddenAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const projectId = router.query.projectId as string;
  const supplierInvoiceId = router.query.supplierInvoiceId as string;

  const [supplierInvoiceItems, setSupplierInvoiceItems] = useState<
    SupplierInvoiceItem[]
  >([]);
  const { supplierInvoiceData, isLoading } = useGetSupplierInvoice({
    supplierInvoiceId: supplierInvoiceId,
    onSucess: (supplierInvoiceItems: SupplierInvoiceItem[]) =>
      setSupplierInvoiceItems(supplierInvoiceItems),
  });
  const { updateSupplierInvoice } = useUpdateSupplierInvoice({
    projectId: projectId,
  });
  const { budgets } = useGetBudgets({
    projectId: projectId,
    pageSize: 100,
    pageIndex: 0,
    searchKey: "",
  });
  const { getPreSignedURLForDownload } = useGetPreSignedURLForDownload();

  const onInvoiceUpdate = (invoiceItem: SupplierInvoiceItem, index: number) => {
    const newSupplierInvoiceItems = [...supplierInvoiceItems];
    newSupplierInvoiceItems[index] = invoiceItem;
    setSupplierInvoiceItems(newSupplierInvoiceItems);
  };

  const removeInvoiceItem = (index: number) => {
    const newSupplierInvoiceItems = [...supplierInvoiceItems];
    newSupplierInvoiceItems.splice(index, 1);
    setSupplierInvoiceItems(newSupplierInvoiceItems);
  };

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<SupplierInvoice>({
    values: supplierInvoiceData,
  });

  const onSubmit = (
    data: SupplierInvoice,
    e: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => {
    e?.preventDefault();
    reset();
    updateSupplierInvoice({
      ...data,
      projectId: projectId,
      supplierInvoiceItems: supplierInvoiceItems,
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
        {isLoading || !supplierInvoiceItems ? (
          <div>Loading...</div>
        ) : (
          supplierInvoiceData && (
            <main>
              <div className="pt-5">
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                    <div className="mx-auto text-left lg:mx-0 lg:text-left">
                      <form
                        className="m-8"
                        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                      >
                        {supplierInvoiceData.fileId && (
                          <div className="text-right">
                            <button
                              type="button"
                              className="inline-flex items-center rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => {
                                e.preventDefault();
                                void handleDownloadFile();
                              }}
                            >
                              <svg
                                className="mr-2 h-4 w-4 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                              </svg>
                              Download Invoice
                            </button>
                          </div>
                        )}
                        <div className="mb-6 flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              void router.push(
                                "/projects/" + projectId + "/invoice"
                              );
                            }}
                            title="Back"
                            className="mx-2 block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                              />
                            </svg>
                          </button>
                          <h2 className="px-3 py-2 text-2xl font-bold uppercase tracking-wider">
                            Invoice
                          </h2>
                        </div>

                        <div className="mb-8 flex justify-between">
                          <div className="w-2/4">
                            <div className="mb-2 items-center md:mb-1 md:flex">
                              <label className="block w-32 text-sm font-bold uppercase tracking-wide text-gray-800">
                                Invoice No.
                              </label>
                              <div className="flex-1">
                                <Controller
                                  name="invoiceNo"
                                  control={control}
                                  rules={{ required: true }}
                                  render={() => {
                                    return (
                                      <input
                                        className={`mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 leading-tight focus:border-blue-500 focus:outline-none
                                        ${
                                          errors.invoiceNo
                                            ? "border-red-400  focus:border-red-400"
                                            : ""
                                        }`}
                                        type="text"
                                        placeholder="Invoice No"
                                        defaultValue={
                                          supplierInvoiceData?.invoiceNo
                                        }
                                        {...register("invoiceNo")}
                                      />
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="mb-2 items-center md:mb-1 md:flex">
                              <label className="block w-32 text-sm font-bold uppercase tracking-wide text-gray-800">
                                Invoice Date
                              </label>
                              <div className="flex-1">
                                <Controller
                                  name="invoiceDate"
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                      <ReactDatePicker
                                        selected={
                                          value == undefined
                                            ? null
                                            : typeof value == "string"
                                            ? parse(
                                                value,
                                                "dd/MM/yyyy",
                                                new Date()
                                              )
                                            : value
                                        }
                                        className={`mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 leading-tight focus:border-blue-500 focus:outline-none ${
                                          errors.invoiceDate
                                            ? "border-red-400  focus:border-red-400 "
                                            : ""
                                        }`}
                                        onChange={(date) => {
                                          if (date) {
                                            date.setHours(0, 0, 0, 0);
                                            onChange(date);
                                          }
                                        }}
                                        previousMonthButtonLabel={
                                          <ChevronLeftIcon className="h-6 w-6 text-slate-500" />
                                        }
                                        nextMonthButtonLabel={
                                          <ChevronRightIcon className="h-6 w-6 text-slate-500" />
                                        }
                                        popperClassName="react-datepicker-bottom"
                                        placeholderText="From (dd/mm/yyyy)"
                                        dateFormat="dd/MM/yyyy"
                                      />
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="mb-2 items-center md:mb-1 md:flex">
                              <label className="block w-32 text-sm font-bold uppercase tracking-wide text-gray-800">
                                Cost code
                              </label>
                              <div className="flex-1">
                                <Controller
                                  name="budgetId"
                                  rules={{ required: true }}
                                  control={control}
                                  render={({ field }) => {
                                    const { onChange, value } = field;

                                    const budgetOptions = budgets.map(
                                      (budget) => ({
                                        value: budget.id,
                                        label: `${budget.costCode} (${budget.description})`,
                                      })
                                    );
                                    const selected = budgetOptions.find(
                                      (budgetOption) =>
                                        budgetOption.value == value
                                    );
                                    return (
                                      <SelectList
                                        selected={selected}
                                        options={budgetOptions}
                                        onChange={(option) =>
                                          onChange(option.value)
                                        }
                                        error={errors.budgetId ? true : false}
                                      />
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-8 flex flex-wrap justify-between">
                          <div className="mb-2 w-full md:mb-0 md:w-1/3">
                            <label className="mb-1 block text-sm font-bold uppercase tracking-wide text-gray-800">
                              Vendor name
                            </label>
                            <Controller
                              name="vendorName"
                              control={control}
                              rules={{ required: true }}
                              render={() => {
                                return (
                                  <input
                                    className={`mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 leading-tight focus:border-blue-500 focus:outline-none ${
                                      errors.vendorName
                                        ? "border-red-400  focus:border-red-400 "
                                        : ""
                                    }`}
                                    type="text"
                                    placeholder="Vendor Name"
                                    defaultValue={
                                      supplierInvoiceData?.vendorName
                                    }
                                    {...register("vendorName")}
                                  />
                                );
                              }}
                            />
                          </div>
                          <div className="w-full md:w-1/3">
                            <label className="mb-1 block text-sm font-bold uppercase tracking-wide text-gray-800">
                              Supplier information
                            </label>
                            <Controller
                              name="supplierName"
                              control={control}
                              rules={{ required: true }}
                              render={() => {
                                return (
                                  <input
                                    className={`mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 leading-tight focus:border-blue-500 focus:outline-none ${
                                      errors.supplierName
                                        ? "border-red-400  focus:border-red-400 "
                                        : ""
                                    }`}
                                    type="text"
                                    placeholder="Supplier Name"
                                    defaultValue={
                                      supplierInvoiceData?.supplierName
                                    }
                                    {...register("supplierName")}
                                  />
                                );
                              }}
                            />
                            <Controller
                              name="supplierAddress"
                              control={control}
                              render={() => {
                                return (
                                  <input
                                    className="mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 leading-tight focus:border-blue-500 focus:outline-none"
                                    type="text"
                                    placeholder="Supplier Address"
                                    defaultValue={
                                      supplierInvoiceData?.supplierAddress
                                    }
                                    {...register("supplierAddress")}
                                  />
                                );
                              }}
                            />
                            <Controller
                              name="supplierPhone"
                              control={control}
                              render={() => {
                                return (
                                  <input
                                    className="mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 leading-tight focus:border-blue-500 focus:outline-none"
                                    type="text"
                                    placeholder="Supplier Phone"
                                    defaultValue={
                                      supplierInvoiceData?.supplierPhone
                                    }
                                    {...register("supplierPhone")}
                                  />
                                );
                              }}
                            />
                          </div>
                        </div>

                        <div className="-mx-1 flex items-start border-b py-2">
                          <div className="flex-1 px-1">
                            <p className="text-sm font-bold uppercase tracking-wide text-gray-800">
                              Description
                            </p>
                          </div>

                          <div className="w-20 px-1 text-right">
                            <p className="text-sm font-bold uppercase tracking-wide text-gray-800">
                              Quantity
                            </p>
                          </div>

                          <div className="w-20 px-1 text-right">
                            <p className="text-sm font-bold uppercase tracking-wide text-gray-800">
                              Unit
                            </p>
                          </div>

                          <div className="w-32 px-1 text-right">
                            <p className="leading-none">
                              <span className="block text-sm font-bold uppercase tracking-wide text-gray-800">
                                Unit Price
                              </span>
                            </p>
                          </div>

                          <div className="w-32 px-1 text-right">
                            <p className="leading-none">
                              <span className="block text-sm font-bold uppercase tracking-wide text-gray-800">
                                Total Price
                              </span>
                            </p>
                          </div>

                          <div className="w-40 px-1 text-center"></div>
                        </div>
                        {supplierInvoiceItems &&
                          supplierInvoiceItems.map((supplierInvoiceItem, i) => {
                            return (
                              <div
                                key={i}
                                className="mx-1 flex items-center border-b py-2"
                              >
                                <div className="flex-1 px-1">
                                  <p className="text-sm tracking-wide text-gray-800">
                                    {supplierInvoiceItem?.description}
                                  </p>
                                </div>

                                <div className="w-20 px-1 text-right">
                                  <p className="text-sm tracking-wide text-gray-800">
                                    {supplierInvoiceItem?.quantity}
                                  </p>
                                </div>

                                <div className="w-20 px-1 text-right">
                                  <p className="text-sm tracking-wide text-gray-800">
                                    {supplierInvoiceItem?.unit}
                                  </p>
                                </div>

                                <div className="w-32 px-1 text-right">
                                  <p className="leading-none">
                                    <span className="block text-sm tracking-wide text-gray-800">
                                      {supplierInvoiceItem?.unitPrice}
                                    </span>
                                  </p>
                                </div>

                                <div className="w-32 px-1 text-right">
                                  <p className="leading-none">
                                    <span className="block text-sm tracking-wide text-gray-800">
                                      {supplierInvoiceItem?.totalPrice}
                                    </span>
                                  </p>
                                </div>
                                <div className="w-40 px-1 text-center">
                                  <InvoiceItem
                                    title="Edit"
                                    index={i}
                                    invoiceItem={supplierInvoiceItem}
                                    onUpdate={(data) => {
                                      onInvoiceUpdate(data, i);
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="focus:shadow-outline mx-1 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
                                    onClick={() => removeInvoiceItem(i)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        <div className="mt-5">
                          <InvoiceItem
                            title="Add new item"
                            invoiceItem={{
                              id: nanoid(),
                              description: "",
                              quantity: 0,
                              unit: "",
                              unitPrice: 0,
                              totalPrice: 0,
                            }}
                            addNew={(newInvoiceItem) => {
                              const newSupplierInvoiceItems = [
                                newInvoiceItem,
                                ...supplierInvoiceItems,
                              ];
                              setSupplierInvoiceItems(newSupplierInvoiceItems);
                            }}
                          />
                        </div>

                        <div className="ml-auto mt-5 w-full py-2 sm:w-2/4 lg:w-1/2">
                          <div className="mb-3 flex justify-between">
                            <div className="mr-2 flex-1 text-right text-gray-800">
                              Subtotal
                            </div>
                            <div className="w-40">
                              <Controller
                                name="subtotal"
                                control={control}
                                rules={{ required: true }}
                                render={() => {
                                  return (
                                    <input
                                      className={`mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 text-right leading-tight focus:border-blue-500 focus:outline-none ${
                                        errors.subtotal
                                          ? "border-red-400  focus:border-red-400 "
                                          : ""
                                      }`}
                                      type="number"
                                      step="0.01"
                                      placeholder="Subtotal"
                                      defaultValue={
                                        supplierInvoiceData?.subtotal
                                      }
                                      {...register("subtotal", {
                                        valueAsNumber: true,
                                      })}
                                    />
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="mb-3 flex justify-between">
                            <div className="mr-2 flex-1 text-right text-gray-800">
                              Discount
                            </div>
                            <div className="w-40">
                              <Controller
                                name="discount"
                                control={control}
                                rules={{ required: true }}
                                render={() => {
                                  return (
                                    <input
                                      className={`mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 text-right leading-tight focus:border-blue-500 focus:outline-none ${
                                        errors.discount
                                          ? "border-red-400  focus:border-red-400 "
                                          : ""
                                      }`}
                                      type="number"
                                      step="0.01"
                                      placeholder="Discount"
                                      defaultValue={
                                        supplierInvoiceData?.discount
                                      }
                                      {...register("discount", {
                                        valueAsNumber: true,
                                      })}
                                    />
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="mb-3 flex justify-between">
                            <div className="mr-2 flex-1 text-right text-gray-800">
                              Taxes
                            </div>
                            <div className="w-40">
                              <Controller
                                name="taxes"
                                control={control}
                                rules={{ required: true }}
                                render={() => {
                                  return (
                                    <input
                                      className={`mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 text-right leading-tight focus:border-blue-500 focus:outline-none ${
                                        errors.taxes
                                          ? "border-red-400  focus:border-red-400 "
                                          : ""
                                      }`}
                                      type="number"
                                      step="0.01"
                                      placeholder="Taxes"
                                      defaultValue={supplierInvoiceData?.taxes}
                                      {...register("taxes", {
                                        valueAsNumber: true,
                                      })}
                                    />
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <div className="border-b border-t py-2">
                            <div className="flex justify-between">
                              <div className="mr-2 flex-1 text-right text-xl text-gray-800">
                                Total
                              </div>
                              <div className="w-40">
                                <Controller
                                  name="grandTotal"
                                  control={control}
                                  rules={{ required: true }}
                                  render={() => {
                                    return (
                                      <input
                                        className={`mb-1 w-full rounded border-2 border-gray-200 px-1 py-2 text-right leading-tight focus:border-blue-500 focus:outline-none ${
                                          errors.grandTotal
                                            ? "border-red-400  focus:border-red-400 "
                                            : ""
                                        }`}
                                        type="number"
                                        step="0.01"
                                        placeholder="Grand Amount"
                                        defaultValue={
                                          supplierInvoiceData?.grandTotal
                                        }
                                        {...register("grandTotal", {
                                          valueAsNumber: true,
                                        })}
                                      />
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-50 disabled:text-blue-200"
                          type="submit"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <a ref={hiddenAnchorRef} />
              </div>
            </main>
          )
        )}
      </PermissionToProject>
    </SessionAuth>
  );
};

export default SupplierInvoiceView;
