import { useState, useRef, useEffect } from "react";
import { Button, SkeletonLoader, ErrorState } from "@/components";
import { useBulkUpdateSessions } from "@/data-access";
import { useAlerts } from "@/context/AlertsContext";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_DETAILS_QUERY_KEY } from "@/data-access/useSessions/useSessions";

type FeedbackProps = {
  sessionId: string;
  feedback: string | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

const Feedback = ({ sessionId, feedback, isLoading, isError, onRetry }: FeedbackProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState(feedback ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showAlert } = useAlerts();
  const queryClient = useQueryClient();

  const bulkUpdateMutation = useBulkUpdateSessions();

  // Sync editedFeedback with feedback prop when it changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditedFeedback(feedback ?? "");
    }
  }, [feedback, isEditing]);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedFeedback(feedback ?? "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFeedback(feedback ?? "");
  };

  const handleSave = () => {
    const trimmedFeedback = editedFeedback.trim();
    const originalFeedback = feedback ?? "";
    setIsEditing(false);

    if (trimmedFeedback === originalFeedback) return;

    bulkUpdateMutation.mutate(
      {
        session_ids: [sessionId],
        feedback: trimmedFeedback,
      },
      {
        onMutate: async () => {
          // Cancel any outgoing refetches to avoid overwriting optimistic update
          await queryClient.cancelQueries({ queryKey: [SESSION_DETAILS_QUERY_KEY, sessionId] });

          // Snapshot the previous value
          const previousData = queryClient.getQueryData([SESSION_DETAILS_QUERY_KEY, sessionId]);

          // Optimistically update to the new value
          queryClient.setQueryData([SESSION_DETAILS_QUERY_KEY, sessionId], (old: any) => {
            if (!old) return old;
            return {
              ...old,
              feedback: trimmedFeedback,
            };
          });
          // Return context with the snapshotted value
          return { previousData };
        },
        onSuccess: () => {
          showAlert("success", "Feedback updated successfully.");
        },
        onError: (error, variables, context) => {
          // Rollback to the previous value on error
          if (context?.previousData) {
            queryClient.setQueryData([SESSION_DETAILS_QUERY_KEY, sessionId], context.previousData);
          }
          setIsEditing(true); // Keep in edit mode on error
          showAlert("error", "Failed to update feedback. Please try again.");
          console.error("Failed to update feedback:", error);
        },
        onSettled: () => {
          // Always refetch after error or success to ensure consistency
          queryClient.invalidateQueries({ queryKey: [SESSION_DETAILS_QUERY_KEY, sessionId] });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="mb-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Feedback
          </p>
        </div>
        <SkeletonLoader lines={2} wrapperClassName="mt-2" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Feedback
          </p>
        </div>
        <div className="mt-2">
          <ErrorState
            title="Failed to load feedback"
            description="Please try again."
            onRetry={onRetry}
            actionLabel="Retry"
            className="py-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Feedback</p>
        {!isEditing ? (
          <Button type="button" theme="secondary" className="h-7 px-3 text-xs" onClick={handleEdit}>
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              theme="secondary"
              className="h-7 px-3 text-xs"
              onClick={handleCancel}
              disabled={bulkUpdateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-7 px-3 text-xs"
              onClick={handleSave}
              disabled={bulkUpdateMutation.isPending}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editedFeedback}
          onChange={(e) => setEditedFeedback(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
          rows={4}
          placeholder="Enter feedback..."
          disabled={bulkUpdateMutation.isPending}
        />
      ) : feedback ? (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
          {feedback}
        </p>
      ) : (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No feedback available</p>
      )}
    </div>
  );
};

export default Feedback;
