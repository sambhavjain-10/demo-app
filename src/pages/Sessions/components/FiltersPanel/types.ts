import type { SessionFilters } from "../../types";

export type SessionsFiltersPanelProps = {
  isOpen: boolean;
  filters: SessionFilters;
  onChange: (filters: SessionFilters) => void;
  onClose: () => void;
  teamOptions: string[];
};
