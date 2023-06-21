import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusSquareFill } from "@styled-icons/bootstrap";
import { useState, type BaseSyntheticEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useCreateMaterial } from "../../../hooks/material";
import { createMaterialSchema } from "../../../schema/material";
import UnitsDropDown from "./UnitsDropDown";
type FormValues = z.infer<typeof createMaterialSchema>;

const CreateButton = ({ siteDiaryId }: { siteDiaryId: string }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      siteDiaryId: siteDiaryId,
      materialType: "",
      materialUnits: "M2",
      materialAmount: 1,
    },
  });
  const { createMaterial } = useCreateMaterial();
  const onSubmit = (
    data: FormValues,
    e: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => {
    e?.preventDefault();
    setOpen(false);
    reset();
    createMaterial({
      materialType: data.materialType,
      materialUnits: data.materialUnits,
      materialAmount: data.materialAmount,
      siteDiaryId: siteDiaryId,
    });
  };
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <PlusSquareFill className="h-6 w-6  text-blue-500" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 animate-fade-in bg-gray-500 bg-opacity-75 transition-opacity" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          aria-describedby="Create a new material"
        >
          <Dialog.Title className="mt-3 text-left text-lg font-bold capitalize leading-6 text-gray-900 sm:mt-5">
            new material
          </Dialog.Title>
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <fieldset className="mb-4 gap-3 sm:mb-7 sm:flex ">
              <div className="flex flex-1 flex-col">
                <label
                  className="mb-1 w-24 text-left text-base capitalize text-gray-900 sm:flex sm:items-end"
                  htmlFor="materialType"
                >
                  Type
                </label>
                <input
                  className={`mb-3 h-10 w-full rounded-lg border border-gray-300 px-4 py-0 text-center focus:border-blue-300 focus:outline-none sm:mb-0 sm:text-left ${
                    errors.materialType
                      ? "border-red-400  focus:border-red-400 "
                      : ""
                  }`}
                  id="materialType"
                  placeholder="e.g. Plywood"
                  {...register("materialType", { required: true })}
                />
              </div>
              <div className="flex flex-col">
                <label
                  className="mb-1 w-24 text-left text-base capitalize text-gray-900 sm:flex sm:items-end"
                  htmlFor="materialUnits"
                >
                  Units
                </label>
                <Controller
                  name="materialUnits"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <UnitsDropDown
                        value={value}
                        onChange={(value) => onChange(value)}
                      />
                    );
                  }}
                />
              </div>

              <div className="flex flex-1 flex-col">
                <label
                  className="mb-1 w-24 text-left text-base capitalize text-gray-900 sm:flex sm:items-end"
                  htmlFor="materialAmount"
                >
                  Quantity
                </label>
                <input
                  className={`mb-3 h-10 w-full rounded-lg border border-gray-300 px-4 py-0 text-center focus:border-blue-300 focus:outline-none sm:mb-0 sm:text-left ${
                    errors.materialAmount
                      ? "border-red-400  focus:border-red-400 "
                      : ""
                  }`}
                  id="materialAmount"
                  placeholder="e.g. 5"
                  type="number"
                  {...register("materialAmount", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
            </fieldset>
            {errors.materialType && (
              <span className="flex justify-center text-xs italic text-red-400">
                {errors.materialType.message}
              </span>
            )}
            {errors.materialUnits && (
              <span className="flex justify-center text-xs italic text-red-400">
                {errors.materialUnits.message}
              </span>
            )}
            {errors.materialAmount && (
              <span className="flex justify-center text-xs italic text-red-400">
                {errors.materialAmount.message}
              </span>
            )}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-50 disabled:text-blue-200 sm:col-start-2"
                type="submit"
                disabled={
                  !!(
                    errors.materialType ||
                    errors.materialUnits ||
                    errors.materialAmount
                  )
                }
              >
                Create
              </button>
              <Dialog.Close asChild>
                <button
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  aria-label="Close"
                  type="button"
                >
                  Cancel
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateButton;
