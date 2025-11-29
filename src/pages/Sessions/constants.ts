import { createElement } from "react";
import type {
  SessionColumn,
  SessionColumnVisibility,
  SessionFilters,
  SessionTableRow,
} from "./types";

const scoreTone = (score: number) => {
  if (score >= 7.5) {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  if (score >= 4) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
  return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
};

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

const metricCell = (value: number) =>
  createElement(
    "div",
    {},
    createElement(
      "p",
      { className: "font-semibold text-gray-900 dark:text-gray-100" },
      value.toFixed(1)
    ),
    createElement("p", { className: "text-xs text-gray-400" }, "/10")
  );

export const TEAM_FILTER_OPTIONS = ["Sales", "Executive", "Engineering"] as const;

export const BASE_COLUMNS: SessionColumn[] = [
  {
    key: "title",
    label: "Session",
    minWidth: 240,
    render: (session: SessionTableRow) =>
      createElement(
        "div",
        { className: "space-y-1" },
        createElement(
          "p",
          { className: "font-semibold text-gray-900 dark:text-white" },
          session.title
        )
      ),
  },
  {
    key: "user",
    label: "User",
    minWidth: 200,
    render: (session: SessionTableRow) => {
      const displayName = session.userName ?? "Unknown user";
      const displayTeam = session.userTeam ?? "Team unavailable";
      return createElement(
        "div",
        { className: "space-y-1" },
        createElement(
          "p",
          { className: "font-medium text-gray-900 dark:text-gray-100" },
          displayName
        ),
        createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400" }, displayTeam)
      );
    },
  },
  {
    key: "score",
    label: "Score",
    customizable: true,
    render: (session: SessionTableRow) =>
      createElement(
        "span",
        {
          className: `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${scoreTone(session.score)}`,
        },
        session.score.toFixed(1)
      ),
  },
  {
    key: "confidence",
    label: "Confidence",
    customizable: true,
    render: (session: SessionTableRow) => metricCell(session.metrics.confidence),
  },
  {
    key: "clarity",
    label: "Clarity",
    customizable: true,
    render: (session: SessionTableRow) => metricCell(session.metrics.clarity),
  },
  {
    key: "listening",
    label: "Listening",
    customizable: true,
    render: (session: SessionTableRow) => metricCell(session.metrics.listening),
  },
  {
    key: "duration",
    label: "Duration",
    customizable: true,
    render: (session: SessionTableRow) =>
      createElement(
        "p",
        { className: "font-semibold text-gray-900 dark:text-gray-100" },
        formatDuration(session.duration)
      ),
  },
  {
    key: "createdAt",
    label: "Created",
    minWidth: 200,
    render: (session: SessionTableRow) =>
      createElement(
        "div",
        { className: "text-sm text-gray-700 dark:text-gray-200" },
        createElement("p", { className: "font-medium" }, formatDateTime(session.created_at))
      ),
  },
];

export const DEFAULT_FILTERS: SessionFilters = {
  scoreRange: [0, 10],
  dateRange: {},
  teams: [],
};

export const createColumnVisibility = () =>
  BASE_COLUMNS.reduce<SessionColumnVisibility>((acc, column) => {
    acc[column.key] = true;
    return acc;
  }, {} as SessionColumnVisibility);
