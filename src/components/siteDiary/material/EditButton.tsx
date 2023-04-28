import type { MaterialUnit } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { Edit } from "@styled-icons/boxicons-solid/";
import { Close } from "@styled-icons/ionicons-outline";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useUpdateMaterial } from "../../../hooks/material";
import type { Material } from "./MaterialView";

const EditButton = ({
  material,
  siteDiaryId,
}: {
  material: Material;
  siteDiaryId: string;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      type: material.type,
      units: material.units,
      amount: material.amount,
    },
  });
  const { updateMaterial } = useUpdateMaterial({ siteDiaryId: siteDiaryId });
  const onSubmit = (
    data: FieldValues,
    e: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => {
    e?.preventDefault();
    setOpen(false);
    reset();
    updateMaterial({
      materialId: material.id,
      materialType: data.type as string,
      materialUnits: data.units as MaterialUnit,
      materialAmount: data.amount as number,
    });
  };
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Edit className="h-6 w-6  text-green-500" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 animate-fade-in bg-slate-300" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-content-show rounded-md bg-white p-6 shadow-md focus:outline-none">
          <Dialog.Title className="m-0 font-medium text-gray-800">
            Edit material
          </Dialog.Title>
          <Dialog.Description className="mx-0 mb-5 mt-3 text-sm text-gray-400">
            Edit your material here. Click save when you are done.
          </Dialog.Description>
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <fieldset className="mb-4 flex items-center gap-5">
              <label
                className="w-24 text-right text-sm text-blue-300"
                htmlFor="type"
              >
                Type
              </label>
              <div>
                <input
                  className={`inline-flex h-8  flex-1 items-center justify-center rounded-md px-3 py-0 text-sm text-blue-500 shadow-sm shadow-blue-200 focus:border-2
                focus:border-blue-300  focus:outline-none ${
                  errors.type
                    ? "border-2 border-red-400 focus:border-2 focus:border-red-400"
                    : ""
                }`}
                  id="type"
                  defaultValue="My new material type"
                  {...register("type", { required: true })}
                />
              </div>
              <label
                className="w-24 text-right text-sm text-blue-300"
                htmlFor="units"
              >
                Units
              </label>
              <div>
                <select
                  id="units"
                  defaultValue="M"
                  {...register("units", { required: true })}
                  className={`inline-flex h-8  flex-1 items-center justify-center rounded-md bg-white px-3 py-0 text-sm text-blue-500 shadow-sm shadow-blue-200 focus:border-2
                focus:border-blue-300  focus:outline-none ${
                  errors.units
                    ? "border-2 border-red-400 focus:border-2 focus:border-red-400"
                    : ""
                }`}
                >
                  <option value="M">M</option>
                  <option value="M2">M2</option>
                  <option value="M3">M3</option>
                  <option value="NR">NR</option>
                </select>
              </div>

              <label
                className="w-24 text-right text-sm text-blue-300"
                htmlFor="amount"
              >
                Amount
              </label>
              <div>
                <input
                  className={`inline-flex h-8  flex-1 items-center justify-center rounded-md px-3 py-0 text-sm text-blue-500 shadow-sm shadow-blue-200 focus:border-2
                focus:border-blue-300  focus:outline-none ${
                  errors.amount
                    ? "border-2 border-red-400 focus:border-2 focus:border-red-400"
                    : ""
                }`}
                  id="amount"
                  defaultValue={1}
                  type="number"
                  {...register("amount", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
            </fieldset>
            {errors.type && (
              <span className="flex justify-center text-xs italic text-red-400">
                Type is required
              </span>
            )}
            {errors.units && (
              <span className="flex justify-center text-xs italic text-red-400">
                Units is required
              </span>
            )}
            {errors.amount && (
              <span className="flex justify-center text-xs italic text-red-400">
                Amount is required
              </span>
            )}
            <div className="mt-6 flex justify-end">
              <button
                className="inline-flex h-9 items-center justify-center rounded-md bg-blue-100 px-4 py-0 text-sm font-medium text-blue-700 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-200"
                type="submit"
                disabled={!!(errors.type || errors.units || errors.amount)}
              >
                Update
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-blue-200 focus:border-2 focus:border-blue-500 focus:outline-none"
                aria-label="Close"
                type="button"
              >
                <Close className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditButton;
