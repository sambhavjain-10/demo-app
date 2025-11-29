export type FailedSessionsModalProps = {
  isOpen: boolean;
  failedSessionIds: string[];
  sessions: Array<{ id: string; title: string }>;
  onClose: () => void;
};
