import type { SessionTableRow } from "../../types";
import type { TranscriptEntry } from "@/data-access";

export type SessionDetailsModalProps = {
  isOpen: boolean;
  session: SessionTableRow | null;
  onClose: () => void;
};

export type TranscriptSearchResult = {
  index: number;
  entry: TranscriptEntry;
  matchIndex: number;
};
