import { Modal } from "@/components";
import { useSessionDetails } from "@/data-access";
import Transcript from "./components/Transcript/Transcript";
import Feedback from "./components/Feedback/Feedback";
import type { SessionDetailsModalProps } from "./types";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m ${remainingSeconds.toString().padStart(2, "0")}s`;
};

const scoreTone = (score: number) => {
  if (score >= 7.5) {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  if (score >= 4) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
  return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
};

const SessionDetailsModal = ({ isOpen, session, onClose }: SessionDetailsModalProps) => {
  const sessionId = session?.id ?? null;
  const { data: sessionDetails, isLoading, isError, refetch } = useSessionDetails(sessionId);

  if (!session) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={session.title} className="max-w-[90vw] w-full">
      <div className="flex flex-col h-[calc(90vh-120px)] overflow-y-auto">
        {/* Session Info - Single Row */}
        <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50 mb-4 shrink-0">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">User</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {session.userName ?? "Unknown"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {session.userTeam ?? "Unassigned"}
            </p>
          </div>
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Score
            </p>
            <span
              className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${scoreTone(session.score)}`}
            >
              {session.score.toFixed(1)}
            </span>
          </div>
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Created
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatDateTime(session.created_at)}
            </p>
          </div>
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Duration
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatDuration(session.duration)}
            </p>
          </div>
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Confidence
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {session.metrics.confidence.toFixed(1)} / 10
            </p>
          </div>
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Clarity
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {session.metrics.clarity.toFixed(1)} / 10
            </p>
          </div>
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Listening
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {session.metrics.listening.toFixed(1)} / 10
            </p>
          </div>
        </div>

        {/* Feedback */}
        {sessionId && (
          <Feedback
            sessionId={sessionId}
            feedback={sessionDetails?.feedback}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        )}

        {/* Transcript */}
        <Transcript
          transcript={sessionDetails?.transcript ?? []}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </div>
    </Modal>
  );
};

export default SessionDetailsModal;
