import type { Session } from "@/data-access";
import type { ReactNode } from "react";

export type SessionTableRow = Session & {
  userName?: string;
  userTeam?: string;
};

export type SessionColumnKey =
  | "title"
  | "user"
  | "score"
  | "confidence"
  | "clarity"
  | "listening"
  | "createdAt"
  | "duration";

export type SessionColumn = {
  key: SessionColumnKey;
  label: string;
  minWidth?: number;
  render?: (session: SessionTableRow) => ReactNode;
  customizable?: boolean;
};

export type SessionFilters = {
  scoreRange: [number, number];
  dateRange: {
    start?: string;
    end?: string;
  };
  teams: string[];
};

export type SessionColumnVisibility = Record<SessionColumnKey, boolean>;

export type SortDirection = "asc" | "desc" | null;

export type SessionSort = {
  column: SessionColumnKey | null;
  direction: SortDirection;
};
