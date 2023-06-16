import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusSquareFill } from "@styled-icons/bootstrap";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useCreateLaborer } from "../../../hooks/laborer";
import { createLaborerSchema } from "../../../schema/laborer";
type FormValues = z.infer<typeof createLaborerSchema>;

const CreateButton = ({ siteDiaryId }: { siteDiaryId: string }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createLaborerSchema),
    defaultValues: {
      siteDiaryId: siteDiaryId,
      laborerType: "",
      laborerAmount: 1,
    },
  });
  const { createLaborer } = useCreateLaborer();
  const onSubmit = (
    data: FormValues,
    e: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => {
    e?.preventDefault();
    setOpen(false);
    reset();
    createLaborer({
      laborerType: data.laborerType,
      laborerAmount: data.laborerAmount,
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
          aria-describedby="Create a new laborer"
        >
          <Dialog.Title className="mt-3 text-left text-lg font-bold capitalize leading-6 text-gray-900 sm:mt-5">
            new laborer
          </Dialog.Title>
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <fieldset className="mb-4 gap-3 sm:mb-7 sm:flex ">
              <div className="flex flex-grow flex-col">
                <label
                  className="mb-1 w-24 text-left text-base capitalize text-gray-900  sm:flex sm:items-end"
                  htmlFor="laborerType"
                >
                  Type
                </label>
                <input
                  className={`mb-3 h-10 w-full rounded-lg border border-gray-300 px-4 py-0 text-center focus:border-blue-300 focus:outline-none  sm:mb-0 sm:text-left ${
                    errors.laborerType
                      ? "border-red-400  focus:border-red-400 "
                      : ""
                  }`}
                  id="laborerType"
                  placeholder="e.g. Bricklayer"
                  {...register("laborerType", { required: true })}
                />
              </div>

              <div className="flex flex-grow flex-col">
                <label
                  className="mb-1 w-24 text-left text-base capitalize text-gray-900  sm:flex sm:items-end"
                  htmlFor="laborerAmount"
                >
                  Quantity
                </label>
                <input
                  className={`mb-3 h-10 w-full rounded-lg border border-gray-300 px-4 py-0 text-center focus:border-blue-300 focus:outline-none  sm:mb-0 sm:text-left ${
                    errors.laborerAmount
                      ? "border-red-400  focus:border-red-400 "
                      : ""
                  }`}
                  id="laborerAmount"
                  placeholder="Nr."
                  type="number"
                  {...register("laborerAmount", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
            </fieldset>
            {errors.laborerType && (
              <span className="flex justify-center text-xs italic text-red-400">
                {errors.laborerType.message}
              </span>
            )}
            {errors.laborerAmount && (
              <span className="flex justify-center text-xs italic text-red-400">
                {errors.laborerAmount.message}
              </span>
            )}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-50 disabled:text-blue-200 sm:col-start-2"
                type="submit"
                disabled={!!(errors.laborerType || errors.laborerAmount)}
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
