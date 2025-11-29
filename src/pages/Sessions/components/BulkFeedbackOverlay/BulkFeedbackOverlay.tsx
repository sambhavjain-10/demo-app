import { Button } from "@/components";
import type { BulkFeedbackOverlayProps } from "./types";

const BulkFeedbackOverlay = ({
  selectedCount,
  feedback,
  onFeedbackChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
  maxSelections = 100,
}: BulkFeedbackOverlayProps) => {
  if (selectedCount === 0) {
    return null;
  }

  const isAtLimit = selectedCount >= maxSelections;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                {selectedCount} {selectedCount === 1 ? "session" : "sessions"} selected
              </span>
              {isAtLimit && (
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  Maximum {maxSelections} sessions allowed
                </span>
              )}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="Enter feedback for selected sessions..."
              className="mt-3 w-full rounded-xl border border-gray-200 bg-transparent p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-3 sm:flex-col sm:justify-end">
            <Button
              type="button"
              className="rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="px-5 py-2 text-sm font-semibold"
              onClick={onSubmit}
              disabled={isSubmitting || !feedback.trim() || selectedCount === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkFeedbackOverlay;
