import type { SessionColumn, SessionTableRow, SessionSort } from "../../types";

export type SessionsTableProps = {
  sessions: SessionTableRow[];
  columns: SessionColumn[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onRowClick?: (session: SessionTableRow) => void;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  sort?: SessionSort;
  onSortChange?: (sort: SessionSort) => void;
  enableDrag?: boolean;
  onReorder?: (sourceIndex: number, targetIndex: number) => void;
  selectedSessionIds?: Set<string>;
  onSelectionChange?: (sessionId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
};
