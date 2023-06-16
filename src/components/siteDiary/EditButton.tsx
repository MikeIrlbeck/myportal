import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Edit } from "@styled-icons/boxicons-solid/";
import { useState, type BaseSyntheticEvent } from "react";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useUpdateSiteDiary } from "../../hooks/siteDiary";
import { updateSiteDiarySchema } from "../../schema/siteDiary";

type FormValues = z.infer<typeof updateSiteDiarySchema>;

type siteDiary = {
  id: string;
  name: string;
  date: Date;
  createdBy: { name: string | null };
};

const EditButton = ({
  siteDiary,
  projectId,
}: {
  siteDiary: siteDiary;
  projectId: string;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(updateSiteDiarySchema),
    values: {
      siteDiaryId: siteDiary.id,
      siteDiaryName: siteDiary.name,
      siteDiaryDate: siteDiary.date,
    },
    defaultValues: {
      siteDiaryName: "",
      siteDiaryDate: new Date(),
    },
  });
  const { updateSiteDiary } = useUpdateSiteDiary({ projectId: projectId });
  const onSubmit = (
    data: FormValues,
    e: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => {
    e?.preventDefault();
    setOpen(false);
    updateSiteDiary({
      siteDiaryId: siteDiary.id,
      siteDiaryDate: data.siteDiaryDate,
      siteDiaryName: data.siteDiaryName,
    });
  };
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span className="flex items-center">
          <Edit className="mr-2 h-6 w-6 text-green-500" />
          Edit
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 animate-fade-in bg-gray-500 bg-opacity-75 transition-opacity" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 "
          aria-describedby="Edit existing site diary"
        >
          <Dialog.Title className="mt-3 text-left text-lg font-bold capitalize leading-6 text-gray-900 sm:mt-5">
            Edit site diary
          </Dialog.Title>
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <fieldset className="mb-4 flex items-center gap-5">
              <div className="sm:flex sm:flex-1 sm:flex-row sm:gap-2">
                <input
                  className={`mb-3 mt-5 h-10 w-full rounded-lg border border-gray-300 px-4 py-2 text-center focus:border-blue-300 focus:outline-none sm:col-start-1 ${
                    errors.siteDiaryName
                      ? "border-red-400  focus:border-red-400 "
                      : ""
                  }`}
                  id="siteDiaryName"
                  {...register("siteDiaryName", { required: true })}
                />

                <Controller
                  name="siteDiaryDate"
                  control={control}
                  render={({ field }) => {
                    const { name, value, onChange } = field;
                    return (
                      <ReactDatePicker
                        name={name}
                        selected={value}
                        className={`mb-3 mt-5 h-10 px-4 py-2 text-center focus:border-blue-300 focus:outline-none sm:col-start-2 ${
                          errors.siteDiaryDate
                            ? "border-red-400   focus:ring-red-400"
                            : ""
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
                        previousMonthButtonLabel={
                          <ChevronLeftIcon className="h-6 w-6 text-slate-500" />
                        }
                        nextMonthButtonLabel={
                          <ChevronRightIcon className="h-6 w-6 text-slate-500" />
                        }
                        popperClassName="react-datepicker-bottom"
                        dateFormat="dd/MM/yyyy"
                      />
                    );
                  }}
                />
              </div>
            </fieldset>
            {errors.siteDiaryName && (
              <span className="flex justify-center text-xs italic text-red-400">
                {errors.siteDiaryName.message}
              </span>
            )}
            {errors.siteDiaryDate && (
              <span className="flex justify-center text-xs italic text-red-400">
                {errors.siteDiaryDate.message}
              </span>
            )}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-50 disabled:text-blue-200 sm:col-start-2"
                type="submit"
                disabled={!!(errors.siteDiaryName || errors.siteDiaryDate)}
              >
                Update
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

export default EditButton;
