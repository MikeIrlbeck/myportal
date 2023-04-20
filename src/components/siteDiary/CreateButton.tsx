import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { PlusSquareFill } from "@styled-icons/bootstrap";
import { Close } from "@styled-icons/ionicons-outline";
import { useState, type BaseSyntheticEvent } from "react";
import ReactDatePicker from "react-datepicker";
import type { ControllerRenderProps } from "react-hook-form";
import { Controller, useForm, type FieldValues } from "react-hook-form";
import { useCreateSiteDiary } from "../../hooks/siteDiary";

const CreateButton = ({ projectId }: { projectId: string }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const { createSiteDiary } = useCreateSiteDiary();
  const onSubmit = (
    data: FieldValues,
    e: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => {
    e?.preventDefault();
    setOpen(false);
    reset();
    createSiteDiary({
      projectId: projectId,
      siteDiaryDate: data.date as Date,
      siteDiaryName: data.name as string,
    });
  };
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <PlusSquareFill className="h-6 w-6  text-blue-500" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 animate-fade-in bg-gray-500 bg-opacity-75 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 ">
          <Dialog.Title className="mt-3 text-left text-lg font-bold capitalize leading-6 text-gray-900 sm:mt-5">
            new site diary
          </Dialog.Title>
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <fieldset className="mb-4 flex items-center gap-5">
              <div className="sm:flex sm:flex-1 sm:flex-row sm:gap-2">
                <input
                  className={`mt-5 mb-3 h-10 w-full rounded-lg border border-gray-300 py-2 px-4 text-center focus:border-blue-300 focus:outline-none sm:col-start-1 ${
                    errors.name && "border-red-400  focus:border-red-400 "
                  }`}
                  id="name"
                  placeholder="Name of new site diary"
                  {...register("name", { required: true })}
                />

                <Controller
                  name="date"
                  control={control}
                  defaultValue={new Date()}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FieldValues, "date">;
                  }) => {
                    const value = field.value as Date;
                    const { onChange, name } = field;
                    return (
                      <ReactDatePicker
                        name={name}
                        selected={value}
                        className={`mt-5 mb-3 h-10 py-2 px-4 text-center focus:border-blue-300 focus:outline-none sm:col-start-2 ${
                          errors.date && "border-red-400   focus:ring-red-400"
                        }`}
                        onChange={(date) => {
                          if (date) {
                            const d = new Date();
                            date.setHours(d.getHours());
                            date.setMinutes(d.getMinutes());
                            date.setSeconds(d.getSeconds());
                            date.setMilliseconds(d.getMilliseconds());
                            onChange(date);
                          }
                        }}
                        previousMonthButtonLabel=<ChevronLeftIcon />
                        nextMonthButtonLabel=<ChevronRightIcon />
                        popperClassName="react-datepicker-bottom"
                      />
                    );
                  }}
                />
              </div>
            </fieldset>
            {errors.name && (
              <span className="flex justify-center text-xs italic text-red-400">
                Name is required
              </span>
            )}
            {errors.date && (
              <span className="flex justify-center text-xs italic text-red-400">
                Date is required
              </span>
            )}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-50 disabled:text-blue-200 sm:col-start-2"
                type="submit"
                disabled={!!(errors.name || errors.date)}
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
