import { Button, Modal } from "@/components";
import type { BulkFeedbackWarningModalProps } from "./types";

const BulkFeedbackWarningModal = ({
  isOpen,
  selectedCount,
  onConfirm,
  onCancel,
}: BulkFeedbackWarningModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirm Bulk Operation"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            className="rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-200">
          You are about to submit feedback for <strong>{selectedCount}</strong>{" "}
          {selectedCount === 1 ? "session" : "sessions"}. This is a bulk operation and will apply
          the same feedback to all selected sessions.
        </p>
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
          This action cannot be undone. Are you sure you want to continue?
        </p>
      </div>
    </Modal>
  );
};

export default BulkFeedbackWarningModal;
