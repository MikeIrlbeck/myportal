import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Delete } from "@styled-icons/fluentui-system-filled";
import type { MutableRefObject } from "react";
import { useDeletePlant } from "../../../hooks/plant";

const DeleteButton = ({
  plantId,
  siteDiaryId,
  pendingDeleteCountRef,
}: {
  plantId: string;
  siteDiaryId: string;
  pendingDeleteCountRef?: MutableRefObject<number>;
}) => {
  const { deletePlant } = useDeletePlant({
    pendingDeleteCountRef: pendingDeleteCountRef,
    siteDiaryId: siteDiaryId,
  });
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Delete className="h-6 w-6 text-red-500" />
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 animate-fade-in bg-slate-300" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-content-show rounded-md bg-white p-6 shadow-md focus:outline-none">
          <AlertDialog.Title className="m-0 font-medium text-gray-800">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="mx-0 mb-5 mt-3 text-sm text-gray-400">
            This action cannot be undone. This will permanently delete this
            plant and remove the data from our servers.
          </AlertDialog.Description>
          <div className="flex justify-end gap-6">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-100 px-4 py-0 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={() =>
                  deletePlant({
                    plantId: plantId,
                  })
                }
                className="inline-flex h-9 items-center justify-center rounded-md bg-red-100 px-4 py-0 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                Yes, delete plant
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default DeleteButton;
