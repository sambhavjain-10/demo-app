import type { SessionColumn, SessionColumnVisibility } from "../../types";

export type SessionsSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pageSize: number;
  columns: SessionColumn[];
  columnVisibility: SessionColumnVisibility;
  onApply: (config: { pageSize: number; columnVisibility: SessionColumnVisibility }) => void;
};
