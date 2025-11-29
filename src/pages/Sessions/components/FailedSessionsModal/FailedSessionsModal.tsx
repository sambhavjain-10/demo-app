import { useMemo } from "react";
import { Button, Modal } from "@/components";
import type { FailedSessionsModalProps } from "./types";

const FailedSessionsModal = ({
  isOpen,
  failedSessionIds,
  sessions,
  onClose,
}: FailedSessionsModalProps) => {
  const failedSessions = useMemo(() => {
    const sessionMap = new Map(sessions.map((s) => [s.id, s]));
    return failedSessionIds
      .map((id) => sessionMap.get(id))
      .filter((session): session is { id: string; title: string } => Boolean(session));
  }, [failedSessionIds, sessions]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Failed Sessions (${failedSessions.length})`}
      footer={
        <div className="flex justify-end">
          <Button
            theme="secondary"
            className="rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-200">
          The following {failedSessions.length === 1 ? "session" : "sessions"} failed to update:
        </p>
        <div className="max-h-96 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {failedSessions.map((session) => (
              <div
                key={session.id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">{session.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">#{session.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FailedSessionsModal;
